/**
 * 封装了对节点class属性的操作，一般用于DOM节点的className状态切换
 * @2014-10-11 追加批量操作，允许传入节点数组以及className数组
 * 返回一个对象，拥有三个方法：
 * var className = require("../dom/className");
 *
 * if (className.has("node", "myClassName")) {
 *     className.remove(node, "myClassName");
 * } else {
 *     className.add(node, "myClassName");
 * }
 */
define(function(require, exports, module) {
	var isElement = require("../dom/isElement");
	var each = require("../util/each");
	var getType = require("../util/getType");
	var trim = require("../str/trim");
	var whiteSpace = ' ';
	var that = exports;

	that.has = function(node, className) {
		if (trim(className) == "") {
			return false;
		}

		var arr = node.className.replace(/\s+/g, whiteSpace).split(/\s+/g);

		for (var i = 0; i < arr.length; i++) {
			if (arr[i] == className) {
				return true;
			}
		}

		return false;
	}

	that.add = function(node, className) {
		if (getType(node) == "array") {
			each(node, function(el) {
				that.add(el, className);
			});

			return;
		}

		if (getType(className) == "array") {
			each(className, function(cls) {
				that.add(node, cls);
			});

			return;
		}

		if (!that.has(node, className)) {
			var arr = (node.className.replace(/\s+/g, whiteSpace).split(/\s+/g).join(whiteSpace) + whiteSpace + className).split(/\s+/g);
			var hash = {};
			var result = [];

			each(arr, function(val) {
				if (val in hash) {
					return;
				}

				hash[val] = true;
				result.push(val);
			});

			node.className = trim(result.join(whiteSpace));
		}
	}

	that.remove = function(node, className) {
		if (getType(node) == "array") {
			each(node, function(el) {
				that.remove(el, className);
			});

			return;
		}

		if (getType(className) == "array") {
			each(className, function(cls) {
				that.remove(node, cls);
			});

			return;
		}

		if(that.has(node, className)){
			var arr = node.className.replace(/\s+/g, whiteSpace).split(/\s+/g);
			var hash = {};
			var result = [];

			each(arr, function(val) {
				if ((val in hash) || (val == className)) {
					return;
				}

				hash[val] = true;
				result.push(val);
			});

			node.className = trim(result.join(whiteSpace));
		}
	}

	that.toggle = function(node, className1, className2) {
		className1 = className1 == null ? "" : trim(className1);
		className2 = className2 == null ? "" : trim(className2);

		if (className1 == "" && className2 == "") {
			return;
		}

		if (className1 == "") {
			that.toggle(node, className2);
			return;
		}

		if (getType(node) == "array") {
			each(node, function(el) {
				that.toggle(el, className1, className2);
			});

			return;
		}

		var hasCN = that.has(node, className1);

		if (hasCN) {
			that.remove(node, className1);

			if (className2 != "") {
				that.add(node, className2);
			}
		} else {
			that.add(node, className1);

			if (className2 != "") {
				that.remove(node, className2);
			}
		}
	}
});