/**
 * DOM utility functions to replace jQuery
 */
export class DomUtil {
  /**
   * Create an element with attributes and optional content
   */
  static createElement<K extends keyof HTMLElementTagNameMap>(
    tag: K,
    attributes: Record<string, string> = {},
    content?: string
  ): HTMLElementTagNameMap[K] {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'class') {
        element.className = value;
      } else {
        element.setAttribute(key, value);
      }
    });
    
    if (content) {
      element.textContent = content;
    }
    
    return element;
  }

  /**
   * Add class to element
   */
  static addClass(element: HTMLElement, className: string): void {
    element.classList.add(className);
  }

  /**
   * Remove class from element
   */
  static removeClass(element: HTMLElement, className: string): void {
    element.classList.remove(className);
  }

  /**
   * Toggle class on element
   */
  static toggleClass(element: HTMLElement, className: string, force?: boolean): void {
    element.classList.toggle(className, force);
  }

  /**
   * Check if element has class
   */
  static hasClass(element: HTMLElement, className: string): boolean {
    return element.classList.contains(className);
  }

  /**
   * Get element position relative to offset parent
   */
  static getPosition(element: HTMLElement): { left: number; top: number } {
    const rect = element.getBoundingClientRect();
    const offsetParent = element.offsetParent || document.body;
    const offsetRect = offsetParent.getBoundingClientRect();

    return {
      left: rect.left - offsetRect.left,
      top: rect.top - offsetRect.top
    };
  }

  /**
   * Set element CSS
   */
  static css(element: HTMLElement, styles: Partial<CSSStyleDeclaration> | string, value?: string): void {
    if (typeof styles === 'string' && value !== undefined) {
      // Single property assignment
      element.style[styles as any] = value;
    } else if (typeof styles === 'object') {
      // Multiple properties
      Object.entries(styles).forEach(([key, value]) => {
        element.style[key as any] = value as string;
      });
    }
  }

  /**
   * Get element width
   */
  static width(element: HTMLElement): number {
    return element.offsetWidth;
  }

  /**
   * Get element height
   */
  static height(element: HTMLElement): number {
    return element.offsetHeight;
  }

  /**
   * Set element dimensions
   */
  static setDimensions(element: HTMLElement, width: number, height: number): void {
    element.style.width = `${width}px`;
    element.style.height = `${height}px`;
  }

  /**
   * Attach event listener
   */
  static on(
    element: HTMLElement | Document | Window,
    event: string,
    selector: string | EventListener,
    handler?: EventListener
  ): void {
    if (typeof selector === 'function') {
      // Direct event binding
      element.addEventListener(event, selector);
    } else {
      // Delegated event binding
      element.addEventListener(event, (e) => {
        if (!handler) return;
        
        const target = e.target as HTMLElement;
        if (!target) return;

        const matchingElement = target.closest(selector);
        if (matchingElement) {
          handler.call(matchingElement, e);
        }
      });
    }
  }

  /**
   * Remove event listener
   */
  static off(
    element: HTMLElement | Document | Window,
    event: string,
    handler: EventListener
  ): void {
    element.removeEventListener(event, handler);
  }

  /**
   * Wrap an element with a new container
   */
  static wrap(element: HTMLElement, wrapper: HTMLElement): HTMLElement {
    if (element.parentNode) {
      element.parentNode.insertBefore(wrapper, element);
    }
    wrapper.appendChild(element);
    return wrapper;
  }

  /**
   * Insert element before target
   */
  static before(target: HTMLElement, element: HTMLElement): void {
    if (target.parentNode) {
      target.parentNode.insertBefore(element, target);
    }
  }

  /**
   * Append element to parent
   */
  static append(parent: HTMLElement, element: HTMLElement): void {
    parent.appendChild(element);
  }

  /**
   * Remove element from DOM
   */
  static remove(element: HTMLElement): void {
    if (element.parentNode) {
      element.parentNode.removeChild(element);
    }
  }

  /**
   * Get computed style value
   */
  static getComputedStyle(element: HTMLElement, property: string): string {
    return window.getComputedStyle(element).getPropertyValue(property);
  }
}