/**
 * 透明头部。下拉背景色会渐变。
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var className = require("lib/dom/className");
	var touch = require("touch");
	var webBridge = require("sea/webBridge");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;

		//---------------事件定义----------------
		var evtFuncs = {

			back: function() {
				webBridge.close();
			},
			share: function () {
				webBridge.share();
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			// addEvent(scrollBody, "scroll", evtFuncs.scroll);
			if (nodeList.back) {
				touch.on(nodeList.back, "tap", evtFuncs.back);
			}
			if (nodeList.share) {
				touch.on(nodeList.back, "tap", evtFuncs.share);
			}
		}

		//-----------------自定义函数-------------
		var custFuncs = {
		}

		//-----------------初始化----------------
		var init = function(_data) {
			nodeList = parseNode(node);
			data = _data;

			modInit();
			bindEvents();
		}

		//-----------------暴露各种方法-----------
		that.init = init;

		return that;
	}
});