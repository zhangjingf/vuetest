/**
 * UI模块模板，本文件不做任何事情，只是定义了一个模块的规范
 * 绑定事件：
 *   PCWeb可以使用addEvent
 *   Mobile轻按、长按之类的事件使用touch.js比较好
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	var touch = require("touch");
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
	var bindEvents = function() {}

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