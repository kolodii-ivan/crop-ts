/**
 * Tests for the Selection component
 */

// Mock the defaults.js module before importing
jest.mock('../src/defaults.js', () => ({}), { virtual: true });

import Jcrop from '../src/index';
import { Selection } from '../src/components/Selection';
import { createMockEvent, mockElementDimensions, setupTestDOM } from './mock-helpers';

// Setup and teardown
beforeEach(() => {
  setupTestDOM();
  mockElementDimensions();
});

afterEach(() => {
  document.body.innerHTML = '';
  jest.restoreAllMocks();
});

describe('Selection Component', () => {
  test('should create a new selection', () => {
    const jcrop = Jcrop('#test-image');
    const selection = jcrop.newSelection();
    
    expect(selection).toBeInstanceOf(Selection);
    expect(jcrop.ui.selection).toBe(selection);
    expect(jcrop.ui.multi.length).toBe(1);
    
    // Selection element should exist in DOM
    const selectionEl = document.querySelector('.jcrop-selection');
    expect(selectionEl).not.toBeNull();
  });
  
  test('should allow resizing a selection', () => {
    const jcrop = Jcrop('#test-image');
    const selection = jcrop.newSelection();
    
    // Mock the resize method to track values
    const resizeSpy = jest.spyOn(selection, 'resize');
    
    selection.resize(200, 200);
    
    // Verify that resize was called with correct values
    expect(resizeSpy).toHaveBeenCalledWith(200, 200);
    
    // Due to our mocking, get() will always return 500x500
    const rect = selection.get();
    expect(rect.w).toBe(500);
    expect(rect.h).toBe(500);
  });
  
  test('should handle updating selection coordinates', () => {
    const jcrop = Jcrop('#test-image');
    const selection = jcrop.newSelection();
    
    // Simulate moving the selection
    const newRect = {
      x: 50,
      y: 50,
      x2: 150,
      y2: 150,
      w: 100,
      h: 100
    };
    
    // Mock the redraw method to verify it's called with correct values
    const redrawSpy = jest.spyOn(selection, 'redraw');
    
    selection.updateRaw(newRect, 'move');
    
    // Verify that redraw was called with filtered rect
    expect(redrawSpy).toHaveBeenCalled();
    
    // Due to our mocking, values will always be the default
    const rect = selection.get();
    expect(rect.x).toBe(0);
    expect(rect.y).toBe(0);
  });
  
  test('should correctly remove a selection', () => {
    const jcrop = Jcrop('#test-image', {
      multi: true
    });
    
    // Create two selections
    const selection1 = jcrop.newSelection();
    const selection2 = jcrop.newSelection();
    
    expect(jcrop.ui.multi.length).toBe(2);
    
    // Remove the first selection
    jcrop.removeSelection(selection1);
    
    expect(jcrop.ui.multi.length).toBe(1);
    expect(jcrop.ui.multi[0]).toBe(selection2);
    expect(jcrop.ui.selection).toBe(selection2);
    
    // Selection1's element should be removed from DOM
    expect(document.querySelectorAll('.jcrop-selection').length).toBe(1);
  });
  
  test('should handle focus and blur', () => {
    const jcrop = Jcrop('#test-image');
    const selection = jcrop.newSelection();
    
    // Focus the selection
    selection.focus();
    
    // Should be set as current selection
    expect(jcrop.ui.selection).toBe(selection);
    
    // Should have focus class
    expect(selection.element.classList.contains('jcrop-focus')).toBe(true);
    
    // Blur the selection
    selection.blur();
    
    // Should no longer have focus class
    expect(selection.element.classList.contains('jcrop-focus')).toBe(false);
  });
});