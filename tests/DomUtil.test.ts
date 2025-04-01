/**
 * Tests for DomUtil utility functions
 */

import { DomUtil } from '../src/lib/DomUtil';

beforeEach(() => {
  // Setup document body
  document.body.innerHTML = `
    <div id="test-container">
      <div id="test-element" class="test-class">Test Content</div>
    </div>
  `;
});

afterEach(() => {
  document.body.innerHTML = '';
});

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
    const element = document.getElementById('test-element') as HTMLElement;
    
    DomUtil.addClass(element, 'new-class');
    expect(element.classList.contains('new-class')).toBe(true);
    
    DomUtil.removeClass(element, 'new-class');
    expect(element.classList.contains('new-class')).toBe(false);
  });
  
  test('should check if element has class', () => {
    const element = document.getElementById('test-element') as HTMLElement;
    
    expect(DomUtil.hasClass(element, 'test-class')).toBe(true);
    expect(DomUtil.hasClass(element, 'other-class')).toBe(false);
  });
  
  test('should set CSS styles', () => {
    const element = document.getElementById('test-element') as HTMLElement;
    
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
    const element = document.getElementById('test-element') as HTMLElement;
    
    // Mock element dimensions
    Object.defineProperty(element, 'offsetWidth', { value: 100 });
    Object.defineProperty(element, 'offsetHeight', { value: 50 });
    
    expect(DomUtil.width(element)).toBe(100);
    expect(DomUtil.height(element)).toBe(50);
  });
  
  test('should set element dimensions', () => {
    const element = document.getElementById('test-element') as HTMLElement;
    
    DomUtil.setDimensions(element, 200, 100);
    
    expect(element.style.width).toBe('200px');
    expect(element.style.height).toBe('100px');
  });
  
  test('should append and remove elements', () => {
    const container = document.getElementById('test-container') as HTMLElement;
    const newElement = DomUtil.createElement('div', { id: 'new-element' });
    
    DomUtil.append(container, newElement);
    expect(document.getElementById('new-element')).not.toBeNull();
    
    DomUtil.remove(newElement);
    expect(document.getElementById('new-element')).toBeNull();
  });
  
  test('should wrap an element with a new container', () => {
    const element = document.getElementById('test-element') as HTMLElement;
    const wrapper = DomUtil.createElement('div', { class: 'wrapper' });
    
    DomUtil.wrap(element, wrapper);
    
    // Element should now be inside wrapper
    expect(wrapper.contains(element)).toBe(true);
    
    // Wrapper should be in the original container
    expect(document.getElementById('test-container')?.contains(wrapper)).toBe(true);
  });
});