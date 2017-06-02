/**
 * URL的解析和合成，注意：该设计有缺陷，不支持username:userpass，不过一般都用不上
 *
 * var URL = require("../util/URL");
 * var urlObj = URL.parse("http://www.baidu.com:8080/index.html?p=1#link1");
 * 得到：
 * {
 *     hash: "link1",
 *     host: "www.baidu.com",
 *     path: "/index.html",
 *     port: "8080",
 *     query: "p=1",
 *     scheme: "http:",
 *     slash: "//",
 *     url: "http://www.baidu.com:8080/index.html?p=1#link1"
 * }
 */
define(function(require, exports, module) {
	var that = exports;

	that.parse = function(url) {
		var parse_url = /^(?:([A-Za-z]+:)(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:(\.?[\.\/]*\/[^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
		var names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
		var results = parse_url.exec(url);
		var ret = {};

		for (var i = 0, len = names.length; i < len; i += 1) {
			ret[names[i]] = results[i] || '';
		}

		return ret;
	}

	that.build = function(url) {
		return url.scheme + url.slash + url.host + (url.port != "" ? ":" + url.port : "") + url.path + (url.query != "" ? "?" + url.query : "") + (url.hash != "" ? "#" + url.hash : "");
	}
});