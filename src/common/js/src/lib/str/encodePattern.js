/**
 * 对正则表达式做编码
 *
 * var encodePattern = require("../str/encodePattern");
 * var reg = new RegExp("^" + encodePattern("^.+") + "$"); // /^\^\.\+$/
 *
 */
define(function(require, exports, module) {
	return function(str) {
		str = str == null ? "" : str.toString();

		var pattern = /([\$\(\)\*\+\.\[\]\?\\\^\{\}\}])/g;
		return str.replace(pattern, "\\$1");
	}
});