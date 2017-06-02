/**
 * 获取页面的大小
 *
 * var pageSize = require("../util/pageSize");
 * console.log(pageSize()); // 也可以传入一个指定的window对象
 * 得到 { page: {width: 1024, height: 2000}, win: { width: 1024, height: 768 } }
 */
define(function(require, exports, module) {
	var winSize = require("../util/winSize");

	return function(_target){
		var target;
		if (_target) {
			target = _target.document;
		}
		else {
			target = document;
		}
		var _rootEl = (target.compatMode == "CSS1Compat" ? target.documentElement : target.body);
		var xScroll, yScroll;
		var pageHeight,pageWidth;
		if (window.innerHeight && window.scrollMaxY) {
			xScroll = _rootEl.scrollWidth;
			yScroll = window.innerHeight + window.scrollMaxY;
		}
		else
			if (_rootEl.scrollHeight > _rootEl.offsetHeight) {
				xScroll = _rootEl.scrollWidth;
				yScroll = _rootEl.scrollHeight;
			}
			else {
				xScroll = _rootEl.offsetWidth;
				yScroll = _rootEl.offsetHeight;
			}
		var win_s = winSize(_target);
		if (yScroll < win_s.height) {
			pageHeight = win_s.height;
		}
		else {
			pageHeight = yScroll;
		}
		if (xScroll < win_s.width) {
			pageWidth = win_s.width;
		}
		else {
			pageWidth = xScroll;
		}
		return {
			'page':{
				width: pageWidth,
				height: pageHeight
			},
			'win':{
				width: win_s.width,
				height: win_s.height
			},
			w: pageWidth,
			h: pageHeight
		};
	};
});