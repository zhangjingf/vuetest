/***********
 * 基于vue通讯模块
 * @type {number}
 * 璩小孩 20170807
 */
import Vue from 'vue';

let _uniqueID = 20170801;
let _isLock = false;
const _constants = {};

export const getZIndex = () => _uniqueID++;
export const getUniqueId = () => ("COMP_UNIQUE_" + _uniqueID++);
export const get = (name) => {
    if(name.includes("COMP_UNIQUE_")) return name;
    let href = location.href;
    const key = href.substr(0, href.includes("?") ? href.indexOf("?") : href.length - 1);
    !_constants[key] && (_constants[key] = {});
    !_constants[key][name] && (_constants[key][name] = getUniqueId());
    return _constants[key][name];
};
export const bus = new Vue();
export const bind = (type, handler) => bus.$on(get(type), handler);
export const unbind = (type, handler) => bus.$off(get(type), handler);
export const fire = (type, data) => bus.$emit(get(type), data);
export const isLock = () => _isLock;
export const unLock = () => _isLock = false;
export const lock = () => _isLock = true;


