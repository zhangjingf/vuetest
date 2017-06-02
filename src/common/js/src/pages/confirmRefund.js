/**
 *
 *订单退款
 *
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	var info = require("sea/confirmRefund/info");
	var header = require("sea/header");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
	var m_header = null;
	var m_info = null;

	//---------------事件定义----------------
	var evtFuncs = {}

	//---------------子模块定义---------------
	var modInit = function() {
		if (nodeList.header) {
			m_header = header(nodeList.header);
			m_header.init();
		}
		m_info = info(nodeList.info,opts);
		m_info.init();
	}

	//-----------------绑定事件---------------
	var bindEvents = function() {}

	//-----------------自定义函数-------------
	var custFuncs = {}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts || {};

		nodeList = {
			header: queryNode("#m_header"),
			info: queryNode("#m_info")
		}

		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});