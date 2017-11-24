/***********
 * 数据类型
 * @type {obj}
 */
export const getType = obj => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
export const isNumber = obj => getType(obj) === "number";
export const isString = obj => getType(obj) === "string";
export const isArray = obj => getType(obj) === "array";
export const isObject = obj => getType(obj) === "object";
export const isBoolean = obj => getType(obj) === "boolean";
export const isFunction = obj => getType(obj) === "function";
export const isNull = obj => getType(obj) === "null";
export const isUndefined = obj => getType(obj) === "undefined";
export const isPromise = obj => getType(obj) === "promise";
export const isNode = node => !isNull(node) && !isUndefined(node) && Boolean(node.nodeName) && Boolean(node.nodeType);
export const isElement = element => isNode(element) && element.nodeType === 1;

