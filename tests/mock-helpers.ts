/**
 * Helper functions for mocking behavior in tests
 */

/**
 * Mock Element.getBoundingClientRect for consistent positioning
 */
export function mockElementDimensions(): void {
  // Mock getBoundingClientRect - simplify by always returning the same dimensions
  jest.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() => {
    return {
      bottom: 500,
      height: 500,
      left: 0,
      right: 500,
      top: 0,
      width: 500,
      x: 0,
      y: 0,
      toJSON: () => {}
    };
  });
  
  // Mock offsetWidth/offsetHeight
  jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(500);
  jest.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(500);
  
  // Mock DomUtil functions directly
  const DomUtil = require('../src/lib/DomUtil').DomUtil;
  jest.spyOn(DomUtil, 'getPosition').mockReturnValue({ left: 0, top: 0 });
  jest.spyOn(DomUtil, 'width').mockReturnValue(500);
  jest.spyOn(DomUtil, 'height').mockReturnValue(500);
}

/**
 * Create a basic DOM structure for testing
 */
export function setupTestDOM(): void {
  document.body.innerHTML = `
    <div id="image-container">
      <img id="test-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" width="500" height="500" />
    </div>
  `;
}

/**
 * Create a MockEvent with the necessary properties for testing
 */
export function createMockEvent(type: string, options: Partial<MouseEvent> = {}): MouseEvent {
  const defaults = {
    bubbles: true,
    cancelable: true,
    button: 0
  };
  
  return new MouseEvent(type, { ...defaults, ...options });
}

/**
 * Create a mock element with basic properties for testing
 */
export function createMockElement(tagName: string = 'div', attributes: Record<string, string> = {}): HTMLElement {
  const element = document.createElement(tagName);
  
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'class') {
      element.className = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  
  return element;
}

/**
 * Create a KeyboardEvent with the specified key
 */
export function createKeyboardEvent(key: string, options: Partial<KeyboardEventInit> = {}): KeyboardEvent {
  return new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options
  });
}