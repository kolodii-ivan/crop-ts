import { Filter } from '../types';

// Filter registry to store filter constructors
const filterRegistry: Record<string, any> = {};

/**
 * Register a filter class with the registry
 */
export function registerFilter(name: string, filterClass: any): void {
  filterRegistry[name] = filterClass;
}

/**
 * Get a filter constructor from the registry
 */
export function getFilterConstructor(name: string): any {
  return filterRegistry[name] || null;
}