import { extend, addClass, removeClass, on, off, trigger, data } from '../src/util';

describe('util.extend', () => {
  it('should merge properties into target', () => {
    const a = { foo: 1 };
    const b = { bar: 2 };
    const c = extend(a, b);
    expect(c).toEqual({ foo: 1, bar: 2 });
    expect(c).toBe(a);
  });
});

describe('util.class manipulation', () => {
  let div: HTMLDivElement;
  beforeEach(() => {
    div = document.createElement('div');
  });
  it('addClass should add a class to element', () => {
    addClass(div, 'test');
    expect(div.classList.contains('test')).toBe(true);
  });
  it('removeClass should remove a class from element', () => {
    div.className = 'test';
    removeClass(div, 'test');
    expect(div.classList.contains('test')).toBe(false);
  });
});

describe('util event helpers', () => {
  let div: HTMLDivElement;
  beforeEach(() => {
    div = document.createElement('div');
  });
  it('on and trigger should fire event handlers', () => {
    const handler = jest.fn();
    on(div, 'click', handler);
    trigger(div, 'click');
    expect(handler).toHaveBeenCalled();
    off(div, 'click', handler);
  });
  it('off without handler should remove all handlers', () => {
    const handler = jest.fn();
    on(div, 'click', handler);
    off(div, 'click');
    trigger(div, 'click');
    expect(handler).not.toHaveBeenCalled();
  });
});

describe('util.data', () => {
  let div: HTMLDivElement;
  beforeEach(() => {
    div = document.createElement('div');
  });
  it('should set and get data values', () => {
    data(div, 'key', 123);
    expect(data(div, 'key')).toBe(123);
  });
});