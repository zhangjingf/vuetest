/**
 * by 璩
 * 对数据进行过滤
 */
import {isObject, isUndefined, isArray, isString} from 'lib/util/dataType'

export default function(data, name){
    if(!name || !isObject(data)) return data;
    const fd = Object.assign({}, data),
        filter = function (res, names) {
            let reg = /\[([\s\S]+?)\]/g,
                bool = false,
                stop = false;
            names.forEach((v) => {
                if (bool || stop) return false;
                const arr = [];
                v = v.replace(reg, function (a, b) { arr.push(b); return ""; });
                res = res[v];
                stop = isUndefined(res);
                !stop && arr.forEach((val) => {
                    if (bool) return false;
                    res = res[val];
                    bool = isUndefined(res);
                });
            });
            return res;
        };

    try {
        if(isArray(name)){
            return filter(fd, name);
        }else if(isString(name)){
            if(name.indexOf(",") > -1){
                let obj = {}, bool = true;
                name.split(",").forEach((v) => {
                    const result = filter(fd, v.split("."));
                    if(!isUndefined(result)){
                        bool = false;
                        obj = Object.assign(obj, result);
                    }
                });
                return bool ? undefined : obj;
            }
            return filter(fd, name.split("."));
        }
        return data;
    } catch (ex) {
        return undefined;
    }
};