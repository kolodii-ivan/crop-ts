/**
 * Tests for KeyWatcher component
 */

// Mock the defaults.js module before importing
jest.mock('../src/defaults.js', () => ({}), { virtual: true });

import Jcrop from '../src/index';
import { KeyWatcher } from '../src/components/KeyWatcher';
import { createKeyboardEvent, mockElementDimensions, setupTestDOM } from './mock-helpers';

// Setup and teardown
beforeEach(() => {
  setupTestDOM();
  mockElementDimensions();
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
    
    // Simulate focus - set activeElement
    Object.defineProperty(document, 'activeElement', {
      configurable: true,
      get: jest.fn(() => jcrop.ui.selection?.frame)
    });
    
    // Mock KeyWatcher.hasFocus to return true
    const hasFocusSpy = jest.spyOn(jcrop.ui.keyboard as KeyWatcher, 'hasFocus').mockReturnValue(true);
    
    // Create and dispatch arrow key events
    document.dispatchEvent(createKeyboardEvent('ArrowRight'));
    document.dispatchEvent(createKeyboardEvent('ArrowLeft'));
    document.dispatchEvent(createKeyboardEvent('ArrowUp'));
    document.dispatchEvent(createKeyboardEvent('ArrowDown'));
    
    // Check if nudge was called with correct parameters
    expect(nudgeSpy).toHaveBeenCalledWith(1, 0); // ArrowRight
    expect(nudgeSpy).toHaveBeenCalledWith(-1, 0); // ArrowLeft
    expect(nudgeSpy).toHaveBeenCalledWith(0, -1); // ArrowUp
    expect(nudgeSpy).toHaveBeenCalledWith(0, 1); // ArrowDown
    
    // Clean up mock
    hasFocusSpy.mockRestore();
  });
  
  test('should handle shift+arrow for larger movements', () => {
    const jcrop = Jcrop('#test-image');
    jcrop.newSelection();
    
    // Mock the Jcrop.nudge method
    const nudgeSpy = jest.spyOn(jcrop, 'nudge');
    
    // Mock KeyWatcher.hasFocus to return true
    const hasFocusSpy = jest.spyOn(jcrop.ui.keyboard as KeyWatcher, 'hasFocus').mockReturnValue(true);
    
    // Create and dispatch shift+arrow key event
    document.dispatchEvent(createKeyboardEvent('ArrowRight', { shiftKey: true }));
    
    // Check if nudge was called with larger step
    expect(nudgeSpy).toHaveBeenCalledWith(10, 0);
    
    // Clean up mock
    hasFocusSpy.mockRestore();
  });
  
  test('should handle delete key to remove selection', () => {
    const jcrop = Jcrop('#test-image', {
      multi: true
    });
    
    const selection = jcrop.newSelection();
    selection.canDelete = true;
    
    // Mock the Jcrop.requestDelete method
    const requestDeleteSpy = jest.spyOn(jcrop, 'requestDelete');
    
    // Mock KeyWatcher.hasFocus to return true
    const hasFocusSpy = jest.spyOn(jcrop.ui.keyboard as KeyWatcher, 'hasFocus').mockReturnValue(true);
    
    // Create and dispatch delete key event
    document.dispatchEvent(createKeyboardEvent('Delete'));
    
    // Check if requestDelete was called
    expect(requestDeleteSpy).toHaveBeenCalled();
    
    // Clean up mock
    hasFocusSpy.mockRestore();
  });
  
  test('should enable and disable keyboard events', () => {
    const jcrop = Jcrop('#test-image');
    const keyWatcher = jcrop.ui.keyboard as KeyWatcher;
    
    // Spy on document event listeners
    const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
    
    // Initially, it should be enabled, so let's disable it
    keyWatcher.disable();
    
    // removeEventListener should have been called
    expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
    
    // Now enable it again
    keyWatcher.enable();
    
    // addEventListener should have been called
    expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
  });
});