export function isFunction(v) {
  return typeof(v) === "function";
}

export function isNull(v) {
  return v === null;
}

export function isUndefined(v) {
  return v === undefined;
}

export function isDefined(v) {
  return (!isNull(v)) && (!isUndefined(v));
}

export function isObject(v) {
  return v !== null && typeof v === "object";
}

export function noop() {
  return null;
};

export function merge(...data) {
  return Object.assign({}, ...data);
}

export function isInstanceOf(val, clazz) {
  return val instanceof clazz;
};
