/**
 * Utility for loading images
 */
export class ImageLoader {
  /**
   * Load an image and get its dimensions
   */
  static load(src: string, callback: (width: number, height: number) => void): void {
    const img = new Image();
    
    img.onload = function() {
      const width = img.naturalWidth;
      const height = img.naturalHeight;
      callback(width, height);
    };
    
    img.src = src;
  }

  /**
   * Attach to an existing image element
   */
  static attach(el: HTMLImageElement, callback: (width: number, height: number) => void): void {
    if (el.complete) {
      // Image already loaded
      callback(el.naturalWidth, el.naturalHeight);
    } else {
      // Wait for image to load
      el.onload = function() {
        callback(el.naturalWidth, el.naturalHeight);
      };
    }
  }
}