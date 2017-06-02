/**
 * 合并两个对象，将第二个参数的键值合并到第一个参数中并返回一个全新的对象，不影响原来的两个参数
 * 注意是浅挎贝，主要用于参数的合并
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
define(function(require, exports, module) {
	var getType = require("../util/getType");
	var console = require("../io/console");
	var each = require("../util/each");

	return function() {
		var result = [];
		var args = [].slice.call(arguments);
		result.push.apply(result, args);

		var deep = false;

		function mergeObj(r, obj){
			each(obj, function(v, k){
				if(deep && ((getType(r[k]) == "object" && getType(v) == "object") || (getType(r[k]) == "array" && getType(v) == "array"))){
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
			 }else if(getType(item) == "object"){
				 mergeObj(newObj, item);
		}
		});

		return newObj;
	}
});