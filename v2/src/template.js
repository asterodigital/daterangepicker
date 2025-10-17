/**
 * Template rendering utilities
 */
import { dom } from './dom-utils.js';

export function renderCalendarTable() {
  return `
    <table class="table-condensed">
      <thead></thead>
      <tbody></tbody>
    </table>
  `;
}

export function renderCalendarHeader(calendar, minDate, maxDate, showWeekNumbers, showISOWeekNumbers) {
  const month = calendar.month;
  const html = [];

  html.push('<tr>');
  
  // Previous month button
  if (!minDate || minDate.isBefore(month, 'month')) {
    html.push('<th class="prev available"><span></span></th>');
  } else {
    html.push('<th></th>');
  }

  const colspan = showWeekNumbers || showISOWeekNumbers ? 6 : 5;
  
  html.push('<th colspan="' + colspan + '" class="month">');
  html.push(month.format('MMMM YYYY'));
  html.push('</th>');

  // Next month button
  if (!maxDate || maxDate.isAfter(month, 'month')) {
    html.push('<th class="next available"><span></span></th>');
  } else {
    html.push('<th></th>');
  }

  html.push('</tr>');

  return html.join('');
}

export function renderMonthYearDropdowns(calendar, minYear, maxYear, locale) {
  const month = calendar.month;
  const html = [];

  html.push('<tr>');
  html.push('<th colspan="7">');

  // Month dropdown
  html.push('<select class="monthselect">');
  for (let m = 0; m < 12; m++) {
    const selected = month.month() === m ? ' selected="selected"' : '';
    html.push('<option value="' + m + '"' + selected + '>' + locale.monthNames[m] + '</option>');
  }
  html.push('</select>');

  // Year dropdown
  html.push('<select class="yearselect">');
  for (let y = parseInt(minYear); y <= parseInt(maxYear); y++) {
    const selected = month.year() === y ? ' selected="selected"' : '';
    html.push('<option value="' + y + '"' + selected + '>' + y + '</option>');
  }
  html.push('</select>');

  html.push('</th>');
  html.push('</tr>');

  return html.join('');
}

export function renderDaysOfWeek(locale, showWeekNumbers, showISOWeekNumbers) {
  const html = [];
  
  html.push('<tr>');
  
  if (showWeekNumbers || showISOWeekNumbers) {
    html.push('<th class="week">' + locale.weekLabel + '</th>');
  }
  
  for (let i = 0; i < 7; i++) {
    html.push('<th>' + locale.daysOfWeek[i] + '</th>');
  }
  
  html.push('</tr>');
  
  return html.join('');
}

export function renderTimePicker(side, timePicker24Hour, timePickerSeconds) {
  const html = [];

  html.push('<div class="calendar-time">');
  html.push('<div></div>');
  html.push('<select class="hourselect">');
  
  const start = timePicker24Hour ? 0 : 1;
  const end = timePicker24Hour ? 23 : 12;
  
  for (let i = start; i <= end; i++) {
    const padded = i < 10 ? '0' + i : i;
    html.push('<option value="' + i + '">' + padded + '</option>');
  }
  
  html.push('</select>');
  html.push(' : ');
  html.push('<select class="minuteselect">');
  
  for (let i = 0; i < 60; i++) {
    const padded = i < 10 ? '0' + i : i;
    html.push('<option value="' + i + '">' + padded + '</option>');
  }
  
  html.push('</select>');

  if (timePickerSeconds) {
    html.push(' : ');
    html.push('<select class="secondselect">');
    
    for (let i = 0; i < 60; i++) {
      const padded = i < 10 ? '0' + i : i;
      html.push('<option value="' + i + '">' + padded + '</option>');
    }
    
    html.push('</select>');
  }

  if (!timePicker24Hour) {
    html.push('<select class="ampmselect">');
    html.push('<option value="AM">AM</option>');
    html.push('<option value="PM">PM</option>');
    html.push('</select>');
  }

  html.push('</div>');

  return html.join('');
}
