/**
 * jquery版的lib/dom/parseNode的简单实现，与它不同的是返回的哈希对象中都是经过jquery包装过的对象
 */
define(function(require, exports, module) { 
	var $ = require("jquery");

	return function(node) {
		var results = $(node).find("[node-name]");
		var nodeList = {};

		$.each(results, function(idx, item) {
			var nodeName = item.getAttribute("node-name");

			if (nodeName in nodeList) {
				if ($.isArray(nodeList[nodeName])) {
					nodeList[nodeName].push(item);
				} else {
					nodeList[nodeName] = [nodeList[nodeName], item];
				}
			} else {
				nodeList[nodeName] = item;
			}
		});

		$.each(nodeList, function(key, item) {
			nodeList[key] = $(nodeList[key]);
		});

		return nodeList;
	}
});