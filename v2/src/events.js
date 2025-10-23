/**
 * Event handlers for the date range picker
 */
import { dom } from './dom-utils.js';
import { dayjs } from './constants.js';

export class EventHandlers {
  constructor(picker) {
    this.picker = picker;
    this.boundHandlers = new Map();
  }

  bind(element, event, handler) {
    const boundHandler = handler.bind(this.picker);
    this.boundHandlers.set(`${event}-${handler.name}`, boundHandler);
    dom.on(element, event, boundHandler);
    return boundHandler;
  }

  unbind(element, event, handlerName) {
    const key = `${event}-${handlerName}`;
    const boundHandler = this.boundHandlers.get(key);
    if (boundHandler) {
      dom.off(element, event, boundHandler);
      this.boundHandlers.delete(key);
    }
  }

  attachEventListeners() {
    const picker = this.picker;
    const container = picker.container;

    // Calendar navigation
    const calendars = dom.queryAll('.drp-calendar', container);
    calendars.forEach(calendar => {
      // Previous/Next month
      this.bind(calendar, 'click', function(e) {
        const target = e.target.closest('.prev');
        if (target) {
          this.clickPrev(e);
        }
      });

      this.bind(calendar, 'click', function(e) {
        const target = e.target.closest('.next');
        if (target) {
          this.clickNext(e);
        }
      });

      // Date selection
      this.bind(calendar, 'click', function(e) {
        const target = e.target.closest('td.available');
        if (target) {
          this.clickDate(e);
        }
      });

      this.bind(calendar, 'mouseenter', function(e) {
        const target = e.target.closest('td.available');
        if (target) {
          this.hoverDate(e);
        }
      }, true);

      // Dropdowns
      this.bind(calendar, 'change', function(e) {
        if (e.target.matches('.yearselect, .monthselect')) {
          this.monthOrYearChanged(e);
        }
      });

      this.bind(calendar, 'change', function(e) {
        if (e.target.matches('.hourselect, .minuteselect, .secondselect, .ampmselect')) {
          this.timeChanged(e);
        }
      });
    });

    // Range selection
    const rangesEl = dom.query('.ranges', container);
    if (rangesEl) {
      this.bind(rangesEl, 'click', function(e) {
        const target = e.target.closest('li');
        if (target) {
          this.clickRange(e);
        }
      });
    }

    // Buttons
    const buttonsEl = dom.query('.drp-buttons', container);
    if (buttonsEl) {
      this.bind(buttonsEl, 'click', function(e) {
        if (e.target.matches('button.applyBtn')) {
          this.clickApply(e);
        } else if (e.target.matches('button.cancelBtn')) {
          this.clickCancel(e);
        }
      });
    }

    // Element interactions
    if (dom.is(picker.element, 'input') || dom.is(picker.element, 'button')) {
      this.bind(picker.element, 'click', function(e) {
        this.show(e);
      });
      this.bind(picker.element, 'focus', function(e) {
        this.show(e);
      });
      this.bind(picker.element, 'keyup', function(e) {
        this.elementChanged(e);
      });
      this.bind(picker.element, 'keydown', function(e) {
        this.keydown(e);
      });
    } else {
      this.bind(picker.element, 'click', function(e) {
        this.toggle(e);
      });
      this.bind(picker.element, 'keydown', function(e) {
        this.toggle(e);
      });
    }

    // Document click to close (use mousedown to catch it before other handlers)
    this.bind(document, 'mousedown', function(e) {
      this.outsideClick(e);
    });
  }

  detachEventListeners() {
    // Remove all bound event listeners
    this.boundHandlers.clear();
  }
}

