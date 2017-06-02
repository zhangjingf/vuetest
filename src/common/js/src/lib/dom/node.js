/**
 * 封装了一些方便元素关系操作的函数（注意获取到的都是元素节点，而不可能是textNode、注释之类的非元素节点）
 *
 * HTML:
 * <div id="node2"></div>
 * textNode1
 * <div id="node1">
 *   <div id="childNode1"></div>
 *   <div id="childNode2"></div>
 * </div>
 * <div id="node3"></div>
 *
 * var opra = require("../dom/node");
 * var queryNode = require("../dom/queryNode");
 * var node = queryNode("#node1");
 * var childNodes = opra.childNodes(node); // 获取到一个数组，包含childNode1以及childNode2
 * var firstChild = opra.first(node); // 获取到childNode1，也就是node的第一个子元素
 * var lastChild = opra.last(node);  // 获取到childNode2，也就是node的最后一个子元素
 * var nextNode = opra.next(node); // 获取到node3，也就是node的下一个元素
 * var prevNode = orpa.prev(node); // 获取到node2，也就是node的上一个元素，注意中间跳过了textNode1
 *
 */
define(function(require, exports, module) {
	var isElement = require("../dom/isElement");
	var each = require("../util/each");
	var that = exports;

	that.childNodes = function(node) {
		var result = [];

		each(node.childNodes, function(child) {
			if (isElement(child)) {
				result.push(child);
			}
		});

		return result;
	}

	that.first = function(node) {
		var childs = node.childNodes;
		var len = childs.length;

		for (var i = 0; i < len; i++) {

			if (isElement(childs[i])) {
				return childs[i];
			}
		}

		return null;
	}

	that.last = function(node) {
		var childs = node.childNodes;
		var len = childs.length;

		for (var i = len - 1; i > -1; i--) {
			if (isElement(childs[i])) {
				return childs[i];
			}
		}

		return null;
	}

	that.next = function(node) {
		var nextNode = node;

		while((nextNode = nextNode.nextSibling) != null) {
			if (isElement(nextNode)) {
				return nextNode;
			}
		}

		return null;
	}

	that.prev = function(node) {
		var prevNode = node;

		while((prevNode = prevNode.previousSibling) != null) {
			if (isElement(prevNode)) {
				return prevNode;
			}
		}

		return null;
	}
});