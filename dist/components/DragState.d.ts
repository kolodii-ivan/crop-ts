import { Point } from '../types';
/**
 * Manages state during drag operations
 */
export declare class DragState {
    startX: number;
    startY: number;
    ox: number;
    oy: number;
    direction: string;
    xmod: number;
    ymod: number;
    offsetX: number;
    offsetY: number;
    selection: any;
    onMove: (e: MouseEvent | TouchEvent) => void;
    onEnd: (e: MouseEvent | TouchEvent) => void;
    /**
     * Create a new DragState
     */
    constructor(e: MouseEvent | TouchEvent, selection: any, direction: string);
    /**
     * Get position from event (handles both mouse and touch events)
     */
    getEventPosition(e: MouseEvent | TouchEvent): Point;
    /**
     * Create the move event handler
     */
    createMoveHandler(): (e: MouseEvent | TouchEvent) => void;
    /**
     * Create the end event handler
     */
    createEndHandler(): (e: MouseEvent | TouchEvent) => void;
    /**
     * Update selection based on drag movement
     */
    updateSelection(diffX: number, diffY: number): void;
}
