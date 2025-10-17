# DateRangePicker v4.0

A modern, lightweight date range picker component built with **Vanilla JavaScript** and **Day.js**. No jQuery required!

## 🎉 What's New in v4.0

- ✅ **Zero jQuery dependency** - Pure vanilla JavaScript
- ✅ **Day.js instead of Moment.js** - Smaller bundle size (~2KB vs ~67KB)
- ✅ **Modern ES6+ modules** - Tree-shakeable and optimized
- ✅ **Rollup build system** - Multiple output formats (ESM, CJS, UMD)
- ✅ **Modular architecture** - Better code organization and maintainability
- ✅ **Improved performance** - Faster rendering and event handling

## 📦 Installation

### NPM

```bash
npm install daterangepicker
```

### Yarn

```bash
yarn add daterangepicker
```

### CDN

```html
<!-- Day.js (required peer dependency) -->
<script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/localeData.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isBetween.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/customParseFormat.js"></script>

<!-- DateRangePicker -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/daterangepicker/dist/daterangepicker.css">
<script src="https://cdn.jsdelivr.net/npm/daterangepicker/dist/daterangepicker.umd.js"></script>
```

## 🚀 Quick Start

### Basic Usage

```html
<input type="text" id="daterange" />
```

```javascript
import DateRangePicker from 'daterangepicker';
import dayjs from 'dayjs';

const picker = new DateRangePicker(document.getElementById('daterange'), {
  startDate: dayjs().subtract(7, 'days'),
  endDate: dayjs()
});

// Listen for date selection
document.getElementById('daterange').addEventListener('apply.daterangepicker', function(e) {
  console.log('Start:', e.detail.startDate.format('YYYY-MM-DD'));
  console.log('End:', e.detail.endDate.format('YYYY-MM-DD'));
});
```

### With Predefined Ranges

```javascript
const picker = new DateRangePicker(element, {
  ranges: {
    'Today': [dayjs(), dayjs()],
    'Yesterday': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')],
    'Last Month': [dayjs().subtract(1, 'month').startOf('month'), dayjs().subtract(1, 'month').endOf('month')]
  }
});
```

### Single Date Picker

```javascript
const picker = new DateRangePicker(element, {
  singleDatePicker: true
});
```

### With Time Picker

```javascript
const picker = new DateRangePicker(element, {
  timePicker: true,
  timePicker24Hour: true,
  timePickerIncrement: 15,
  locale: {
    format: 'YYYY-MM-DD HH:mm'
  }
});
```

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `startDate` | dayjs/string | `dayjs()` | Initial start date |
| `endDate` | dayjs/string | `dayjs()` | Initial end date |
| `minDate` | dayjs/string | `false` | Minimum selectable date |
| `maxDate` | dayjs/string | `false` | Maximum selectable date |
| `maxSpan` | object | `false` | Maximum span between dates |
| `autoApply` | boolean | `false` | Auto apply selection without buttons |
| `singleDatePicker` | boolean | `false` | Single date picker mode |
| `showDropdowns` | boolean | `false` | Show month/year dropdowns |
| `showWeekNumbers` | boolean | `false` | Show week numbers |
| `showISOWeekNumbers` | boolean | `false` | Show ISO week numbers |
| `timePicker` | boolean | `false` | Enable time picker |
| `timePicker24Hour` | boolean | `false` | Use 24-hour format |
| `timePickerIncrement` | number | `1` | Time increment in minutes |
| `timePickerSeconds` | boolean | `false` | Show seconds in time picker |
| `linkedCalendars` | boolean | `true` | Link calendar months |
| `autoUpdateInput` | boolean | `true` | Auto update input value |
| `alwaysShowCalendars` | boolean | `false` | Always show calendars |
| `ranges` | object | `{}` | Predefined date ranges |
| `opens` | string | `'right'` | Dropdown opening direction |
| `drops` | string | `'down'` | Dropdown drop direction |
| `locale` | object | See below | Locale configuration |

### Locale Options

```javascript
{
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
}
```

## 📡 Events

### apply.daterangepicker

Triggered when the apply button is clicked or auto-apply occurs.

```javascript
element.addEventListener('apply.daterangepicker', function(e) {
  console.log(e.detail.startDate); // Day.js object
  console.log(e.detail.endDate);   // Day.js object
});
```

### cancel.daterangepicker

Triggered when the cancel button is clicked.

```javascript
element.addEventListener('cancel.daterangepicker', function(e) {
  console.log('Selection cancelled');
});
```

### show.daterangepicker

Triggered when the picker is shown.

```javascript
element.addEventListener('show.daterangepicker', function(e) {
  console.log('Picker shown');
});
```

### hide.daterangepicker

Triggered when the picker is hidden.

```javascript
element.addEventListener('hide.daterangepicker', function(e) {
  console.log('Picker hidden');
});
```

## 🔧 Methods

### setStartDate(date)

Set the start date programmatically.

```javascript
picker.setStartDate(dayjs().subtract(7, 'days'));
```

### setEndDate(date)

Set the end date programmatically.

```javascript
picker.setEndDate(dayjs());
```

### show()

Show the picker.

```javascript
picker.show();
```

### hide()

Hide the picker.

```javascript
picker.hide();
```

### remove()

Remove the picker and clean up event listeners.

```javascript
picker.remove();
```

## 🏗️ Building from Source

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Build and watch for changes
npm run dev
```

## 📁 Project Structure

```
v2/
├── src/
│   ├── daterangepicker.js    # Main class
│   ├── calendar.js            # Calendar rendering
│   ├── timepicker.js          # Time picker functionality
│   ├── events.js              # Event handlers
│   ├── template.js            # HTML templates
│   ├── constants.js           # Constants and defaults
│   ├── dom-utils.js           # DOM manipulation utilities
│   ├── daterangepicker.css    # Styles
│   └── demo.html              # Demo page
├── dist/                      # Built files
├── package.json
├── rollup.config.js
└── README.md
```

## 🔄 Migration from v3.x

### jQuery Removal

**Before (v3.x):**
```javascript
$('#daterange').daterangepicker({
  startDate: moment().subtract(7, 'days'),
  endDate: moment()
});
```

**After (v4.x):**
```javascript
new DateRangePicker(document.getElementById('daterange'), {
  startDate: dayjs().subtract(7, 'days'),
  endDate: dayjs()
});
```

### Moment.js → Day.js

Replace all `moment()` calls with `dayjs()`. The API is very similar:

```javascript
// Before
moment().subtract(7, 'days')
moment().format('YYYY-MM-DD')
moment().startOf('month')

// After
dayjs().subtract(7, 'days')
dayjs().format('YYYY-MM-DD')
dayjs().startOf('month')
```

### Event Listeners

**Before (v3.x):**
```javascript
$('#daterange').on('apply.daterangepicker', function(ev, picker) {
  console.log(picker.startDate);
});
```

**After (v4.x):**
```javascript
document.getElementById('daterange').addEventListener('apply.daterangepicker', function(e) {
  console.log(e.detail.startDate);
});
```

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Credits

- Original author: Dan Grossman
- v4 refactoring: Modern vanilla JS implementation
- Day.js: https://day.js.org/

## 🐛 Issues & Contributions

Please report issues and submit pull requests on GitHub.
