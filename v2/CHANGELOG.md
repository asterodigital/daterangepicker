# Changelog

## [4.0.0] - 2025-01-17

### 🎉 Major Refactoring - Breaking Changes

This is a complete rewrite of the daterangepicker with modern JavaScript practices.

### ✨ Added
- **Vanilla JavaScript implementation** - No jQuery dependency required
- **Day.js integration** - Replaced Moment.js with the lightweight Day.js library
- **Modular architecture** - Code split into logical modules for better maintainability:
  - `daterangepicker.js` - Main class
  - `calendar.js` - Calendar rendering logic
  - `timepicker.js` - Time picker functionality
  - `events.js` - Event handling
  - `template.js` - HTML template generation
  - `constants.js` - Configuration and defaults
  - `dom-utils.js` - DOM manipulation utilities
- **Rollup build system** - Modern bundler with multiple output formats:
  - ESM (ES Modules) - `daterangepicker.esm.js`
  - CJS (CommonJS) - `daterangepicker.cjs.js`
  - UMD (Universal Module Definition) - `daterangepicker.umd.js`
- **Source maps** - For easier debugging
- **Comprehensive documentation** - README, MIGRATION guide, and inline comments
- **Demo page** - Interactive examples showcasing all features

### 🔄 Changed
- **API changes** - Constructor now uses `new DateRangePicker(element, options)` instead of jQuery plugin
- **Event handling** - Uses native DOM events instead of jQuery events
- **Date library** - All Moment.js calls replaced with Day.js equivalents
- **Bundle size** - Reduced from ~150KB to ~25KB (with Day.js vs jQuery + Moment.js)

### ❌ Removed
- jQuery dependency
- Moment.js dependency
- jQuery plugin interface (`$.fn.daterangepicker`)
- Automatic instance storage in element data

### 📦 Dependencies
- **Peer Dependencies:**
  - `dayjs` ^1.11.0

### 🔧 Development Dependencies
- `@rollup/plugin-commonjs` ^25.0.7
- `@rollup/plugin-node-resolve` ^15.2.3
- `@rollup/plugin-terser` ^0.4.4
- `rollup` ^4.9.6
- `rollup-plugin-copy` ^3.5.0
- `rollup-plugin-postcss` ^4.0.2

### 📊 Performance Improvements
- ~80% reduction in total bundle size
- Faster initialization without jQuery overhead
- Better tree-shaking support with ES modules
- Native DOM methods provide better performance

### 🐛 Bug Fixes
- Improved memory management with proper event cleanup
- Better handling of edge cases in date calculations
- More robust DOM manipulation

### 📝 Migration Guide
See [MIGRATION.md](MIGRATION.md) for detailed migration instructions from v3.x to v4.0.

### ⚠️ Breaking Changes
1. **No jQuery** - Must use vanilla JavaScript
2. **Constructor change** - Use `new DateRangePicker()` instead of `$().daterangepicker()`
3. **Event listeners** - Use `addEventListener` instead of jQuery `.on()`
4. **Event detail** - Access data via `e.detail` instead of callback parameters
5. **Instance reference** - Must keep your own reference, not stored in element data
6. **Day.js** - Replace all Moment.js calls with Day.js

### 🎯 Compatibility
- Modern browsers (ES6+ support required)
- IE11 not supported (use v3.x for legacy browser support)
- Node.js 14+

---

## [3.1.0] - Previous Version

See original repository for v3.x changelog.
