import { EventEmitter } from './lib/EventEmitter';
import { JcropOptions, Rect } from './types';
import { Selection } from './components/Selection';
import { DragState } from './components/DragState';
import { StageManager } from './components/StageManager';
/**
 * Main Jcrop class
 */
export declare class Jcrop extends EventEmitter {
    container: HTMLElement;
    options: JcropOptions;
    ui: {
        multi: Selection[];
        selection: Selection | null;
        keyboard?: any;
        manager?: StageManager;
    };
    state: DragState | null;
    filter: Record<string, any>;
    /**
     * Create a new Jcrop instance
     */
    constructor(element: HTMLElement | string, options?: JcropOptions);
    /**
     * Initialize Jcrop components
     */
    init(): void;
    /**
     * Apply size constraints based on image or specified dimensions
     */
    applySizeConstraints(): void;
    /**
     * Initialize component by name and arguments
     */
    initComponent<T>(name: string, ...args: any[]): T | undefined;
    /**
     * Set options on the Jcrop instance
     */
    setOptions(options: JcropOptions, proptype?: any): this;
    /**
     * Destroy the Jcrop instance
     */
    destroy(): void;
    /**
     * Apply configured filters
     */
    applyFilters(): void;
    /**
     * Get default filters sorted by priority
     */
    getDefaultFilters(): any[];
    /**
     * Set the active selection
     */
    setSelection(selection: Selection): Selection;
    /**
     * Get the current selection
     */
    getSelection(): Rect;
    /**
     * Create a new selection
     */
    newSelection(selection?: Selection): Selection;
    /**
     * Check if a selection exists
     */
    hasSelection(selection: Selection): boolean;
    /**
     * Remove a selection
     */
    removeSelection(selection: Selection): Selection[];
    /**
     * Add a filter to all selections
     */
    addFilter(filter: any): this;
    /**
     * Remove a filter from all selections
     */
    removeFilter(filter: any): this;
    /**
     * Blur the current selection
     */
    blur(): this;
    /**
     * Focus the current selection
     */
    focus(): this;
    /**
     * Initialize event handlers
     */
    initEvents(): void;
    /**
     * Select max area
     */
    maxSelect(): void;
    /**
     * Nudge selection
     */
    nudge(x: number, y: number): void;
    /**
     * Refresh all selections
     */
    refresh(): void;
    /**
     * Blur all selections
     */
    blurAll(): void;
    /**
     * Scale coordinates from real to display
     */
    scale(b: Rect): Rect;
    /**
     * Unscale coordinates from display to real
     */
    unscale(b: Rect): Rect;
    /**
     * Request to delete current selection
     */
    requestDelete(): void;
    /**
     * Delete current selection
     */
    deleteSelection(): void;
    /**
     * Animate selection to coordinates
     */
    animateTo(box: number[]): this;
    /**
     * Set selection coordinates
     */
    setSelect(box: number[] | null): this;
    /**
     * Handle drag start
     */
    startDrag(e: MouseEvent): void;
    /**
     * Get container size
     */
    getContainerSize(): [number, number];
    /**
     * Resize container
     */
    resizeContainer(w: number, h: number): void;
    /**
     * Set image source
     */
    setImage(src: string, callback?: (w: number, h: number) => void): boolean;
    /**
     * Update selection coordinates
     */
    update(b: Rect): void;
    /**
     * Calculate largest box for given aspect ratio and dimensions
     */
    static getLargestBox(ratio: number, maxw: number, maxh: number): [number, number];
    /**
     * Convert x, y, w, h array to a rect object
     */
    static wrapFromXywh(arr: number[]): Rect;
}
