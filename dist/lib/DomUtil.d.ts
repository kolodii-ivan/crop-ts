/**
 * DOM utility functions to replace jQuery
 */
export declare class DomUtil {
    /**
     * Create an element with attributes and optional content
     */
    static createElement<K extends keyof HTMLElementTagNameMap>(tag: K, attributes?: Record<string, string>, content?: string): HTMLElementTagNameMap[K];
    /**
     * Add class to element
     */
    static addClass(element: HTMLElement, className: string): void;
    /**
     * Remove class from element
     */
    static removeClass(element: HTMLElement, className: string): void;
    /**
     * Toggle class on element
     */
    static toggleClass(element: HTMLElement, className: string, force?: boolean): void;
    /**
     * Check if element has class
     */
    static hasClass(element: HTMLElement, className: string): boolean;
    /**
     * Get element position relative to offset parent
     */
    static getPosition(element: HTMLElement): {
        left: number;
        top: number;
    };
    /**
     * Set element CSS
     */
    static css(element: HTMLElement, styles: Partial<CSSStyleDeclaration> | string, value?: string): void;
    /**
     * Get element width
     */
    static width(element: HTMLElement): number;
    /**
     * Get element height
     */
    static height(element: HTMLElement): number;
    /**
     * Set element dimensions
     */
    static setDimensions(element: HTMLElement, width: number, height: number): void;
    /**
     * Attach event listener
     */
    static on(element: HTMLElement | Document | Window, event: string, selector: string | EventListener, handler?: EventListener): void;
    /**
     * Remove event listener
     */
    static off(element: HTMLElement | Document | Window, event: string, handler: EventListener): void;
    /**
     * Wrap an element with a new container
     */
    static wrap(element: HTMLElement, wrapper: HTMLElement): HTMLElement;
    /**
     * Insert element before target
     */
    static before(target: HTMLElement, element: HTMLElement): void;
    /**
     * Append element to parent
     */
    static append(parent: HTMLElement, element: HTMLElement): void;
    /**
     * Remove element from DOM
     */
    static remove(element: HTMLElement): void;
    /**
     * Get computed style value
     */
    static getComputedStyle(element: HTMLElement, property: string): string;
}
