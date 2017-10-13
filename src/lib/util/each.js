/**
 * 遍历对象或者数组的键值并传给回调函数
 * 例子：
 *
 * var each = require("../util/each");
 * var obj = { id: 1, name: "benny" };
 * each(obj, function(val, key, source) {
 *    console.log("值为:" + val, "key为" + key);
 *    console.log("被遍历的源对象是", source); // 即obj
 * });
 */

var getType = require("./getType");
module.exports = function(obj, fn) {
    if (getType(obj) == "array") {
        if ([].forEach) {
            [].forEach.call(obj, fn);
        } else {
            var len = obj.length;
            for (var i = 0; i < len; i++) {
                if (/msie [678]\./i.test(navigator.userAgent) || obj.hasOwnProperty(i)) {
                    if(fn(obj[i], i, obj) === false){
                        break;
                    }
                }
            }
        }
    } else {
        for (var k in obj) {
            if (/msie [678]\./i.test(navigator.userAgent) || obj.hasOwnProperty(k)) {
                if(fn(obj[k], k, obj) === false){
                    break;
                }
            }
        }
    }
}
