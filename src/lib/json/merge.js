/**
 * 合并多个对象，将后面的对象和前面的对象一层一层的合并
 * 支持第一个参数传boolean类型，当传true时，支持深层合并
 * 例子：
 *
 * var merge = require("../json/merge");
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

var getType = require("../util/getType");
var each = require("../util/each");

module.exports = function() {

    var result = [];
    var args = [].slice.call(arguments);
    result.push.apply(result, args);

    var deep = false;

    function mergeObj(r, obj){
        each(obj, function(v, k){
            if(deep && ((getType(r[k]) === "object" && getType(v) === "object") || (getType(r[k]) === "array" && getType(v) === "array"))){
                mergeObj(r[k], v);
            }else{
                r[k] = v;
            }
        });
    }

    var newObj = {};

    each(result, function(item, index){
         if(index == 0 && item === true){
             deep = true;
         }else if(getType(item) === "object"){
             mergeObj(newObj, item);
         }
    });

    return newObj;
}
