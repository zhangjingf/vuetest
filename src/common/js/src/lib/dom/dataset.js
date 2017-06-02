/**
 * 封装了node.dataset功能, dataset是标准浏览器新增的功能，这里主要是为了兼容旧浏览器
 * <div id="node" data-node-value="123"></div>
 * var dataset = require("../dom/dataset");
 * dataset.get(node, "nodeValue")将会读取data-node-value，得到123
 * dataset.set(node, "nodeValue", "123")将会设置data-node-value为123
 * 注意传入的KEY是驼峰命名
 */
define(function(require, exports, module) {
	var that = exports;

	var keyCase = function(key) {
		return "data-" + key.replace(/([A-Z]|(?:^\d+))/g, function(all, match) {
			return "-" + match.toLowerCase();
		});
	}

	that.get = function(node, key) {
		if ("dataset" in node) {
			return node.dataset[key];
		} else {
			var dataKey = keyCase(key);
			var attrs = node.attributes;
			var len = attrs.length;

			for (var i = 0; i < len; i++) {
				if (attrs[i].name == dataKey) {
					return attrs[i].value;
				}
			}
		}
	}

	that.set = function(node, key, val) {
		if ("dataset" in node) {
			node.dataset[key] = val;
		} else {
			var dataKey = keyCase(key);
			node.setAttribute(dataKey, val);
		}
	}

	that.remove = function(node, key) {
		if ("dataset" in node) {
			delete node.dataset[key];
		} else {
			var dataKey = keyCase(key);
			node.removeAttribute(dataKey);
		}
	}
});