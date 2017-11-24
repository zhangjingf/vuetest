/**
 * Created by TIAN on 2017/10/12.
 * sessionStorage 存储
 */

import {isObject, isArray, isString} from 'lib/util/dataType'

export default {
    put (key, val) {
        window.sessionStorage.setItem(key, (isObject(val) || isArray(val)) ? `{"_OBJECT_ARRAY_": ${JSON.stringify(val)}}` : val);
    },
    get (key) {
        const result = window.sessionStorage.getItem(key);
        return isString(result) && result.includes("_OBJECT_ARRAY_") ? JSON.parse(result)["_OBJECT_ARRAY_"] : result;
    }
}
