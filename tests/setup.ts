// Jest setup file

// Mock for window.requestAnimationFrame
global.requestAnimationFrame = callback => {
  setTimeout(callback, 0);
};

// Mock for CustomEvent if not available in JSDOM
if (typeof window.CustomEvent !== 'function') {
  class CustomEvent extends Event {
    constructor(event: string, params?: CustomEventInit) {
      params = params || { bubbles: false, cancelable: false, detail: null };
      super(event, params);
      this.detail = params.detail !== undefined ? params.detail : null;
    }
    
    detail: any;
  }
  
  global.CustomEvent = CustomEvent;
}