/**
 *
 * 设计台词海报
 *
 *
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	//var main = require("sea/designCover/main");
	//var active = require("sea/designCover/active");
	var share = require("sea/designCover/share");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
	var m_main = null;
	var m_active = null;
	var m_share = null;

	//---------------事件定义----------------
	var evtFuncs = {
		shareImg: function (ev) {
			m_share.shareImg(ev.data.flg);
			m_active.shareImg(ev.data.flg);
			m_main.shareImg(ev.data.flg);
		},
		shareToWeiXin: function (ev) {
			m_main.shareToWeiXin(ev.data.type);
		}
	}

	//---------------子模块定义---------------
	var modInit = function() {
		m_main = main(nodeList.main,opts);
		m_main.init();

		m_active = active(nodeList.active,opts);
		m_active.init();

		m_share = share(nodeList.share,opts);
		m_share.init();
	}

	//-----------------绑定事件---------------
	var bindEvents = function() {
		m_active.bind("saveImg",m_main.saveImg);
		m_main.bind("shareImg",evtFuncs.shareImg);
		m_share.bind("shareToWeiXin",evtFuncs.shareToWeiXin);
		m_share.bind("shareImg",evtFuncs.shareImg);
	}

	//-----------------自定义函数-------------
	var custFuncs = {}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts || {};

		nodeList = {
			main: queryNode("#m_main"),
			active: queryNode("#m_active"),
			share: queryNode("#m_share")
		}

		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});