// Event handler methods (to be added to DateRangePicker prototype)
export const eventMethods = {
  clickPrev(e) {
    const cal = dom.closest(e.target, '.drp-calendar');
    const side = dom.hasClass(cal, 'left') ? 'left' : 'right';
    const calendar = side === 'left' ? this.leftCalendar : this.rightCalendar;
    
    calendar.month = calendar.month.subtract(1, 'month');
    this.updateCalendars();
  },

  clickNext(e) {
    const cal = dom.closest(e.target, '.drp-calendar');
    const side = dom.hasClass(cal, 'left') ? 'left' : 'right';
    const calendar = side === 'left' ? this.leftCalendar : this.rightCalendar;
    
    calendar.month = calendar.month.add(1, 'month');
    this.updateCalendars();
  },

  clickDate(e) {
    const target = e.target.closest('td.available');
    if (!target) return;

    const title = dom.attr(target, 'data-title');
    const row = title.substr(1, 8);
    const date = dayjs(row, 'YYYYMMDD');

    if (this.singleDatePicker) {
      this.setStartDate(date.clone());
      this.setEndDate(date.clone());
      if (this.autoApply) {
        this.clickApply();
      }
    } else {
      // If we have both dates selected, start over
      if (this.endDate) {
        this.endDate = null;
        this.setStartDate(date.clone());
      } 
      // If clicked date is before start, swap them
      else if (date.isBefore(this.startDate, 'day')) {
        this.setEndDate(this.startDate.clone());
        this.setStartDate(date.clone());
      } 
      // Otherwise set as end date
      else {
        this.setEndDate(date.clone());
        
        // Don't auto-close, let user click Apply button
        if (this.autoApply) {
          this.clickApply();
        }
      }
    }

    this.updateView();
  },

  hoverDate(e) {
    const target = e.target.closest('td.available');
    if (!target) return;

    const title = dom.attr(target, 'data-title');
    const row = title.substr(1, 8);
    const date = dayjs(row, 'YYYYMMDD');

    if (this.endDate) return;

    const leftCalendar = this.container.querySelector('.drp-calendar.left');
    const rightCalendar = this.container.querySelector('.drp-calendar.right');

    // Remove all in-range classes
    dom.queryAll('td', leftCalendar).forEach(td => dom.removeClass(td, 'in-range'));
    dom.queryAll('td', rightCalendar).forEach(td => dom.removeClass(td, 'in-range'));

    // Add in-range class to dates between start and hover
    if (date.isAfter(this.startDate)) {
      dom.queryAll('td.available', leftCalendar).forEach(td => {
        const tdTitle = dom.attr(td, 'data-title');
        const tdDate = dayjs(tdTitle.substr(1, 8), 'YYYYMMDD');
        if (tdDate.isAfter(this.startDate) && tdDate.isBefore(date)) {
          dom.addClass(td, 'in-range');
        }
      });
      
      dom.queryAll('td.available', rightCalendar).forEach(td => {
        const tdTitle = dom.attr(td, 'data-title');
        const tdDate = dayjs(tdTitle.substr(1, 8), 'YYYYMMDD');
        if (tdDate.isAfter(this.startDate) && tdDate.isBefore(date)) {
          dom.addClass(td, 'in-range');
        }
      });
    }
  },

  clickRange(e) {
    const target = e.target.closest('li');
    if (!target) return;

    const label = dom.attr(target, 'data-range-key');
    
    if (label === this.locale.customRangeLabel) {
      this.showCalendars();
    } else {
      const dates = this.ranges[label];
      this.setStartDate(dates[0].clone());
      this.setEndDate(dates[1].clone());

      if (this.autoApply) {
        this.clickApply();
      }

      this.updateView();
    }
  },

  clickApply(e) {
    if (e) e.preventDefault();
    // Ensure the input element is updated with the selected dates
    if (typeof this.updateElement === 'function') {
      this.updateElement();
    }

    this.hide();

    dom.trigger(this.element, 'apply.daterangepicker', {
      startDate: this.startDate,
      endDate: this.endDate
    });
  },

  clickCancel(e) {
    if (e) e.preventDefault();
    
    this.setStartDate(this.oldStartDate.clone());
    this.setEndDate(this.oldEndDate.clone());
    this.hide();
    dom.trigger(this.element, 'cancel.daterangepicker');
  },

  monthOrYearChanged(e) {
    const cal = dom.closest(e.target, '.drp-calendar');
    const side = dom.hasClass(cal, 'left') ? 'left' : 'right';
    const calendar = side === 'left' ? this.leftCalendar : this.rightCalendar;

    const month = parseInt(cal.querySelector('.monthselect')?.value || 0, 10);
    const year = parseInt(cal.querySelector('.yearselect')?.value || dayjs().year(), 10);

    calendar.month = calendar.month.month(month).year(year);
    this.updateCalendars();
  },

  timeChanged(e) {
    const cal = dom.closest(e.target, '.drp-calendar');
    const side = dom.hasClass(cal, 'left') ? 'left' : 'right';
    
    this.timePicker.update(side);
    this.updateCalendars();
  },

  elementChanged(e) {
    if (!dom.is(this.element, 'input')) return;
    if (!dom.val(this.element).length) return;

    const dateString = dom.val(this.element).split(this.locale.separator);
    let start = null;
    let end = null;

    if (dateString.length === 2) {
      start = dayjs(dateString[0], this.locale.format);
      end = dayjs(dateString[1], this.locale.format);
    }

    if (this.singleDatePicker || start === null || end === null) {
      start = dayjs(dom.val(this.element), this.locale.format);
      end = start;
    }

    if (!start.isValid() || !end.isValid()) return;

    this.setStartDate(start);
    this.setEndDate(end);
    this.updateView();
  },

  keydown(e) {
    // Hide on tab or enter
    if (e.keyCode === 9 || e.keyCode === 13) {
      this.hide();
    }

    // Hide on esc and prevent propagation
    if (e.keyCode === 27) {
      e.preventDefault();
      e.stopPropagation();
      this.hide();
    }
  },

  outsideClick(e) {
    if (!this.isShowing) return;
    
    // Check if click is on the element or container
    if (this.element.contains(e.target)) return;
    if (this.container.contains(e.target)) return;
    
    // Check if click is on a parent of the container (for dropdowns, etc.)
    if (e.target.closest('.daterangepicker')) return;
    
    this.hide();
  },

  toggle(e) {
    if (this.isShowing) {
      this.hide();
    } else {
      this.show();
    }
  },

  showCalendars() {
    dom.addClass(this.container, 'show-calendar');
    this.updateView();
  }
};
