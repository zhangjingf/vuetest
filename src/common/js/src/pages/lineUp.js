/**
 *
 * 排队等待页面
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	var parseNode = require("lib/dom/parseNode");
	var touch = require("touch");
	var webBridge = require("sea/webBridge");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
	var nodeBody = null;

	//---------------事件定义----------------
	var evtFuncs = {
		openAct: function () {
			webBridge.openUrl(nodeBody.openAct.getAttribute("data-url"),'self');
		}
	}

	//---------------子模块定义---------------
	var modInit = function() {}

	//-----------------绑定事件---------------
	var bindEvents = function() {
		touch.on(nodeBody.openAct,"tap",evtFuncs.openAct)
	}

	//-----------------自定义函数-------------
	var custFuncs = {
	}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts || {};
		nodeList = {
			body: queryNode("#m_body")
		}
		nodeBody =parseNode(nodeList.body);
		modInit();
		bindEvents();
		webBridge.close(2);
	}
	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});