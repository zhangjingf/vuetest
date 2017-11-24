/**
 * by 璩
 * 对一个对象进行深度赋值
 * 例：
 * import assign from 'lib/util/assign'
 * let obj = {a: {b: {c: {d: 1, e: 2}}}}
 * assign(obj, "a.b.c.d", 456);
 * => {a: {b: {c: {d: 456, e: 2}}}}
 */

 import {isObject, isUndefined } from '../util/dataType'

 export default function(data, name, value) {
     if(!isObject(data)) return null;
     try{
        let result = [data];
        function assign(names){
            var reg = /\[([\s\S]+?)\]/g,
            stop = false,
            len = names.length;
            names.forEach((v, index) => {
                if(stop) return;
                let arr = [];
                v = v.replace(reg, (a,b) => {arr.push(b);return "";});
                var aLen = arr.length;
                if(index === len - 1 && aLen === 0){
                    result[result.length - 1][v] = value;
                    stop = true;
                    return;
                }

                result.push(result[result.length - 1][v]);

                if(isUndefined(result[result.length - 1])) return;

                arr.forEach((val, i) => {
                    if(stop) return;
                    if(index === len - 1 && i === aLen - 1){
                        result[result.length - 1][val] = value;
                        stop = true;
                        return;
                    }
                    result.push(result[result.length - 1][val]);
                    stop = isUndefined(result[result.length - 1]);
                });

            });
            return data;
        }
        return assign(name.split("."));
     }catch(e){
         return null;
         console.log(e);
     }
 }