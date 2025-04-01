import { Rect } from '../types';
/**
 * Constrains selection to the stage boundaries
 */
export declare class ConstrainFilter {
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
    filter(rect: Rect, direction: string): Rect;
}
