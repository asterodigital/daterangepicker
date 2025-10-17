# Migration Guide: v3.x to v4.0

This guide will help you migrate from DateRangePicker v3.x (jQuery + Moment.js) to v4.0 (Vanilla JS + Day.js).

## Overview of Changes

### Dependencies
- ❌ **Removed:** jQuery
- ❌ **Removed:** Moment.js
- ✅ **Added:** Day.js (peer dependency)

### Bundle Size Comparison
- **v3.x:** ~150KB (with jQuery + Moment.js)
- **v4.x:** ~25KB (with Day.js)

## Step-by-Step Migration

### 1. Update Dependencies

**Remove old dependencies:**
```bash
npm uninstall jquery moment
```

**Install new dependencies:**
```bash
npm install daterangepicker@4.0.0 dayjs
```

### 2. Update HTML

**Before (v3.x):**
```html
<script src="jquery.min.js"></script>
<script src="moment.min.js"></script>
<script src="daterangepicker.js"></script>
<link rel="stylesheet" href="daterangepicker.css">
```

**After (v4.x):**
```html
<!-- Day.js with required plugins -->
<script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/localeData.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isBetween.js"></script>
<script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/customParseFormat.js"></script>

<!-- DateRangePicker -->
<link rel="stylesheet" href="daterangepicker.css">
<script src="daterangepicker.umd.js"></script>

<script>
  // Extend dayjs with plugins
  dayjs.extend(window.dayjs_plugin_localeData);
  dayjs.extend(window.dayjs_plugin_isBetween);
  dayjs.extend(window.dayjs_plugin_customParseFormat);
</script>
```

### 3. Update Initialization

**Before (v3.x):**
```javascript
$('#daterange').daterangepicker({
  startDate: moment().subtract(7, 'days'),
  endDate: moment(),
  ranges: {
    'Today': [moment(), moment()],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()]
  }
}, function(start, end, label) {
  console.log('Callback:', start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
});
```

**After (v4.x):**
```javascript
const picker = new DateRangePicker(document.getElementById('daterange'), {
  startDate: dayjs().subtract(7, 'days'),
  endDate: dayjs(),
  ranges: {
    'Today': [dayjs(), dayjs()],
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()]
  }
});

document.getElementById('daterange').addEventListener('apply.daterangepicker', function(e) {
  console.log('Callback:', e.detail.startDate.format('YYYY-MM-DD'), e.detail.endDate.format('YYYY-MM-DD'));
});
```

### 4. Update Event Handlers

**Before (v3.x):**
```javascript
$('#daterange').on('apply.daterangepicker', function(ev, picker) {
  console.log(picker.startDate.format('YYYY-MM-DD'));
  console.log(picker.endDate.format('YYYY-MM-DD'));
});

$('#daterange').on('cancel.daterangepicker', function(ev, picker) {
  console.log('Cancelled');
});

$('#daterange').on('show.daterangepicker', function(ev, picker) {
  console.log('Shown');
});

$('#daterange').on('hide.daterangepicker', function(ev, picker) {
  console.log('Hidden');
});
```

**After (v4.x):**
```javascript
const element = document.getElementById('daterange');

element.addEventListener('apply.daterangepicker', function(e) {
  console.log(e.detail.startDate.format('YYYY-MM-DD'));
  console.log(e.detail.endDate.format('YYYY-MM-DD'));
});

element.addEventListener('cancel.daterangepicker', function(e) {
  console.log('Cancelled');
});

element.addEventListener('show.daterangepicker', function(e) {
  console.log('Shown');
});

element.addEventListener('hide.daterangepicker', function(e) {
  console.log('Hidden');
});
```

### 5. Update Method Calls

**Before (v3.x):**
```javascript
// Get picker instance
var picker = $('#daterange').data('daterangepicker');

// Set dates
picker.setStartDate(moment().subtract(7, 'days'));
picker.setEndDate(moment());

// Show/hide
picker.show();
picker.hide();

// Remove
$('#daterange').data('daterangepicker').remove();
```

**After (v4.x):**
```javascript
// Keep reference to picker instance
const picker = new DateRangePicker(document.getElementById('daterange'));

// Set dates
picker.setStartDate(dayjs().subtract(7, 'days'));
picker.setEndDate(dayjs());

// Show/hide
picker.show();
picker.hide();

// Remove
picker.remove();
```

### 6. Update DOM Selectors

**Before (v3.x):**
```javascript
// jQuery selectors
$('#daterange').daterangepicker(options);
$('.daterange-class').daterangepicker(options);
$('input[name="daterange"]').daterangepicker(options);
```

