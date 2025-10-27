/**
 * DateRangePicker - Vanilla JS Date Range Picker with Day.js
 * @version 4.0.0
 * @author Dan Grossman (original), Refactored for v4
 * @license MIT
 */

import { dayjs, DEFAULT_OPTIONS, DEFAULT_LOCALE, DEFAULT_TEMPLATE } from './constants.js';
import { dom } from './dom-utils.js';
import { Calendar } from './calendar.js';
import { TimePicker } from './timepicker.js';
import { EventHandlers, eventMethods } from './events.js';

class DateRangePicker {
  constructor(element, options = {}, callback) {
    // Ensure element is a DOM element
    if (typeof element === 'string') {
      element = document.querySelector(element);
    }
    
    if (!element) {
      throw new Error('DateRangePicker: Invalid element');
    }

    this.element = element;
    this.callback = callback || function() {};

    // Initialize default options
    this.parentEl = DEFAULT_OPTIONS.parentEl;
    this.startDate = dayjs().startOf('day');
    this.endDate = dayjs().endOf('day');
    this.minDate = false;
    this.maxDate = false;
    this.maxSpan = false;
    this.autoApply = false;
    this.singleDatePicker = false;
    this.showDropdowns = false;
    this.minYear = dayjs().subtract(100, 'year').format('YYYY');
    this.maxYear = dayjs().add(100, 'year').format('YYYY');
    this.showWeekNumbers = false;
    this.showISOWeekNumbers = false;
    this.showCustomRangeLabel = true;
    this.timePicker = false;
    this.timePicker24Hour = false;
    this.timePickerIncrement = 1;
    this.timePickerSeconds = false;
    this.linkedCalendars = true;
    this.autoUpdateInput = true;
    this.alwaysShowCalendars = false;
    this.ranges = {};
    this.opens = 'right';
    this.drops = 'down';
    this.buttonClasses = 'btn btn-sm';
    this.applyButtonClasses = 'btn-primary';
    this.cancelButtonClasses = 'btn-secondary';
    
    // Initialize locale
    this.locale = dom.extendDeep({}, DEFAULT_LOCALE);
    
    // Get locale data from dayjs
    try {
      this.locale.daysOfWeek = dayjs.weekdaysMin();
      this.locale.monthNames = dayjs.monthsShort();
      this.locale.firstDay = dayjs.localeData().firstDayOfWeek();
    } catch (e) {
      // Use defaults if dayjs locale data is not available
    }

    // State
    this.isShowing = false;
    this.leftCalendar = { month: dayjs() };
    this.rightCalendar = { month: dayjs().add(1, 'month') };

    // Check for class-based options
    if (dom.hasClass(this.element, 'pull-right')) {
      this.opens = 'left';
    }
    if (dom.hasClass(this.element, 'dropup')) {
      this.drops = 'up';
    }

    // Merge data attributes
    const dataOptions = this.getDataAttributes();
    options = dom.extendDeep({}, dataOptions, options);

    // Apply options
    this.applyOptions(options);

    // Create container
    this.createContainer();

    // Initialize calendar and timepicker
    this.calendar = new Calendar(this);
    this.timePicker = new TimePicker(this);

    // Attach event handlers
    this.eventHandlers = new EventHandlers(this);
    this.eventHandlers.attachEventListeners();

    // Initial render
    this.updateElement();
  }

