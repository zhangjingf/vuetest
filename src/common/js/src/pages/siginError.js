/**
 * 签到错误页面
 *
 *
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	var webBridge = require("sea/webBridge");
	var storageMessager = require("lib/evt/storageMessager");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;

	//---------------事件定义----------------
	var evtFuncs = {}

	//---------------子模块定义---------------
	var modInit = function() {}

	//-----------------绑定事件---------------
	var bindEvents = function() {
		webBridge.onBackPressed = function () {
			storageMessager.send("userChanged");
			webBridge.close();
			var isIPhone = navigator.appVersion.match(/iphone/gi);
			if (isIPhone) {
				return "turnBackSucceed";
			}
		}
	}

	//-----------------自定义函数-------------
	var custFuncs = {}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts || {};

		nodeList = {
			main: queryNode("#m_main")
		}

		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});