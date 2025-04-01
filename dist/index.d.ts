/**
 * Jcrop TypeScript Version
 * Image cropping widget in TypeScript
 *
 * Based on Jcrop by Tapmodo Interactive LLC
 * Rewritten in TypeScript by Ivan Popelyshev
 */
import { Jcrop } from './Jcrop';
import './styles/jcrop.scss';
import './filters/ConstrainFilter';
import './filters/RatioFilter';
import './filters/ShadeFilter';
declare function create(element: HTMLElement | string, options?: any): Jcrop;
declare namespace create {
    var attach: (element: HTMLElement, options?: any) => Jcrop;
}
export default create;