  getDataAttributes() {
    const data = {};
    const attrs = this.element.attributes;
    
    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];
      if (attr.name.startsWith('data-')) {
        const key = attr.name.slice(5).replace(/-([a-z])/g, (g) => g[1].toUpperCase());
        try {
          data[key] = JSON.parse(attr.value);
        } catch (e) {
          data[key] = attr.value;
        }
      }
    }
    
    return data;
  }

  applyOptions(options) {
    // Locale options
    if (typeof options.locale === 'object') {
      this.locale = dom.extendDeep({}, this.locale, options.locale);
    }

    // Date options
    if (options.startDate) {
      this.startDate = typeof options.startDate === 'string' 
        ? dayjs(options.startDate, this.locale.format) 
        : dayjs(options.startDate);
    }

    if (options.endDate) {
      this.endDate = typeof options.endDate === 'string'
        ? dayjs(options.endDate, this.locale.format)
        : dayjs(options.endDate);
    }

    if (options.minDate) {
      this.minDate = typeof options.minDate === 'string'
        ? dayjs(options.minDate, this.locale.format)
        : dayjs(options.minDate);
    }

    if (options.maxDate) {
      this.maxDate = typeof options.maxDate === 'string'
        ? dayjs(options.maxDate, this.locale.format)
        : dayjs(options.maxDate);
    }

    // Sanity checks
    if (this.minDate && this.startDate.isBefore(this.minDate)) {
      this.startDate = this.minDate.clone();
    }

    if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
      this.endDate = this.maxDate.clone();
    }

    // Simple options
    const simpleOptions = [
      'applyButtonClasses', 'applyClass', 'cancelButtonClasses', 'cancelClass',
      'maxSpan', 'dateLimit', 'opens', 'drops', 'showWeekNumbers', 'showISOWeekNumbers',
      'buttonClasses', 'showDropdowns', 'minYear', 'maxYear', 'showCustomRangeLabel',
      'singleDatePicker', 'timePicker', 'timePickerSeconds', 'timePickerIncrement',
      'timePicker24Hour', 'autoApply', 'autoUpdateInput', 'linkedCalendars',
      'isInvalidDate', 'isCustomDate', 'alwaysShowCalendars', 'parentEl'
    ];

    simpleOptions.forEach(option => {
      if (options[option] !== undefined) {
        // Handle backwards compatibility
        if (option === 'applyClass') this.applyButtonClasses = options[option];
        else if (option === 'cancelClass') this.cancelButtonClasses = options[option];
        else if (option === 'dateLimit') this.maxSpan = options[option];
        else this[option] = options[option];
      }
    });

    // Button classes can be string or array
    if (typeof this.buttonClasses === 'object') {
      this.buttonClasses = this.buttonClasses.join(' ');
    }

    // Single date picker
    if (this.singleDatePicker) {
      this.endDate = this.startDate.clone();
    }

    // Time picker
    if (!this.timePicker) {
      this.startDate = this.startDate.startOf('day');
      this.endDate = this.endDate.endOf('day');
    }

    // Can't use timePicker and autoApply together
    if (this.timePicker && this.autoApply) {
      this.autoApply = false;
    }

    // Update day names order to firstDay
    if (this.locale.firstDay !== 0) {
      let iterator = this.locale.firstDay;
      while (iterator > 0) {
        this.locale.daysOfWeek.push(this.locale.daysOfWeek.shift());
        iterator--;
      }
    }

    // Parse input value if no dates provided
    if (!options.startDate && !options.endDate) {
      if (dom.is(this.element, 'input')) {
        const val = dom.val(this.element);
        if (val) {
          const split = val.split(this.locale.separator);
          
          if (split.length === 2) {
            const start = dayjs(split[0], this.locale.format);
            const end = dayjs(split[1], this.locale.format);
            
            if (start.isValid() && end.isValid()) {
              this.setStartDate(start);
              this.setEndDate(end);
            }
          } else if (this.singleDatePicker && val !== '') {
            const start = dayjs(val, this.locale.format);
            if (start.isValid()) {
              this.setStartDate(start);
              this.setEndDate(start);
            }
          }
        }
      }
    }

    // Ranges
    if (typeof options.ranges === 'object') {
      for (const range in options.ranges) {
        let start = typeof options.ranges[range][0] === 'string'
          ? dayjs(options.ranges[range][0], this.locale.format)
          : dayjs(options.ranges[range][0]);

        let end = typeof options.ranges[range][1] === 'string'
          ? dayjs(options.ranges[range][1], this.locale.format)
          : dayjs(options.ranges[range][1]);

        // Adjust for minDate/maxSpan
        if (this.minDate && start.isBefore(this.minDate)) {
          start = this.minDate.clone();
        }

        let maxDate = this.maxDate;
        if (this.maxSpan && maxDate && start.clone().add(this.maxSpan).isAfter(maxDate)) {
          maxDate = start.clone().add(this.maxSpan);
        }
        if (maxDate && end.isAfter(maxDate)) {
          end = maxDate.clone();
        }

        // Skip invalid ranges
        if ((this.minDate && end.isBefore(this.minDate, this.timePicker ? 'minute' : 'day')) ||
            (maxDate && start.isAfter(maxDate, this.timePicker ? 'minute' : 'day'))) {
          continue;
        }

        // Support unicode chars in range names
        const elem = document.createElement('textarea');
        elem.innerHTML = range;
        const rangeHtml = elem.value;

        this.ranges[rangeHtml] = [start, end];
      }
    }

    // Callback
    if (typeof options.callback === 'function') {
      this.callback = options.callback;
    }
  }

  createContainer() {
    const template = DEFAULT_TEMPLATE;
    this.container = dom.create(template);

    // Set parent element
    let parentEl = document.querySelector(this.parentEl);
    if (!parentEl) {
      parentEl = document.body;
    }
    dom.append(parentEl, this.container);

    // Add direction class
    dom.addClass(this.container, this.locale.direction);

    // Add ranges if provided
    if (Object.keys(this.ranges).length > 0) {
      const rangesList = [];
      rangesList.push('<ul>');
      
      for (const range in this.ranges) {
        rangesList.push('<li data-range-key="' + range + '">' + range + '</li>');
      }
      
      if (this.showCustomRangeLabel) {
        rangesList.push('<li data-range-key="' + this.locale.customRangeLabel + '">' + 
                       this.locale.customRangeLabel + '</li>');
      }
      
      rangesList.push('</ul>');
      
      const rangesEl = dom.query('.ranges', this.container);
      if (rangesEl) {
        rangesEl.innerHTML = rangesList.join('') + rangesEl.innerHTML;
      }
      
      dom.addClass(this.container, 'show-ranges');
    }

    // Configure for single date picker
    if (this.singleDatePicker) {
      dom.addClass(this.container, 'single');
      const leftCal = dom.query('.drp-calendar.left', this.container);
      if (leftCal) {
        dom.addClass(leftCal, 'single');
        dom.show(leftCal);
      }
      const rightCal = dom.query('.drp-calendar.right', this.container);
      if (rightCal) {
        dom.hide(rightCal);
      }
      
      if (!this.timePicker && this.autoApply) {
        dom.addClass(this.container, 'auto-apply');
      }
    }

    // Show calendar
    if (!Object.keys(this.ranges).length || this.alwaysShowCalendars) {
      dom.addClass(this.container, 'show-calendar');
    }

    // Add opens class
    dom.addClass(this.container, 'opens' + this.opens);

    // Configure buttons
    const applyBtn = dom.query('.applyBtn', this.container);
    const cancelBtn = dom.query('.cancelBtn', this.container);

    if (applyBtn) {
      dom.addClass(applyBtn, this.buttonClasses);
      if (this.applyButtonClasses) {
        dom.addClass(applyBtn, this.applyButtonClasses);
      }
      dom.html(applyBtn, this.locale.applyLabel);
    }

    if (cancelBtn) {
      dom.addClass(cancelBtn, this.buttonClasses);
      if (this.cancelButtonClasses) {
        dom.addClass(cancelBtn, this.cancelButtonClasses);
      }
      dom.html(cancelBtn, this.locale.cancelLabel);
    }

    // Hide time picker if not enabled
    if (!this.timePicker) {
      dom.queryAll('.calendar-time', this.container).forEach(el => dom.hide(el));
    }

    // Auto apply class
    if (this.autoApply) {
      dom.addClass(this.container, 'auto-apply');
    }
  }

  setStartDate(startDate) {
    if (typeof startDate === 'string') {
      this.startDate = dayjs(startDate, this.locale.format);
    } else if (typeof startDate === 'object') {
      this.startDate = dayjs(startDate);
    }

    if (!this.timePicker) {
      this.startDate = this.startDate.startOf('day');
    }

    if (this.timePicker && this.timePickerIncrement) {
      this.startDate = this.startDate.minute(
        Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement
      );
    }

    if (this.minDate && this.startDate.isBefore(this.minDate)) {
      this.startDate = this.minDate.clone();
      if (this.timePicker && this.timePickerIncrement) {
        this.startDate = this.startDate.minute(
          Math.round(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement
        );
      }
    }

    if (this.maxDate && this.startDate.isAfter(this.maxDate)) {
      this.startDate = this.maxDate.clone();
      if (this.timePicker && this.timePickerIncrement) {
        this.startDate = this.startDate.minute(
          Math.floor(this.startDate.minute() / this.timePickerIncrement) * this.timePickerIncrement
        );
      }
    }

    if (!this.isShowing) {
      this.updateElement();
    }

    this.updateMonthsInView();
  }

  setEndDate(endDate) {
    if (typeof endDate === 'string') {
      this.endDate = dayjs(endDate, this.locale.format);
    } else if (typeof endDate === 'object') {
      this.endDate = dayjs(endDate);
    }

    if (!this.timePicker) {
      this.endDate = this.endDate.endOf('day');
    }

    if (this.timePicker && this.timePickerIncrement) {
      this.endDate = this.endDate.minute(
        Math.round(this.endDate.minute() / this.timePickerIncrement) * this.timePickerIncrement
      );
    }

    if (this.endDate.isBefore(this.startDate)) {
      this.endDate = this.startDate.clone();
    }

    if (this.maxDate && this.endDate.isAfter(this.maxDate)) {
      this.endDate = this.maxDate.clone();
    }

    if (this.maxSpan && this.startDate.clone().add(this.maxSpan).isBefore(this.endDate)) {
      this.endDate = this.startDate.clone().add(this.maxSpan);
    }

    this.previousRightTime = this.endDate.clone();

    const selectedEl = dom.query('.drp-selected', this.container);
    if (selectedEl) {
      dom.html(selectedEl, 
        this.startDate.format(this.locale.format) + 
        this.locale.separator + 
        this.endDate.format(this.locale.format)
      );
    }

    if (!this.isShowing) {
      this.updateElement();
    }

    this.updateMonthsInView();
  }

  isInvalidDate() {
    return false;
  }

  isCustomDate() {
    return false;
  }

  updateView() {
    if (this.timePicker) {
      this.timePicker.render('left');
      this.timePicker.render('right');
      
      if (!this.endDate) {
        const rightSelects = dom.queryAll('.right .calendar-time select', this.container);
        rightSelects.forEach(select => {
          select.disabled = true;
          dom.addClass(select, 'disabled');
        });
      } else {
        const rightSelects = dom.queryAll('.right .calendar-time select', this.container);
        rightSelects.forEach(select => {
          select.disabled = false;
          dom.removeClass(select, 'disabled');
        });
      }
    }

    if (this.endDate) {
      const selectedEl = dom.query('.drp-selected', this.container);
      if (selectedEl) {
        dom.html(selectedEl,
          this.startDate.format(this.locale.format) +
          this.locale.separator +
          this.endDate.format(this.locale.format)
        );
      }
    }

    // Enable/disable Apply button based on selection
    const applyBtn = dom.query('.applyBtn', this.container);
    if (applyBtn) {
      if (this.endDate || this.singleDatePicker) {
        applyBtn.disabled = false;
        dom.removeAttr(applyBtn, 'disabled');
      } else {
        applyBtn.disabled = true;
        dom.attr(applyBtn, 'disabled', 'disabled');
      }
    }

    this.updateMonthsInView();
    this.updateCalendars();
  }

  updateMonthsInView() {
    this.calendar.updateMonths();
  }

  updateCalendars() {
    this.leftCalendar.locale = this.locale;
    this.rightCalendar.locale = this.locale;
    
    const leftCalendarRenderer = new Calendar(this, 'left');
    const rightCalendarRenderer = new Calendar(this, 'right');
    
    leftCalendarRenderer.render();
    if (!this.singleDatePicker) {
      rightCalendarRenderer.render();
    }
  }

  updateElement() {
    if (dom.is(this.element, 'input') && this.autoUpdateInput) {
      let newValue = this.startDate.format(this.locale.format);
      if (!this.singleDatePicker) {
        newValue += this.locale.separator + this.endDate.format(this.locale.format);
      }
      if (newValue !== dom.val(this.element)) {
        dom.val(this.element, newValue);
        dom.trigger(this.element, 'change');
      }
    }
  }

  show(e) {
    if (this.isShowing) return;

    this.oldStartDate = this.startDate.clone();
    this.oldEndDate = this.endDate.clone();

    this.updateView();

    // Position the container relative to the element
    const elementRect = this.element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    if (this.drops === 'up') {
      this.container.style.top = (elementRect.top + scrollTop - this.container.offsetHeight - 7) + 'px';
    } else {
      this.container.style.top = (elementRect.bottom + scrollTop + 7) + 'px';
    }
    
    if (this.opens === 'left') {
      this.container.style.right = (window.innerWidth - elementRect.right - scrollLeft) + 'px';
      this.container.style.left = 'auto';
    } else if (this.opens === 'center') {
      this.container.style.left = (elementRect.left + scrollLeft + (elementRect.width / 2) - (this.container.offsetWidth / 2)) + 'px';
    } else {
      this.container.style.left = (elementRect.left + scrollLeft) + 'px';
    }

    dom.show(this.container);
    this.isShowing = true;

    dom.trigger(this.element, 'show.daterangepicker', { picker: this });
  }

  hide(e) {
    if (!this.isShowing) return;

    dom.hide(this.container);
    this.isShowing = false;

    dom.trigger(this.element, 'hide.daterangepicker', { picker: this });
  }

  remove() {
    dom.remove(this.container);
    this.eventHandlers.detachEventListeners();
  }
}

// Add event methods to prototype
Object.assign(DateRangePicker.prototype, eventMethods);

export default DateRangePicker;
