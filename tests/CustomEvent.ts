/**
 * CustomEvent polyfill for testing
 */

export class CustomEventPolyfill<T = any> implements CustomEvent<T> {
  readonly bubbles: boolean;
  readonly cancelable: boolean;
  readonly composed: boolean;
  readonly currentTarget: EventTarget | null = null;
  readonly defaultPrevented: boolean = false;
  readonly eventPhase: number = 0;
  readonly isTrusted: boolean = false;
  readonly returnValue: boolean = true;
  readonly srcElement: EventTarget | null = null;
  readonly target: EventTarget | null = null;
  readonly timeStamp: number = Date.now();
  readonly type: string;
  readonly AT_TARGET: number = 2;
  readonly BUBBLING_PHASE: number = 3;
  readonly CAPTURING_PHASE: number = 1;
  readonly NONE: number = 0;
  detail: T;

  constructor(type: string, eventInitDict?: CustomEventInit<T>) {
    this.type = type;
    this.bubbles = !!eventInitDict?.bubbles;
    this.cancelable = !!eventInitDict?.cancelable;
    this.composed = !!eventInitDict?.composed;
    this.detail = (eventInitDict?.detail as T) || null as unknown as T;
  }

  // Stub methods
  composedPath(): EventTarget[] { return []; }
  preventDefault(): void {}
  stopImmediatePropagation(): void {}
  stopPropagation(): void {}
  initCustomEvent(type: string, bubbles?: boolean, cancelable?: boolean, detail?: T): void {
    this.type = type;
    if (bubbles !== undefined) this.bubbles = bubbles;
    if (cancelable !== undefined) this.cancelable = cancelable;
    if (detail !== undefined) this.detail = detail;
  }
  initEvent(type: string, bubbles?: boolean, cancelable?: boolean): void {
    this.type = type;
    if (bubbles !== undefined) this.bubbles = bubbles;
    if (cancelable !== undefined) this.cancelable = cancelable;
  }
}