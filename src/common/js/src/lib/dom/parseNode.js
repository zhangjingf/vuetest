/**
 * 解析获取指定节点的所有子节点所有包含指定key属性的节点，key默认为node-name
 *
 * @param node 在指定的节点node中解析，不指定则为document.body
 * @param isChild 是否仅解析子元素，不指定则解析出所有子孙元素
 * @param key 默认值为node-name，指定的节点属性，将以它为key保存节点，如果有多个节点的key值一样则将它们保存为数组。
 *
 * HTML:
 * <div id="node">
 *   <div node-name="child1"></div>
 *   <div node-name="child2"></div>
 *   <div node-name="child2"></div>
 * </div>
 *
 * var parseNode = require("../dom/parseNode");
 * var nodeList = parseNode(node);
 * nodeList的值为：
 *
 * nodeList = {
 *     child1: child1,
 *     child2: [child2, child2]
 * }
 *
 * 也就是说，默认情况下会将node参数的所有子孙节点包含node-name的节点以哈希的方式保存到一个对象中
 * 如果不指定node，则
 */
define(function(require, exports, module) {
	var sizzle = require("../dom/sizzle");
	var each = require("../util/each");
	var isElement = require("../dom/isElement");

	return function(node, isChild, key) {
		key = key == null ? "node-name" : key;
		node = node == null ? document.body : node;
		var nodeList = {};
		var nodes = sizzle(isChild ? ">[" + key + "]" : "[" + key + "]", node);

		each(nodes, function(el, inx) {
			var name = el.getAttribute(key);

			if (nodeList[name] == null) {
				nodeList[name] = el;
			} else if (isElement(nodeList[name])) {
				nodeList[name] = [nodeList[name], el];
			} else {
				nodeList[name].push(el);
			}
		});

		return nodeList;
	}
});