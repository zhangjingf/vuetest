/**
 * 去除字符为null或者undefined返回空字符或者默认字符
 */

 import {isUndefined, isNull, isNumber} from '../util/dataType'
 export default function(val, def){
    return isUndefined(val) || isNull(val) ? (isUndefined(def) ? "" : def) : (isNumber(val) ? val.toString() : val);
 }