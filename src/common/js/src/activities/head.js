/**
 * 顶部工具栏
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var encodeHTML = require("lib/str/encodeHTML");
	var webBridge = require("activities/webBridge");
	var touch = require("touch");
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
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			if (nodeList.back) {
				touch.on(nodeList.back, "touchend", evtFuncs.back);
			}
		}

		//-----------------自定义函数-------------
		var custFuncs = {
			setTitle: function(title) {
				nodeList.title.innerHTML = encodeHTML(title);
			}
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
		that.setTitle = custFuncs.setTitle;

		return that;
	}
});