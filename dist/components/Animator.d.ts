/**
 * Handles animation of selections
 */
export declare class Animator {
    private selection;
    private core;
    /**
     * Create a new Animator
     */
    constructor(selection: any);
    /**
     * Animate a selection to new coordinates
     */
    animate(x: number, y: number, w: number, h: number, callback?: () => void): void;
}
