/**
 * 页面模块模板，本文件不做任何事情，只是定义了一个模块的规范
 * 本页面为jquery而设
 */
define(function(require, exports, module) { 
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var $ = require("jquery")
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;

	//---------------事件定义----------------
	var evtFuncs = {}

	//---------------子模块定义---------------
	var modInit = function() {}

	//-----------------绑定事件---------------
	var bindEvents = function() {}

	//-----------------自定义函数-------------
	var custFuncs = {}

	//-----------------初始化----------------
	var init = function() {
		nodeList = {
			main: $("#m_main")
		}

		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});