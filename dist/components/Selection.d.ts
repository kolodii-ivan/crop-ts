import { EventEmitter } from '../lib/EventEmitter';
import { Rect } from '../types';
import { DragState } from './DragState';
/**
 * Selection component
 * Manages a single cropping selection
 */
export declare class Selection extends EventEmitter {
    element: HTMLElement;
    frame: HTMLButtonElement;
    core: any;
    filter: any[];
    minSize: number[];
    maxSize: number[];
    aspectRatio: number;
    edge: {
        n: number;
        s: number;
        e: number;
        w: number;
    };
    bgColor: string | null;
    bgOpacity: number | null;
    last: any;
    state: DragState | null;
    active: boolean;
    linked: boolean;
    canDelete: boolean;
    canDrag: boolean;
    canResize: boolean;
    canSelect: boolean;
    constructor();
    /**
     * Initialize selection
     */
    init(core: any): void;
    /**
     * Attach additional functionality
     * Hook for extending init sequence
     */
    attach(): void;
    /**
     * Setup selection element
     */
    startup(): void;
    /**
     * Properties to propagate from options
     */
    static propagateList: string[];
    /**
     * Set options on the selection
     */
    setOptions(options: any): this;
    /**
     * Refresh selection state
     */
    refresh(): void;
    /**
     * Call a function on all filters
     */
    callFilterFunction(funcName: string): this;
    /**
     * Add a filter to this selection
     */
    addFilter(filter: any): void;
    /**
     * Check if filter is already added
     */
    hasFilter(filter: any): boolean;
    /**
     * Sort filters by priority
     */
    sortFilters(): void;
    /**
     * Clear all filters
     */
    clearFilters(): void;
    /**
     * Remove a specific filter
     */
    removeFilter(filterOrTag: any): void;
    /**
     * Run all filters on rectangle
     */
    runFilters(rect: Rect, direction: string): Rect;
    /**
     * End drag operation
     */
    endDrag(): void;
    /**
     * Start drag operation
     */
    startDrag(e: MouseEvent | TouchEvent, direction?: string): boolean;
    /**
     * Set whether selection can be selected
     */
    allowSelect(value?: boolean): this;
    /**
     * Set whether selection can be dragged
     */
    allowDrag(value?: boolean): this;
    /**
     * Set whether selection can be resized
     */
    allowResize(value?: boolean): this;
    /**
     * Remove the selection
     */
    remove(): void;
    /**
     * Move selection to back
     */
    toBack(): void;
    /**
     * Move selection to front
     */
    toFront(): void;
    /**
     * Redraw the selection at specified coordinates
     */
    redraw(rect: Rect): this;
    /**
     * Update the selection using scaled coordinates
     */
    update(rect: Rect): this;
    /**
     * Update the selection using raw coordinates
     */
    updateRaw(rect: Rect, direction: string): this;
    /**
     * Animate selection to coordinates
     */
    animateTo(box: number[], callback?: () => void): void;
    /**
     * Center the selection
     */
    center(instant?: boolean): this;
    /**
     * Create element for handles and borders
     */
    createElement(type: string, direction: string): HTMLElement;
    /**
     * Move selection to coordinates
     */
    moveTo(x: number, y: number): void;
    /**
     * Blur the selection
     */
    blur(): this;
    /**
     * Focus the selection
     */
    focus(): this;
    /**
     * Resize the selection
     */
    resize(w: number, h: number): void;
    /**
     * Get selection coordinates
     */
    get(): Rect;
    /**
     * Set selection by coordinates
     */
    setSelect(box: number[]): this;
    /**
     * Insert handle and border elements
     */
    insertElements(): void;
}
