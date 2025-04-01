/**
 * Manages the cropping stage
 */
export declare class StageManager {
    core: any;
    shades: HTMLElement[];
    private active;
    private initialized;
    /**
     * Create a new StageManager
     */
    constructor(core: any);
    /**
     * Initialize the stage manager
     */
    init(): void;
    /**
     * Create the shades elements
     */
    createShades(): void;
    /**
     * Update shade positions based on the selection rectangle
     */
    updateShades(rect: {
        x: number;
        y: number;
        w: number;
        h: number;
    }): void;
    /**
     * Show shades
     */
    showShades(): void;
    /**
     * Hide shades
     */
    hideShades(): void;
    /**
     * Enable the stage for use
     */
    enable(): void;
    /**
     * Disable the stage
     */
    disable(): void;
    /**
     * Update the stage
     */
    update(rect: {
        x: number;
        y: number;
        w: number;
        h: number;
    }): void;
}
