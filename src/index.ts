/**
 * Jcrop TypeScript Version
 * Image cropping widget in TypeScript
 * 
 * Based on Jcrop by Tapmodo Interactive LLC
 * Rewritten in TypeScript by Ivan Popelyshev
 */

import { Jcrop } from './Jcrop';
import { DEFAULT_OPTIONS } from './defaults';
import './styles/jcrop.scss';

// Import filters
import './filters/ConstrainFilter';
import './filters/RatioFilter';
import './filters/ShadeFilter';

// Create factory function
function create(element: HTMLElement | string, options: any = {}): Jcrop {
  return new Jcrop(element, options);
}

// Static methods
create.attach = (element: HTMLElement, options: any = {}): Jcrop => {
  return new Jcrop(element, options);
};

// Add defaults to match legacy structure
create.defaults = DEFAULT_OPTIONS;

// Add Jcrop class
create.Jcrop = Jcrop;

// Export default as the main API
export default create;