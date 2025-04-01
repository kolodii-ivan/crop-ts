import { Rect } from '../types';
/**
 * Updates shades when selection changes
 */
export declare class ShadeFilter {
    priority: number;
    core: any;
    tag: string;
    /**
     * Initialize filter
     */
    init(): void;
    /**
     * Apply the filter
     */
    filter(rect: Rect): Rect;
    /**
     * Refresh method called when selection is refreshed
     */
    refresh(selection: any): void;
}
