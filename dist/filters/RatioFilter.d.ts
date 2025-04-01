import { Rect } from '../types';
/**
 * Enforces aspect ratio constraints on selections
 */
export declare class RatioFilter {
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
    filter(rect: Rect, direction: string, selection: any): Rect;
}
