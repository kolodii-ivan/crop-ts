/**
 * Tests for the RatioFilter
 */

import { RatioFilter } from '../src/filters/RatioFilter';
import { Rect } from '../src/types';

describe('RatioFilter', () => {
  let filter: RatioFilter;
  let mockSelection: any;
  
  beforeEach(() => {
    filter = new RatioFilter();
    
    // Set up mock selection with aspectRatio
    mockSelection = {
      aspectRatio: 2 // 2:1 ratio (width:height)
    };
    
    // Mock core
    filter.core = {
      options: {}
    };
  });
  
  test('should maintain aspect ratio when resizing from east', () => {
    const rect: Rect = {
      x: 100,
      y: 100,
      x2: 200,
      y2: 150,
      w: 100,
      h: 50
    };
    
    // Simulate dragging east edge to make width 200px
    const newRect: Rect = {
      x: 100,
      y: 100,
      x2: 300,
      y2: 150,
      w: 200,
      h: 50
    };
    
    // Filter should adjust height to maintain 2:1 ratio
    const result = filter.filter(newRect, 'e', mockSelection);
    
    // Height should be half the width (2:1 ratio)
    expect(result.w / result.h).toBeCloseTo(2, 5);
    expect(result.w).toBe(200);
    expect(result.h).toBeCloseTo(100, 5);
    
    // The x position shouldn't change when dragging east
    expect(result.x).toBe(newRect.x);
    
    // The y2 position should be adjusted to increase height
    expect(result.y2).toBeCloseTo(result.y + 100, 5);
  });
  
  test('should maintain aspect ratio when resizing from south', () => {
    const rect: Rect = {
      x: 100,
      y: 100,
      x2: 300,
      y2: 150,
      w: 200,
      h: 50
    };
    
    // Simulate dragging south edge to make height 100px
    const newRect: Rect = {
      x: 100,
      y: 100,
      x2: 300,
      y2: 200,
      w: 200,
      h: 100
    };
    
    // Filter should adjust width to maintain 2:1 ratio
    const result = filter.filter(newRect, 's', mockSelection);
    
    // Width should be twice the height (2:1 ratio)
    expect(result.w / result.h).toBeCloseTo(2, 5);
    
    // When dragging south, height is correct, width needs adjustment
    expect(result.h).toBe(100);
    expect(result.w).toBeCloseTo(200, 5);
    
    // The y position shouldn't change when dragging south
    expect(result.y).toBe(newRect.y);
  });
  
  test('should not affect the rect if aspectRatio is 0', () => {
    mockSelection.aspectRatio = 0;
    
    const rect: Rect = {
      x: 100,
      y: 100,
      x2: 200,
      y2: 150,
      w: 100,
      h: 50
    };
    
    const result = filter.filter(rect, 'se', mockSelection);
    
    // Should not modify the rectangle
    expect(result).toEqual(rect);
  });
});