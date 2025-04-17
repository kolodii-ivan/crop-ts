// Minimal DOM and utility helpers to replace jQuery

// Shallow merge of source objects into target
export function extend<T, U>(target: T, source: U): T & U;
export function extend<T, U, V>(target: T, source1: U, source2: V): T & U & V;
export function extend(target: any, ...sources: any[]): any {
  sources.forEach(source => {
    if (source && typeof source === 'object') {
      Object.keys(source).forEach(key => {
        target[key] = source[key];
      });
    }
  });
  return target;
}

// Class manipulation helpers
export function addClass(el: Element, className: string): void {
  el.classList.add(className);
}

export function removeClass(el: Element, className: string): void {
  el.classList.remove(className);
}

// Event handling helpers
// Event handlers accept EventTarget (elements, window, document)
type EventHandler = (evt: Event) => any;
const handlersMap = new WeakMap<EventTarget, Map<string, Set<EventHandler>>>();

export function on(el: EventTarget, type: string, handler: EventHandler): void {
  el.addEventListener(type, handler);
  let map = handlersMap.get(el);
  if (!map) {
    map = new Map();
    handlersMap.set(el, map);
  }
  let set = map.get(type);
  if (!set) {
    set = new Set();
    map.set(type, set);
  }
  set.add(handler);
}

export function off(el: EventTarget, type: string, handler?: EventHandler): void {
  const map = handlersMap.get(el);
  if (!map) return;
  const set = map.get(type);
  if (!set) return;
  if (handler) {
    el.removeEventListener(type, handler);
    set.delete(handler);
  } else {
    set.forEach(h => el.removeEventListener(type, h));
    set.clear();
  }
}

export function trigger(el: Element, type: string, detail?: any): void {
  const evt = new CustomEvent(type, { detail, bubbles: true, cancelable: true });
  el.dispatchEvent(evt);
}

// Data storage helper (per-element)
const dataMap = new WeakMap<Element, Map<string, any>>();

export function data(el: Element, key: string): any;
export function data(el: Element, key: string, value: any): void;
export function data(el: Element, key: string, value?: any): any {
  let map = dataMap.get(el);
  if (!map) {
    map = new Map();
    dataMap.set(el, map);
  }
  if (arguments.length === 2) {
    return map.get(key);
  } else {
    map.set(key, value);
  }
}