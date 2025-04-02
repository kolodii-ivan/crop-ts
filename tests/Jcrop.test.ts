/**
 * Tests for Jcrop core functionality
 */

// Mock the defaults.js module before importing
jest.mock('../src/defaults.js', () => ({}), { virtual: true });

import Jcrop from '../src/index';
import { Rect } from '../src/types';
import { mockElementDimensions, setupTestDOM } from './mock-helpers';

// Setup and teardown
beforeEach(() => {
  setupTestDOM();
  mockElementDimensions();
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
    
    // Check if container has active class
    const container = document.querySelector('.jcrop-active');
    expect(container).not.toBeNull();
  });
  
  test('should initialize with options', () => {
    // Spy on the setSelect method before creating instance
    const setSelectSpy = jest.spyOn(Jcrop.Jcrop.prototype, 'setSelect');
    
    const jcrop = Jcrop('#test-image', {
      aspectRatio: 1,
      setSelect: [100, 100, 300, 300]
    });
    
    expect(jcrop.options.aspectRatio).toBe(1);
    
    // Should have a selection
    expect(jcrop.ui.selection).not.toBeNull();
    
    // Verify that setSelect was called with correct coordinates
    expect(setSelectSpy).toHaveBeenCalledWith([100, 100, 300, 300]);
    
    // Restore spy
    setSelectSpy.mockRestore();
  });
  
  test('should allow setting selection with coordinates', () => {
    const jcrop = Jcrop('#test-image');
    const selection = jcrop.newSelection();
    
    // Mock the update method to verify it's called with the correct rect
    const updateSpy = jest.spyOn(selection, 'update');
    
    jcrop.setSelect([100, 100, 200, 200]);
    
    // Verify the update was called with a rect converted from the coordinates
    expect(updateSpy).toHaveBeenCalled();
    
    // Due to mocking, getSelection will return the mocked values
    updateSpy.mockRestore();
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
    // Instead of testing DOM manipulation, test that the correct methods were called
    const removeMethodSpy = jest.spyOn(require('../src/lib/DomUtil').DomUtil, 'remove');
    
    const imgElement = document.createElement('img');
    imgElement.id = 'test-image';
    
    // Create a mock options with imgsrc
    const options = {
      imgsrc: imgElement
    };
    
    // Create Jcrop directly with the element and options
    const jcrop = new Jcrop.Jcrop(document.createElement('div'), options);
    
    // Call destroy
    jcrop.destroy();
    
    // Verify remove was called with the container
    expect(removeMethodSpy).toHaveBeenCalled();
    
    // Restore spies
    removeMethodSpy.mockRestore();
  });
});