/**
 * Tests for EventEmitter class
 */

import { EventEmitter } from '../src/lib/EventEmitter';

describe('EventEmitter', () => {
  let emitter: EventEmitter;
  
  beforeEach(() => {
    emitter = new EventEmitter();
  });
  
  test('should add and trigger event handlers', () => {
    const handler = jest.fn();
    
    emitter.on('test', handler);
    emitter.emit('test', 'arg1', 'arg2');
    
    expect(handler).toHaveBeenCalledWith('arg1', 'arg2');
  });
  
  test('should support multiple handlers for the same event', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    
    emitter.on('test', handler1);
    emitter.on('test', handler2);
    emitter.emit('test', 'data');
    
    expect(handler1).toHaveBeenCalledWith('data');
    expect(handler2).toHaveBeenCalledWith('data');
  });
  
  test('should support chaining on() calls', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    
    emitter
      .on('event1', handler1)
      .on('event2', handler2);
    
    emitter.emit('event1');
    emitter.emit('event2');
    
    expect(handler1).toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });
  
  test('should remove a specific event handler', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    
    emitter.on('test', handler1);
    emitter.on('test', handler2);
    
    emitter.off('test', handler1);
    emitter.emit('test');
    
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalled();
  });
  
  test('should remove all handlers for an event', () => {
    const handler1 = jest.fn();
    const handler2 = jest.fn();
    
    emitter.on('test', handler1);
    emitter.on('test', handler2);
    
    emitter.off('test');
    emitter.emit('test');
    
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).not.toHaveBeenCalled();
  });
  
  test('should handle errors in event handlers', () => {
    // Mock console.error to prevent actual errors from showing in test output
    const originalConsoleError = console.error;
    console.error = jest.fn();
    
    const errorHandler = jest.fn(() => {
      throw new Error('Test error');
    });
    
    const nextHandler = jest.fn();
    
    emitter.on('test', errorHandler);
    emitter.on('test', nextHandler);
    
    // This should not throw, even though one handler throws
    emitter.emit('test');
    
    expect(errorHandler).toHaveBeenCalled();
    expect(nextHandler).toHaveBeenCalled(); // Next handler should still be called
    expect(console.error).toHaveBeenCalled();
    
    // Restore console.error
    console.error = originalConsoleError;
  });
  
  test('should do nothing when emitting an event with no handlers', () => {
    // This should not throw
    expect(() => emitter.emit('nonexistent')).not.toThrow();
    
    // Add a handler then remove it
    const handler = jest.fn();
    emitter.on('test', handler);
    emitter.off('test');
    
    // This also should not throw
    expect(() => emitter.emit('test')).not.toThrow();
    
    expect(handler).not.toHaveBeenCalled();
  });
});