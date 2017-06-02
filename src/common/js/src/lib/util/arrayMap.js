/**
 * 映射数组
 * 遍历数组中所有元素，将每一个元素应用方法进行转换，并返回转换后的新数组
 * 注意：原数组不会做任何变化
 *
 * 例子：
 *
 * var arrayMap = require("../util/arrayMap");
 * var array = [1, 2, 3];
 * var newArray = arrayMap(array, function(item) {
 *     return item + 1;
 * })
 *
 * console.log(array); // [1, 2, 3]
 * console.log(newArray); // [2, 3, 4]
 *
 */
define(function(require, exports, module) {
    var each = require("../util/each");

    function map(o, callbackfn) {
        var a = [];
        each(o, function(value, index, source) {
            a[index] = callbackfn(value, index, source);
        });
        return a;
    }

    return (function() {
        var arrMap = [].map;
        return arrMap ? function(o, callbackfn) {
            return arrMap.call(o, callbackfn);
        } : map;
    })();
});