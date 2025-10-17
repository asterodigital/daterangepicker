# Quick Start Guide - DateRangePicker v4.0

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd v2
npm install
```

### Step 2: Build the Project

```bash
npm run build
```

This will generate files in the `dist/` folder:
- `daterangepicker.cjs.js` - CommonJS bundle
- `daterangepicker.esm.js` - ES Module bundle  
- `daterangepicker.umd.js` - UMD bundle (for browsers)
- `daterangepicker.css` - Styles
- Source maps for all files

### Step 3: View the Demo

Open `dist/demo.html` in your browser to see working examples.

Or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server dist
```

Then navigate to `http://localhost:8000/demo.html`

### Step 4: Use in Your Project

#### Option A: Browser (UMD)

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Day.js -->
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/dayjs.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/localeData.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/isBetween.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.10/plugin/customParseFormat.js"></script>
  
  <!-- DateRangePicker -->
  <link rel="stylesheet" href="dist/daterangepicker.css">
  <script src="dist/daterangepicker.umd.js"></script>
</head>
<body>
  <input type="text" id="daterange">
  
  <script>
    // Extend dayjs
    dayjs.extend(window.dayjs_plugin_localeData);
    dayjs.extend(window.dayjs_plugin_isBetween);
    dayjs.extend(window.dayjs_plugin_customParseFormat);
    
    // Create picker
    const picker = new DateRangePicker(document.getElementById('daterange'));
    
    // Listen for events
    document.getElementById('daterange').addEventListener('apply.daterangepicker', function(e) {
      console.log('Selected:', e.detail.startDate.format('YYYY-MM-DD'), 'to', e.detail.endDate.format('YYYY-MM-DD'));
    });
  </script>
</body>
</html>
```

#### Option B: ES Modules

```javascript
import DateRangePicker from './dist/daterangepicker.esm.js';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import isBetween from 'dayjs/plugin/isBetween';
import customParseFormat from 'dayjs/plugin/customParseFormat';

// Extend dayjs
dayjs.extend(localeData);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

// Create picker
const picker = new DateRangePicker(document.getElementById('daterange'), {
  startDate: dayjs().subtract(7, 'days'),
  endDate: dayjs()
});
```

#### Option C: CommonJS (Node.js)

```javascript
const DateRangePicker = require('./dist/daterangepicker.cjs.js');
const dayjs = require('dayjs');
const localeData = require('dayjs/plugin/localeData');
const isBetween = require('dayjs/plugin/isBetween');
const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(localeData);
dayjs.extend(isBetween);
dayjs.extend(customParseFormat);

const picker = new DateRangePicker(element, options);
```

## 📝 Common Examples

### Basic Date Range

```javascript
new DateRangePicker(element, {
  startDate: dayjs().subtract(7, 'days'),
  endDate: dayjs()
});
```

### Single Date Picker

```javascript
new DateRangePicker(element, {
  singleDatePicker: true
});
```

### With Time Picker

```javascript
new DateRangePicker(element, {
  timePicker: true,
  timePicker24Hour: true,
  locale: {
    format: 'YYYY-MM-DD HH:mm'
  }
});
```

### With Predefined Ranges

```javascript
new DateRangePicker(element, {
  ranges: {
    'Today': [dayjs(), dayjs()],
    'Yesterday': [dayjs().subtract(1, 'days'), dayjs().subtract(1, 'days')],
    'Last 7 Days': [dayjs().subtract(6, 'days'), dayjs()],
    'Last 30 Days': [dayjs().subtract(29, 'days'), dayjs()],
    'This Month': [dayjs().startOf('month'), dayjs().endOf('month')]
  }
});
```

### Auto Apply (No Buttons)

```javascript
new DateRangePicker(element, {
  autoApply: true
});
```

## 🎯 Next Steps

1. **Read the full documentation**: [README.md](README.md)
2. **Check migration guide**: [MIGRATION.md](MIGRATION.md) (if upgrading from v3.x)
3. **View all examples**: Open `dist/demo.html` in browser
4. **Explore the code**: Check `src/` folder for modular source files

## 🔧 Development

### Watch Mode

```bash
npm run dev
```

This will watch for changes and rebuild automatically.

### File Structure

```
v2/
├── src/              # Source files (edit these)
├── dist/             # Built files (generated, don't edit)
├── node_modules/     # Dependencies
└── package.json      # Configuration
```

## ❓ Troubleshooting

### Build fails
- Make sure Node.js 14+ is installed
- Delete `node_modules` and run `npm install` again

### Demo page doesn't work
- Make sure you built the project first: `npm run build`
- Check browser console for errors
- Ensure Day.js is loaded before DateRangePicker

### Picker doesn't show
- Verify CSS is loaded: `<link rel="stylesheet" href="dist/daterangepicker.css">`
- Check that element exists in DOM before creating picker
- Open browser DevTools to check for JavaScript errors

## 📚 Resources

- **Full API Documentation**: [README.md](README.md)
- **Migration Guide**: [MIGRATION.md](MIGRATION.md)
- **Change Log**: [CHANGELOG.md](CHANGELOG.md)
- **Project Summary**: [SUMMARY.md](SUMMARY.md)

## 💬 Need Help?

- Check the demo page for working examples
- Review the documentation files
- Open an issue on GitHub
