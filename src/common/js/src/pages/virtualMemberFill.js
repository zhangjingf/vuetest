/**
 * 虚拟会员充值
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
    var header = require("sea/virtualMemberFill/header");
	var slideNav = require("sea/slideNav");
    var fill = require("sea/virtualMemberFill/fill");
	var storageMessager = require("lib/evt/storageMessager");
	var URL = require("lib/util/URL");
	var queryToJson = require("lib/json/queryToJson");
	var webBridge = require("sea/webBridge");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
    var m_header = null;
	var m_tabs = null;
    var m_fill = null;

	var url = null;

	//---------------事件定义----------------
	var evtFuncs = {
		switch: function(ev) {
			m_fill.switch(ev.data);
		},

		back: function() {
			if (url["fromType"] == undefined || url["fromType"] == "") {
				//storageMessager.send("cancelStyle");/*通知“支付页面”改变样式*/
				storageMessager.send("changeUserData",{'changeData':'false','cancelFavorable':false});
			}
			webBridge.close();
		}
	}

	//---------------子模块定义---------------
	var modInit = function() {
		if (nodeList.header) {
			m_header = header(nodeList.header, opts);
			m_header.init();
		}

		m_tabs = slideNav(nodeList.tabs, {count:2});
		m_tabs.init();

		m_fill = fill(nodeList.fill, opts);
        m_fill.init();
	}

	//-----------------绑定事件---------------
	var bindEvents = function() {
		m_tabs.bind('switchTab', evtFuncs.switch);
		m_fill.bind('slideChange', custFuncs.slideChange);
		storageMessager.bind("reChangeMobile",webBridge.close);
		if (!nodeList.header) {
			webBridge.onBackPressed = function () {
				evtFuncs.back();
				var isIPhone = navigator.appVersion.match(/iphone/gi);
				if (isIPhone) {
					return "turnBackSucceed";
				}
			}
		}
	}

	//-----------------自定义函数-------------
	var custFuncs = {
		slideChange: function (ev) {
			m_tabs.slideShift(ev.data.index+1);
		}
	}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts || {};
		opts.url = queryToJson(URL.parse(location.href)["query"]);

		nodeList = {
			header: queryNode('#m_header'),
			tabs: queryNode("#m_typeTabs"),
			fill: queryNode('#m_fill')
		};

		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});