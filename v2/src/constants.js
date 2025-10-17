/**
 * Constants and default configuration
 */
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isoWeek from 'dayjs/plugin/isoWeek';

// Extend dayjs with required plugins
dayjs.extend(localeData);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

export const DEFAULT_LOCALE = {
  direction: 'ltr',
  format: 'MM/DD/YYYY',
  separator: ' - ',
  applyLabel: 'Apply',
  cancelLabel: 'Cancel',
  weekLabel: 'W',
  customRangeLabel: 'Custom Range',
  daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  monthNames: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  firstDay: 0
};

export const DEFAULT_TEMPLATE = `
<div class="daterangepicker">
  <div class="ranges"></div>
  <div class="drp-calendar left">
    <div class="calendar-table"></div>
    <div class="calendar-time"></div>
  </div>
  <div class="drp-calendar right">
    <div class="calendar-table"></div>
    <div class="calendar-time"></div>
  </div>
  <div class="drp-buttons">
    <span class="drp-selected"></span>
    <button class="cancelBtn" type="button"></button>
    <button class="applyBtn" disabled="disabled" type="button"></button>
  </div>
</div>
`;

export const DEFAULT_OPTIONS = {
  parentEl: 'body',
  startDate: dayjs().startOf('day'),
  endDate: dayjs().endOf('day'),
  minDate: false,
  maxDate: false,
  maxSpan: false,
  autoApply: false,
  singleDatePicker: false,
  showDropdowns: false,
  minYear: dayjs().subtract(100, 'year').format('YYYY'),
  maxYear: dayjs().add(100, 'year').format('YYYY'),
  showWeekNumbers: false,
  showISOWeekNumbers: false,
  showCustomRangeLabel: true,
  timePicker: false,
  timePicker24Hour: false,
  timePickerIncrement: 1,
  timePickerSeconds: false,
  linkedCalendars: true,
  autoUpdateInput: true,
  alwaysShowCalendars: false,
  ranges: {},
  opens: 'right',
  drops: 'down',
  buttonClasses: 'btn btn-sm',
  applyButtonClasses: 'btn-primary',
  cancelButtonClasses: 'btn-default',
  locale: DEFAULT_LOCALE,
  template: DEFAULT_TEMPLATE
};

export { dayjs };
