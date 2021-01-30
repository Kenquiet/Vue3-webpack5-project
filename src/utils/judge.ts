const toString = Object.prototype.toString;

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

export function isFn(val: unknown): val is Function{
  return typeof val === 'function'
}