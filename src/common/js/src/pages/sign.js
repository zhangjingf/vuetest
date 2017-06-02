/**
 * 签到页面
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	var virtualLink = require("lib/util/virtualLink");
	var calendar = require('sea/sign/calendar');
    var header = require("sea/header");
    var sign = require('sea/sign/sign');
    var successDialog = require('sea/sign/successDialog');
	var storageMessager = require("lib/evt/storageMessager");
    var gift = require('sea/sign/gift');
	var webBridge = require("sea/webBridge");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
    var m_header = null;
	var m_calendar = null;
	var m_sign = null;
	var m_dialog = null;
	var m_gift = null;

	//---------------事件定义----------------
	var evtFuncs = {}

	//---------------子模块定义---------------
	var modInit = function() {
		if (nodeList.header) {
			m_header = header(nodeList.header, opts);
			m_header.init();
		}

		m_sign = sign(nodeList.sign, opts);
		m_sign.init();

		m_dialog = successDialog(nodeList.dialog, opts);
		m_dialog.init();

		m_gift = gift(nodeList.gift, opts);
		m_gift.init();

		m_calendar = calendar(nodeList.calendar, opts);
		m_calendar.init();

		virtualLink('data-url');
	}

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
			header: queryNode('#m_header'),
			sign: queryNode("#m_sign"),
			dialog: queryNode('#m_dialog'),
			gift: queryNode('#m_gift'),
			calendar: queryNode("#m_calendar")
		}

		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});