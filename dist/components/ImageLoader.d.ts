/**
 * Utility for loading images
 */
export declare class ImageLoader {
    /**
     * Load an image and get its dimensions
     */
    static load(src: string, callback: (width: number, height: number) => void): void;
    /**
     * Attach to an existing image element
     */
    static attach(el: HTMLImageElement, callback: (width: number, height: number) => void): void;
}
