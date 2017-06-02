/**
 *
 * 会员日活动
 *
 *
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	var tip = require("sea/act_memberDay/tip")
	var header = require("sea/act_memberDay/header")
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
	var m_tip = null;
	var m_header = null;

	//---------------事件定义----------------
	var evtFuncs = {}

	//---------------子模块定义---------------
	var modInit = function() {
		m_tip = tip(nodeList.tip, opts);
		m_tip.init();
		m_header = header(nodeList.header, opts);
		m_header.init();
	}

	//-----------------绑定事件---------------
	var bindEvents = function() {}

	//-----------------自定义函数-------------
	var custFuncs = {}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts || {};

		nodeList = {
			tip: queryNode("#m_tip"),
			header: queryNode("#m_header")
		}

		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});