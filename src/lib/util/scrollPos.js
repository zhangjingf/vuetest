/**
 * 获取滚动条的位置
 *
 * var scrollPos = require("../util/scrollPos");
 * var pos = scrollPos(); // 也可以传入一个iframe的document对象
 * 得到 { top: 0, left: 0 }
 *
 */
module.exports = function(oDocument) {
	oDocument = oDocument || document;
	var dd = oDocument.documentElement;
	var db = oDocument.body;
	return {
		top: Math.max(window.pageYOffset || 0, dd.scrollTop, db.scrollTop),
		left: Math.max(window.pageXOffset || 0, dd.scrollLeft, db.scrollLeft)
	};
};