import { Jcrop } from './constructor';

// Static properties and methods for Jcrop (replacing jQuery.extend approach)
// Component, filter, and stage registries
(Jcrop as any).component = {};
(Jcrop as any).filter = {};
(Jcrop as any).stage = {};

// Registerers
(Jcrop as any).registerComponent = function(name: string, comp: any) {
  (Jcrop as any).component[name] = comp;
};
(Jcrop as any).registerFilter = function(name: string, filter: any) {
  (Jcrop as any).filter[name] = filter;
};
(Jcrop as any).registerStageType = function(name: string, stage: any) {
  (Jcrop as any).stage[name] = stage;
};

// Attach new instance
(Jcrop as any).attach = function(element: HTMLElement, opt: any) {
  return new (Jcrop as any)(element, opt);
};

// Image and canvas clones
(Jcrop as any).imgCopy = function(imgel: HTMLImageElement) {
  const img = new Image();
  img.src = imgel.src;
  return img;
};
(Jcrop as any).imageClone = function(imgel: HTMLImageElement) {
  return (Jcrop as any).supportsCanvas
    ? (Jcrop as any).canvasClone(imgel)
    : (Jcrop as any).imgCopy(imgel);
};
(Jcrop as any).canvasClone = function(imgel: HTMLImageElement) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  // Set CSS size
  canvas.style.width = imgel.width + 'px';
  canvas.style.height = imgel.height + 'px';
  // Set internal resolution
  canvas.width = imgel.naturalWidth;
  canvas.height = imgel.naturalHeight;
  // Draw into canvas
  ctx.drawImage(imgel, 0, 0, imgel.naturalWidth, imgel.naturalHeight);
  return canvas;
};

// Propagate configuration properties
(Jcrop as any).propagate = function(plist: string[], config: any, obj: any) {
  plist.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(config, key)) {
      obj[key] = config[key];
    }
  });
};

// Utility: largest box fitting ratio
(Jcrop as any).getLargestBox = function(ratio: number, w: number, h: number) {
  return (w / h) > ratio
    ? [h * ratio, h]
    : [w, w / ratio];
};

// Choose first supported stage
(Jcrop as any).stageConstructor = function(
  el: HTMLElement,
  options: any,
  callback: (stage: any, opts: any) => void
) {
  const stages = Object.values((Jcrop as any).stage) as any[];
  stages.sort((a, b) => a.priority - b.priority);
  for (const Stage of stages) {
    if (Stage.isSupported(el, options)) {
      Stage.create(el, options, (obj: any, opt: any) => {
        if (typeof callback === 'function') callback(obj, opt);
      });
      break;
    }
  }
};

// Animation and color fade support (stubbed false)
(Jcrop as any).supportsColorFade = function() {
  return false;
};

// Wrap bounding array to object
(Jcrop as any).wrapFromXywh = function(xywh: [number, number, number, number]) {
  const [x, y, w, h] = xywh;
  return { x, y, w, h, x2: x + w, y2: y + h };
};