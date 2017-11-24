/**
 * 合并多个对象，将后面的对象和前面的对象一层一层的合并
 * 支持第一个参数传boolean类型，当传true时，支持深层合并
 * 例子：
 *
 * import merge from "../json/merge";
 * var opts = { url: "http://www.baidu.com" };
 * var defaultOpts = { url: "", method: "get" };
 * opts = merge(defaultOpts, opts);
 * opts的值为：
 * opts = {
 *     url: "http://www.baidu.com",
 *     method: "get"
 * }
 *
 */

 import {isArray, isObject} from '../util/dataType'
 
 export default function(...args) {
    
    let isDeep = false;
    let result = {};

    function merge(r, obj){
        for(let k in obj){
            let v1 = r[k], v2 = obj[k];
            if(isDeep && ((isObject(v1) && isObject(v2)) || (isArray(v1) && isArray(v2)))){
                merge(v1, v2);
            }else{
                r[k] = v2;
            }
        }
    }

    args.forEach((item, index) => {
        if(index === 0 && item === true){
            isDeep = true;
        }else if(isObject(item)){
            merge(result, item);
        }
    });

    return result;
 }
