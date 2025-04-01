/**
 * Touch support for mobile devices
 */
export declare class Touch {
    private core;
    /**
     * Create a new Touch handler
     */
    constructor(core: any);
    /**
     * Initialize touch handlers
     */
    init(): void;
    /**
     * Handle touch start event
     */
    onTouchStart(e: TouchEvent): void;
}
