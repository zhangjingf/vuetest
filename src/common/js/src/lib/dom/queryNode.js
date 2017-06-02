/**
 * sizzle的简单封装，直接返回查询到的第一个元素（注意不是返回数组）
 *
 * var queryNode = require("../dom/queryNode");
 * var node1 = queryNode("#node1"); // 获取ID为node的节点
 * var node2 = queryNode(".node2"); // 获取第一个class为node2的节点，注意，仅返回第一个!
 *
 */
define(function(require, exports, module) {
	var sizzle = require("../dom/sizzle");

	return function(selector, context, results, seed) {
		return sizzle(selector, context, results, seed)[0];
	}
});