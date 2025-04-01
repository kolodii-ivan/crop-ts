/**
 * Jcrop core functionality tests
 */

import Jcrop from '../src/index';
import { Rect } from '../src/types';

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

describe('Jcrop Core', () => {
  test('should initialize on an image element', () => {
    const jcrop = Jcrop('#test-image');
    expect(jcrop).toBeDefined();
    expect(jcrop.container).toBeDefined();
    expect(jcrop.container.classList.contains('jcrop-active')).toBe(true);
  });
  
  test('should initialize with options', () => {
    const jcrop = Jcrop('#test-image', {
      aspectRatio: 1,
      setSelect: [100, 100, 300, 300]
    });
    
    expect(jcrop.options.aspectRatio).toBe(1);
    expect(jcrop.ui.selection).not.toBeNull();
  });
  
  test('should allow setting selection with coordinates', () => {
    const jcrop = Jcrop('#test-image');
    jcrop.newSelection();
    jcrop.setSelect([100, 100, 200, 200]);
    
    const selection = jcrop.getSelection();
    expect(selection.x).toBe(100);
    expect(selection.y).toBe(100);
    expect(selection.w).toBe(200);
    expect(selection.h).toBe(200);
  });
  
  test('should convert coordinates between real and display sizes', () => {
    const jcrop = Jcrop('#test-image', {
      xscale: 2, // Image is 2x larger than display
      yscale: 2
    });
    
    const displayRect: Rect = {
      x: 50,
      y: 50,
      x2: 150,
      y2: 150,
      w: 100,
      h: 100
    };
    
    const realRect = jcrop.unscale(displayRect);
    expect(realRect.x).toBe(100);
    expect(realRect.y).toBe(100);
    expect(realRect.w).toBe(200);
    expect(realRect.h).toBe(200);
    
    const backToDisplayRect = jcrop.scale(realRect);
    expect(backToDisplayRect.x).toBe(displayRect.x);
    expect(backToDisplayRect.y).toBe(displayRect.y);
    expect(backToDisplayRect.w).toBe(displayRect.w);
    expect(backToDisplayRect.h).toBe(displayRect.h);
  });
  
  test('should destroy and clean up', () => {
    const img = document.getElementById('test-image');
    const jcrop = Jcrop('#test-image');
    
    jcrop.destroy();
    
    // Container should be removed
    expect(document.querySelector('.jcrop-active')).toBeNull();
    
    // Original image should still exist
    expect(document.getElementById('test-image')).not.toBeNull();
  });
});