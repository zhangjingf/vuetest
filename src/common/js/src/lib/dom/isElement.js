/**
 * 检查是否为一个元素，它是对isNode的一个封装，并且判断node节点的nodeType是否为1，为1则是元素
 * 例子：
 *
 * HTML: <div id="node"></div>
 *
 * var isElement = require("../dom/isElement");
 * var node = document.getElementById("node");
 * console.log(isElement(node)); // true
 *
 */
define(function(require, exports, module) {
	var isNode = require("../dom/isNode");

	return function(element) {
		return isNode(element) && element.nodeType == 1;
	}
});