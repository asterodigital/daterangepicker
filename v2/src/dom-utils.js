/**
 * DOM utility functions to replace jQuery
 */

export const dom = {
  /**
   * Query selector wrapper
   */
  query(selector, context = document) {
    return context.querySelector(selector);
  },

  /**
   * Query selector all wrapper
   */
  queryAll(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
  },

  /**
   * Create element from HTML string
   */
  create(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
  },

  /**
   * Add class to element
   */
  addClass(element, className) {
    if (!element) return;
    element.classList.add(...className.split(' ').filter(Boolean));
  },

  /**
   * Remove class from element
   */
  removeClass(element, className) {
    if (!element) return;
    element.classList.remove(...className.split(' ').filter(Boolean));
  },

  /**
   * Toggle class on element
   */
  toggleClass(element, className) {
    if (!element) return;
    element.classList.toggle(className);
  },

  /**
   * Check if element has class
   */
  hasClass(element, className) {
    if (!element) return false;
    return element.classList.contains(className);
  },

  /**
   * Set/get attribute
   */
  attr(element, name, value) {
    if (!element) return null;
    if (value === undefined) {
      return element.getAttribute(name);
    }
    element.setAttribute(name, value);
  },

  /**
   * Remove attribute
   */
  removeAttr(element, name) {
    if (!element) return;
    element.removeAttribute(name);
  },

  /**
   * Set/get data attribute
   */
  data(element, key, value) {
    if (!element) return null;
    if (value === undefined) {
      return element.dataset[key];
    }
    element.dataset[key] = value;
  },

  /**
   * Get/set element value
   */
  val(element, value) {
    if (!element) return null;
    if (value === undefined) {
      return element.value;
    }
    element.value = value;
  },

  /**
   * Get/set HTML content
   */
  html(element, content) {
    if (!element) return null;
    if (content === undefined) {
      return element.innerHTML;
    }
    element.innerHTML = content;
  },

  /**
   * Get/set text content
   */
  text(element, content) {
    if (!element) return null;
    if (content === undefined) {
      return element.textContent;
    }
    element.textContent = content;
  },

  /**
   * Append element
   */
  append(parent, child) {
    if (!parent || !child) return;
    parent.appendChild(child);
  },

  /**
   * Prepend element
   */
  prepend(parent, child) {
    if (!parent || !child) return;
    parent.insertBefore(child, parent.firstChild);
  },

  /**
   * Remove element
   */
  remove(element) {
    if (!element) return;
    element.parentNode?.removeChild(element);
  },

  /**
   * Empty element
   */
  empty(element) {
    if (!element) return;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },

  /**
   * Check if element matches selector
   */
  is(element, selector) {
    if (!element) return false;
    return element.matches(selector);
  },

  /**
   * Find closest ancestor matching selector
   */
  closest(element, selector) {
    if (!element) return null;
    return element.closest(selector);
  },

  /**
   * Get parent element
   */
  parent(element) {
    if (!element) return null;
    return element.parentElement;
  },

  /**
   * Find elements within element
   */
  find(element, selector) {
    if (!element) return [];
    return Array.from(element.querySelectorAll(selector));
  },

  /**
   * Add event listener
   */
  on(element, event, handler, options) {
    if (!element) return;
    element.addEventListener(event, handler, options);
  },

  /**
   * Remove event listener
   */
  off(element, event, handler, options) {
    if (!element) return;
    element.removeEventListener(event, handler, options);
  },

  /**
   * Trigger custom event
   */
  trigger(element, eventName, detail = {}) {
    if (!element) return;
    const event = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      detail
    });
    element.dispatchEvent(event);
  },

  /**
   * Get element offset
   */
  offset(element) {
    if (!element) return { top: 0, left: 0 };
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top + window.pageYOffset,
      left: rect.left + window.pageXOffset
    };
  },

  /**
   * Get element position
   */
  position(element) {
    if (!element) return { top: 0, left: 0 };
    return {
      top: element.offsetTop,
      left: element.offsetLeft
    };
  },

  /**
   * Get element width
   */
  width(element) {
    if (!element) return 0;
    return element.offsetWidth;
  },

  /**
   * Get element height
   */
  height(element) {
    if (!element) return 0;
    return element.offsetHeight;
  },

  /**
   * Get outer width
   */
  outerWidth(element, includeMargin = false) {
    if (!element) return 0;
    let width = element.offsetWidth;
    if (includeMargin) {
      const style = getComputedStyle(element);
      width += parseInt(style.marginLeft) + parseInt(style.marginRight);
    }
    return width;
  },

  /**
   * Get outer height
   */
  outerHeight(element, includeMargin = false) {
    if (!element) return 0;
    let height = element.offsetHeight;
    if (includeMargin) {
      const style = getComputedStyle(element);
      height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    }
    return height;
  },

  /**
   * Show element
   */
  show(element) {
    if (!element) return;
    element.style.display = 'block';
  },

  /**
   * Hide element
   */
  hide(element) {
    if (!element) return;
    element.style.display = 'none';
  },

  /**
   * Get/set CSS
   */
  css(element, property, value) {
    if (!element) return null;
    if (typeof property === 'object') {
      Object.keys(property).forEach(key => {
        element.style[key] = property[key];
      });
      return;
    }
    if (value === undefined) {
      return getComputedStyle(element)[property];
    }
    element.style[property] = value;
  },

  /**
   * Extend/merge objects (shallow)
   */
  extend(...objects) {
    return Object.assign({}, ...objects);
  },

  /**
   * Deep extend/merge objects
   */
  extendDeep(target, ...sources) {
    if (!sources.length) return target;
    const source = sources.shift();

    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          this.extendDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }

    return this.extendDeep(target, ...sources);
  },

  /**
   * Check if value is an object
   */
  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }
};
