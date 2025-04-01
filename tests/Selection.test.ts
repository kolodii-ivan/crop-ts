/**
 * Tests for the Selection component
 */

import Jcrop from '../src/index';
import { Selection } from '../src/components/Selection';

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

describe('Selection Component', () => {
  test('should create a new selection', () => {
    const jcrop = Jcrop('#test-image');
    const selection = jcrop.newSelection();
    
    expect(selection).toBeInstanceOf(Selection);
    expect(jcrop.ui.selection).toBe(selection);
    expect(jcrop.ui.multi.length).toBe(1);
  });
  
  test('should allow resizing a selection', () => {
    const jcrop = Jcrop('#test-image');
    const selection = jcrop.newSelection();
    
    selection.resize(200, 200);
    
    const rect = selection.get();
    expect(rect.w).toBe(200);
    expect(rect.h).toBe(200);
  });
  
  test('should apply aspect ratio constraints', () => {
    const jcrop = Jcrop('#test-image', {
      aspectRatio: 2 // Width should be 2x height
    });
    
    const selection = jcrop.newSelection();
    
    // Set up a 100x100 selection
    selection.updateRaw({
      x: 100,
      y: 100,
      x2: 200,
      y2: 200,
      w: 100,
      h: 100
    }, 'se');
    
    // Get the constrained selection
    const rect = selection.get();
    
    // Selection should maintain the 2:1 aspect ratio
    expect(rect.w / rect.h).toBeCloseTo(2, 1);
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
    
    selection.updateRaw(newRect, 'move');
    
    const rect = selection.get();
    expect(rect.x).toBe(50);
    expect(rect.y).toBe(50);
    expect(rect.w).toBe(100);
    expect(rect.h).toBe(100);
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
  });
  
  test('should emit events when selection changes', () => {
    const jcrop = Jcrop('#test-image');
    const selection = jcrop.newSelection();
    
    // Spy on event dispatching
    const dispatchEventSpy = jest.spyOn(selection.element, 'dispatchEvent');
    
    // Update selection
    selection.updateRaw({
      x: 20,
      y: 20,
      x2: 120,
      y2: 120,
      w: 100,
      h: 100
    }, 'move');
    
    // Check if event was dispatched
    expect(dispatchEventSpy).toHaveBeenCalled();
    
    // Check the event type
    const event = dispatchEventSpy.mock.calls[0][0];
    expect(event.type).toBe('cropmove');
  });
});