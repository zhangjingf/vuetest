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
define(function(require, exports, module) {
	var getType = require("../util/getType");

	return function(obj, fn) {
		if (getType(obj) == "array") {
			if ([].forEach) {
				[].forEach.call(obj, fn);
			} else {
				var len = obj.length;
				for (var i = 0; i < len; i++) {
					if (obj.hasOwnProperty(i)) {
						fn(obj[i], i, obj);
					}
				}
			}
		} else {
			for (var k in obj) {
				if (obj.hasOwnProperty(k)) {
					fn(obj[k], k, obj);
				}
			}
		}
	}
});