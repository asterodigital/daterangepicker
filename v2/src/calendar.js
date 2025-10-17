/**
 * Calendar rendering and management
 */
import { dayjs } from './constants.js';
import { dom } from './dom-utils.js';
import { renderCalendarHeader, renderMonthYearDropdowns, renderDaysOfWeek } from './template.js';

export class Calendar {
  constructor(picker, side) {
    this.picker = picker;
    this.side = side;
    this.month = dayjs();
  }

  render() {
    const calendar = this.side === 'left' ? this.picker.leftCalendar : this.picker.rightCalendar;
    const month = calendar.month;
    const html = [];

    // Table header
    html.push('<table class="table-condensed">');
    html.push('<thead>');
    
    // Month/Year navigation or dropdowns
    if (this.picker.showDropdowns) {
      html.push(renderMonthYearDropdowns(calendar, this.picker.minYear, this.picker.maxYear, this.picker.locale));
    } else {
      html.push(renderCalendarHeader(calendar, this.picker.minDate, this.picker.maxDate, this.picker.showWeekNumbers, this.picker.showISOWeekNumbers));
    }
    
    // Days of week
    html.push(renderDaysOfWeek(this.picker.locale, this.picker.showWeekNumbers, this.picker.showISOWeekNumbers));
    
    html.push('</thead>');
    html.push('<tbody>');

    // Calendar days
    const minDate = this.picker.minDate ? this.picker.minDate.clone() : null;
    const maxDate = this.picker.maxDate ? this.picker.maxDate.clone() : null;
    const selected = this.picker.startDate.clone();
    const endDate = this.picker.endDate ? this.picker.endDate.clone() : null;

    // Build calendar grid
    // Get first day of month, then go back to start of week
    let firstDay = month.clone().startOf('month');
    const dayOfWeek = firstDay.day();
    const firstDayOfWeek = this.picker.locale.firstDay;
    let diff = dayOfWeek - firstDayOfWeek;
    if (diff < 0) diff += 7;
    firstDay = firstDay.subtract(diff, 'day');
    
    // Get last day of month, then go forward to end of week
    let lastDay = month.clone().endOf('month');
    const lastDayOfWeek = lastDay.day();
    let diffEnd = 6 - ((lastDayOfWeek - firstDayOfWeek + 7) % 7);
    lastDay = lastDay.add(diffEnd, 'day');
    
    let currentDate = firstDay.clone();
    
    while (currentDate.isBefore(lastDay) || currentDate.isSame(lastDay, 'day')) {
      const row = [];
      
      // Week number
      if (this.picker.showWeekNumbers) {
        row.push('<td class="week">' + currentDate.week() + '</td>');
      } else if (this.picker.showISOWeekNumbers) {
        row.push('<td class="week">' + currentDate.isoWeek() + '</td>');
      }

      // Days
      for (let col = 0; col < 7; col++) {
        const classes = [];
        
        // Check if date is in current month
        if (!currentDate.isSame(month, 'month')) {
          classes.push('off', 'ends');
        }

        // Check if date is disabled
        const isDisabled = (minDate && currentDate.isBefore(minDate, 'day')) ||
                          (maxDate && currentDate.isAfter(maxDate, 'day')) ||
                          (this.picker.isInvalidDate && this.picker.isInvalidDate(currentDate));

        if (isDisabled) {
          classes.push('off', 'disabled');
        } else {
          classes.push('available');
        }

        // Check if date is in selected range
        if (currentDate.isSame(selected, 'day')) {
          classes.push('active', 'start-date');
        }
        if (endDate && currentDate.isSame(endDate, 'day')) {
          classes.push('active', 'end-date');
        }
        if (endDate && currentDate.isAfter(selected, 'day') && currentDate.isBefore(endDate, 'day')) {
          classes.push('in-range');
        }

        // Check if date is today
        if (currentDate.isSame(dayjs(), 'day')) {
          classes.push('today');
        }

        // Custom date classes
        if (this.picker.isCustomDate) {
          const customClass = this.picker.isCustomDate(currentDate);
          if (customClass) {
            classes.push(customClass);
          }
        }

        const cname = classes.join(' ');
        const title = 'r' + currentDate.format('YYYYMMDD');
        
        row.push('<td class="' + cname + '" data-title="' + title + '">' + currentDate.date() + '</td>');
        
        currentDate = currentDate.add(1, 'day');
      }

      html.push('<tr>' + row.join('') + '</tr>');
      
      // Break if we've reached the end of the month view
      if (currentDate.isAfter(lastDay)) {
        break;
      }
    }

    html.push('</tbody>');
    html.push('</table>');

    const container = this.picker.container.querySelector('.drp-calendar.' + this.side + ' .calendar-table');
    if (container) {
      container.innerHTML = html.join('');
    }
  }

  updateMonths() {
    if (this.picker.endDate) {
      // If both dates are visible already, do nothing
      if (!this.picker.singleDatePicker && 
          this.picker.leftCalendar.month && 
          this.picker.rightCalendar.month &&
          (this.picker.startDate.format('YYYY-MM') === this.picker.leftCalendar.month.format('YYYY-MM') || 
           this.picker.startDate.format('YYYY-MM') === this.picker.rightCalendar.month.format('YYYY-MM')) &&
          (this.picker.endDate.format('YYYY-MM') === this.picker.leftCalendar.month.format('YYYY-MM') || 
           this.picker.endDate.format('YYYY-MM') === this.picker.rightCalendar.month.format('YYYY-MM'))) {
        return;
      }

      this.picker.leftCalendar.month = this.picker.startDate.clone().date(2);
      
      if (!this.picker.linkedCalendars && 
          (this.picker.endDate.month() !== this.picker.startDate.month() || 
           this.picker.endDate.year() !== this.picker.startDate.year())) {
        this.picker.rightCalendar.month = this.picker.endDate.clone().date(2);
      } else {
        this.picker.rightCalendar.month = this.picker.startDate.clone().date(2).add(1, 'month');
      }
    } else {
      if (this.picker.leftCalendar.month.format('YYYY-MM') !== this.picker.startDate.format('YYYY-MM') && 
          this.picker.rightCalendar.month.format('YYYY-MM') !== this.picker.startDate.format('YYYY-MM')) {
        this.picker.leftCalendar.month = this.picker.startDate.clone().date(2);
        this.picker.rightCalendar.month = this.picker.startDate.clone().date(2).add(1, 'month');
      }
    }

    if (this.picker.maxDate && 
        this.picker.linkedCalendars && 
        !this.picker.singleDatePicker && 
        this.picker.rightCalendar.month.isAfter(this.picker.maxDate)) {
      this.picker.rightCalendar.month = this.picker.maxDate.clone().date(2);
      this.picker.leftCalendar.month = this.picker.maxDate.clone().date(2).subtract(1, 'month');
    }
  }
}
