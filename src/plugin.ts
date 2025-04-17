// Import static definitions first
// Load static and default definitions
import './static';
import './defaults';
import { data } from './util';
import { Jcrop as CoreJcrop } from './constructor';

/**
 * Main Jcrop function replacing the old jQuery plugin.
 * @param element HTMLElement to attach Jcrop to.
 * @param options Configuration options or API command string.
 * @param callback Optional callback invoked after initialization.
 */
export function Jcrop(
  element: HTMLElement,
  options?: any | string,
  callback?: Function
): any {
  const inst = data(element, 'Jcrop');
  const args = Array.prototype.slice.call(arguments) as any[];
  if (options === 'api') {
    return inst;
  } else if (inst && typeof options === 'string') {
    if (typeof inst[options] === 'function') {
      args.shift();
      return inst[options].apply(inst, args);
    }
    return false;
  }
  // Initialize plugin on this element
  const opts = options && typeof options === 'object' ? options : {};
  const stageConstructor = opts.stageConstructor || (Jcrop as any).stageConstructor;
  stageConstructor(element, opts, (stage: any, opts2: any) => {
    const setSelect = opts2.setSelect;
    if (setSelect) {
      delete opts2.setSelect;
    }
    const obj = (Jcrop as any).attach(stage.element, opts2);
    if (stage.attach) {
      stage.attach(obj);
    }
    data(element, 'Jcrop', obj);
    if (setSelect) {
      obj.newSelection();
      obj.setSelect(setSelect);
    }
    if (typeof callback === 'function') {
      callback.call(obj);
    }
  });
  return element;
}

// Re-export static methods from CoreJcrop
export namespace Jcrop {
  const core: any = CoreJcrop;
  export const attach = core.attach;
  export const stageConstructor = core.stageConstructor;
  export const component = core.component;
  export const filter = core.filter;
  export const stage = core.stage;
  export const registerComponent = core.registerComponent;
  export const registerFilter = core.registerFilter;
  export const registerStageType = core.registerStageType;
  export const imgCopy = core.imgCopy;
  export const imageClone = core.imageClone;
  export const canvasClone = core.canvasClone;
  export const propagate = core.propagate;
  export const getLargestBox = core.getLargestBox;
  export const supportsColorFade = core.supportsColorFade;
  export const wrapFromXywh = core.wrapFromXywh;
}