/**
 * Installs `Object.hasOwn` when the host does not provide it.
 */
export const installObjectHasOwnPolyfill = (): void => {
  if (typeof Object.hasOwn !== 'function') {
    Object.defineProperty(Object, 'hasOwn', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: (object: object, property: PropertyKey): boolean => {
        return Object.prototype.hasOwnProperty.call(object, property);
      },
    });
  }
};

installObjectHasOwnPolyfill();
