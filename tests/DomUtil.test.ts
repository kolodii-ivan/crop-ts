/**
 * Tests for DomUtil
 */

import { DomUtil } from '../src/lib/DomUtil';

describe('DomUtil', () => {
  test('should create an element with attributes and content', () => {
    const element = DomUtil.createElement('div', {
      class: 'test-class',
      'data-test': 'test-value'
    }, 'Test Content');
    
    expect(element.tagName).toBe('DIV');
    expect(element.className).toBe('test-class');
    expect(element.getAttribute('data-test')).toBe('test-value');
    expect(element.textContent).toBe('Test Content');
  });
  
  test('should add and remove classes', () => {
    const element = document.createElement('div');
    
    DomUtil.addClass(element, 'test-class');
    expect(element.classList.contains('test-class')).toBe(true);
    
    DomUtil.removeClass(element, 'test-class');
    expect(element.classList.contains('test-class')).toBe(false);
  });
  
  test('should check if element has class', () => {
    const element = document.createElement('div');
    element.className = 'test-class';
    
    expect(DomUtil.hasClass(element, 'test-class')).toBe(true);
    expect(DomUtil.hasClass(element, 'other-class')).toBe(false);
  });
  
  test('should set CSS styles', () => {
    const element = document.createElement('div');
    
    // Set a single property
    DomUtil.css(element, 'color', 'red');
    expect(element.style.color).toBe('red');
    
    // Set multiple properties
    DomUtil.css(element, {
      backgroundColor: 'blue',
      padding: '10px'
    });
    
    expect(element.style.backgroundColor).toBe('blue');
    expect(element.style.padding).toBe('10px');
  });
  
  test('should get element dimensions', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    
    // Mock offsetWidth/Height
    Object.defineProperty(element, 'offsetWidth', { value: 100 });
    Object.defineProperty(element, 'offsetHeight', { value: 50 });
    
    expect(DomUtil.width(element)).toBe(100);
    expect(DomUtil.height(element)).toBe(50);
    
    document.body.removeChild(element);
  });
  
  test('should set element dimensions', () => {
    const element = document.createElement('div');
    
    DomUtil.setDimensions(element, 200, 100);
    
    expect(element.style.width).toBe('200px');
    expect(element.style.height).toBe('100px');
  });
  
  test('should append and remove elements', () => {
    const parent = document.createElement('div');
    document.body.appendChild(parent);
    
    const child = document.createElement('span');
    
    DomUtil.append(parent, child);
    expect(parent.contains(child)).toBe(true);
    
    DomUtil.remove(child);
    expect(parent.contains(child)).toBe(false);
    
    document.body.removeChild(parent);
  });
  
  test('should wrap an element with a new container', () => {
    const element = document.createElement('div');
    element.id = 'test-element';
    document.body.appendChild(element);
    
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    
    DomUtil.wrap(element, wrapper);
    
    // Element should now be inside wrapper
    expect(wrapper.contains(element)).toBe(true);
    
    // Wrapper should be in the body
    expect(document.body.contains(wrapper)).toBe(true);
    
    document.body.removeChild(wrapper);
  });
});