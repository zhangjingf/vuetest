/**
 * 检查字符串是否为空
 *
 * var isEmpty = require("../str/isEmpty");
 * console.log(isEmpty(null)); // true
 * console.log(isEmpty(" ")); // true
 *
 */
define(function(require, exports, module) {
	var trim = require("../str/trim");

	return function(str) {
		return trim(str).length == 0;
	}
});