**After (v4.x):**
```javascript
// Native DOM selectors
new DateRangePicker(document.getElementById('daterange'), options);
new DateRangePicker(document.querySelector('.daterange-class'), options);
new DateRangePicker(document.querySelector('input[name="daterange"]'), options);

// Multiple elements
document.querySelectorAll('.daterange-class').forEach(element => {
  new DateRangePicker(element, options);
});
```

### 7. Moment.js to Day.js API Changes

Most Moment.js methods work the same in Day.js:

```javascript
// These work identically
dayjs().format('YYYY-MM-DD')
dayjs().add(1, 'day')
dayjs().subtract(7, 'days')
dayjs().startOf('month')
dayjs().endOf('week')
dayjs().isBefore(otherDate)
dayjs().isAfter(otherDate)
dayjs().isSame(otherDate, 'day')

// Differences
// Moment.js
moment().week()           // Get week number
moment().isoWeek()        // Get ISO week number

// Day.js (requires plugins)
dayjs().week()            // Requires weekOfYear plugin
dayjs().isoWeek()         // Requires isoWeek plugin
```

### 8. Module Imports (ES6)

**Before (v3.x):**
```javascript
import $ from 'jquery';
import moment from 'moment';
import 'daterangepicker';

$('#daterange').daterangepicker({
  startDate: moment()
});
```

**After (v4.x):**
```javascript
import DateRangePicker from 'daterangepicker';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(localeData);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

new DateRangePicker(document.getElementById('daterange'), {
  startDate: dayjs()
});
```

## Common Patterns

### Pattern 1: Multiple Pickers on Page

**Before (v3.x):**
```javascript
$('.daterange').each(function() {
  $(this).daterangepicker(options);
});
```

**After (v4.x):**
```javascript
document.querySelectorAll('.daterange').forEach(element => {
  new DateRangePicker(element, options);
});
```

### Pattern 2: Dynamic Picker Creation

**Before (v3.x):**
```javascript
function createPicker(elementId) {
  $('#' + elementId).daterangepicker(options);
}
```

**After (v4.x):**
```javascript
function createPicker(elementId) {
  return new DateRangePicker(document.getElementById(elementId), options);
}
```

### Pattern 3: Accessing Picker Data

**Before (v3.x):**
```javascript
var picker = $('#daterange').data('daterangepicker');
var start = picker.startDate;
var end = picker.endDate;
```

**After (v4.x):**
```javascript
// Keep reference when creating
const picker = new DateRangePicker(element, options);
const start = picker.startDate;
const end = picker.endDate;
```

## Breaking Changes

### 1. No jQuery Plugin Interface
- v3.x: `$('#element').daterangepicker()`
- v4.x: `new DateRangePicker(element)`

### 2. Event Detail Structure
- v3.x: `function(ev, picker) { picker.startDate }`
- v4.x: `function(e) { e.detail.startDate }`

### 3. No Automatic Data Storage
- v3.x: Automatically stored in `$(element).data('daterangepicker')`
- v4.x: You must keep your own reference to the picker instance

### 4. Callback Function
- v3.x: Third parameter `function(start, end, label)`
- v4.x: Use `apply.daterangepicker` event listener instead

## Troubleshooting

### Issue: "dayjs is not defined"
**Solution:** Make sure Day.js is loaded before DateRangePicker:
```html
<script src="dayjs.min.js"></script>
<script src="daterangepicker.umd.js"></script>
```

### Issue: "isBetween is not a function"
**Solution:** Load and extend Day.js with required plugins:
```javascript
dayjs.extend(window.dayjs_plugin_isBetween);
```

### Issue: Picker not showing
**Solution:** Make sure CSS is loaded:
```html
<link rel="stylesheet" href="daterangepicker.css">
```

### Issue: Events not firing
**Solution:** Use native event listeners, not jQuery:
```javascript
// ❌ Wrong
$('#element').on('apply.daterangepicker', handler);

// ✅ Correct
document.getElementById('element').addEventListener('apply.daterangepicker', handler);
```

## Performance Benefits

- **Smaller bundle:** ~80% reduction in total size
- **Faster initialization:** No jQuery overhead
- **Better tree-shaking:** ES6 modules allow better optimization
- **Modern browser APIs:** Native DOM methods are faster

## Need Help?

If you encounter issues during migration:
1. Check the [README.md](README.md) for full API documentation
2. Review the [demo.html](src/demo.html) for working examples
3. Open an issue on GitHub with your specific problem

## Gradual Migration Strategy

If you have a large codebase, consider this approach:

1. **Phase 1:** Install v4 alongside v3
2. **Phase 2:** Migrate new features to v4
3. **Phase 3:** Gradually migrate existing features
4. **Phase 4:** Remove v3 dependencies

This allows you to migrate incrementally without breaking existing functionality.
