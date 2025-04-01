/**
 * Tests for KeyWatcher component
 */

import Jcrop from '../src/index';
import { KeyWatcher } from '../src/components/KeyWatcher';

// Mock DOM elements and events for testing
beforeEach(() => {
  // Setup document body
  document.body.innerHTML = `
    <div id="image-container">
      <img id="test-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" width="500" height="500" />
    </div>
  `;
  
  // Mock getBoundingClientRect for consistent positioning
  Element.prototype.getBoundingClientRect = jest.fn(() => ({
    bottom: 500,
    height: 500,
    left: 0,
    right: 500,
    top: 0,
    width: 500,
    x: 0,
    y: 0,
    toJSON: () => {},
  }));
});

afterEach(() => {
  document.body.innerHTML = '';
  jest.restoreAllMocks();
});

describe('KeyWatcher Component', () => {
  test('should initialize with Jcrop', () => {
    const jcrop = Jcrop('#test-image');
    expect(jcrop.ui.keyboard).toBeDefined();
    expect(jcrop.ui.keyboard).toBeInstanceOf(KeyWatcher);
  });
  
  test('should handle arrow key events', () => {
    const jcrop = Jcrop('#test-image');
    jcrop.newSelection();
    
    // Mock the Jcrop.nudge method
    const nudgeSpy = jest.spyOn(jcrop, 'nudge');
    
    // Simulate focus
    jcrop.focus();
    
    // Mock document.activeElement to return the selection frame
    Object.defineProperty(document, 'activeElement', {
      value: jcrop.ui.selection?.frame,
      writable: true
    });
    
    // Create a keyboard event for arrow keys
    const arrowRightEvent = new KeyboardEvent('keydown', { 
      key: 'ArrowRight', 
      bubbles: true 
    });
    
    const arrowLeftEvent = new KeyboardEvent('keydown', { 
      key: 'ArrowLeft', 
      bubbles: true 
    });
    
    const arrowUpEvent = new KeyboardEvent('keydown', { 
      key: 'ArrowUp', 
      bubbles: true 
    });
    
    const arrowDownEvent = new KeyboardEvent('keydown', { 
      key: 'ArrowDown', 
      bubbles: true 
    });
    
    // Trigger the events
    document.dispatchEvent(arrowRightEvent);
    document.dispatchEvent(arrowLeftEvent);
    document.dispatchEvent(arrowUpEvent);
    document.dispatchEvent(arrowDownEvent);
    
    // Check if nudge was called with correct parameters
    expect(nudgeSpy).toHaveBeenCalledWith(1, 0); // ArrowRight
    expect(nudgeSpy).toHaveBeenCalledWith(-1, 0); // ArrowLeft
    expect(nudgeSpy).toHaveBeenCalledWith(0, -1); // ArrowUp
    expect(nudgeSpy).toHaveBeenCalledWith(0, 1); // ArrowDown
  });
  
  test('should handle shift+arrow for larger movements', () => {
    const jcrop = Jcrop('#test-image');
    jcrop.newSelection();
    
    // Mock the Jcrop.nudge method
    const nudgeSpy = jest.spyOn(jcrop, 'nudge');
    
    // Simulate focus
    jcrop.focus();
    
    // Mock document.activeElement to return the selection frame
    Object.defineProperty(document, 'activeElement', {
      value: jcrop.ui.selection?.frame,
      writable: true
    });
    
    // Create a keyboard event for shift+arrow keys
    const shiftArrowRightEvent = new KeyboardEvent('keydown', { 
      key: 'ArrowRight', 
      shiftKey: true,
      bubbles: true 
    });
    
    // Trigger the event
    document.dispatchEvent(shiftArrowRightEvent);
    
    // Check if nudge was called with larger step
    expect(nudgeSpy).toHaveBeenCalledWith(10, 0);
  });
  
  test('should handle delete key to remove selection', () => {
    const jcrop = Jcrop('#test-image', {
      multi: true
    });
    
    const selection = jcrop.newSelection();
    
    // Make sure selection is deletable
    selection.canDelete = true;
    
    // Mock the Jcrop.requestDelete method
    const requestDeleteSpy = jest.spyOn(jcrop, 'requestDelete');
    
    // Simulate focus
    jcrop.focus();
    
    // Mock document.activeElement
    Object.defineProperty(document, 'activeElement', {
      value: selection.frame,
      writable: true
    });
    
    // Create a keyboard event for delete key
    const deleteEvent = new KeyboardEvent('keydown', { 
      key: 'Delete', 
      bubbles: true 
    });
    
    // Trigger the event
    document.dispatchEvent(deleteEvent);
    
    // Check if requestDelete was called
    expect(requestDeleteSpy).toHaveBeenCalled();
  });
  
  test('should handle escape key to blur selection', () => {
    const jcrop = Jcrop('#test-image');
    const selection = jcrop.newSelection();
    
    // Mock the Jcrop.blur method
    const blurSpy = jest.spyOn(jcrop, 'blur');
    
    // Simulate focus
    jcrop.focus();
    
    // Mock document.activeElement
    Object.defineProperty(document, 'activeElement', {
      value: selection.frame,
      writable: true
    });
    
    // Create a keyboard event for escape key
    const escapeEvent = new KeyboardEvent('keydown', { 
      key: 'Escape', 
      bubbles: true 
    });
    
    // Trigger the event
    document.dispatchEvent(escapeEvent);
    
    // Check if blur was called
    expect(blurSpy).toHaveBeenCalled();
  });
  
  test('should enable and disable keyboard events', () => {
    const jcrop = Jcrop('#test-image');
    const keyWatcher = jcrop.ui.keyboard as KeyWatcher;
    
    // Mock addEventListener and removeEventListener
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    // Disable keyboard events
    keyWatcher.disable();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    // Enable keyboard events
    keyWatcher.enable();
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function), undefined);
  });
  
  test('should clean up event listeners on destroy', () => {
    const jcrop = Jcrop('#test-image');
    const keyWatcher = jcrop.ui.keyboard as KeyWatcher;
    
    // Mock the disable method
    const disableSpy = jest.spyOn(keyWatcher, 'disable');
    
    // Call destroy
    keyWatcher.destroy();
    
    // Check if disable was called
    expect(disableSpy).toHaveBeenCalled();
  });
});