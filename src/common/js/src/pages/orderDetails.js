/**
 *
 * 订单详情页面控制器
 *
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	var touch = require("touch");
	var orderInfo = require("sea/orderDetails/orderInfo");
	var virtualLink = require("lib/util/virtualLink");
	var queryToJson = require("lib/json/queryToJson");
	var URL = require("lib/util/URL");
	var storageMessager = require("lib/evt/storageMessager");
	var header = require("sea/orderDetails/header");
	var webBridge = require("sea/webBridge");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
	var m_header = null;
	var m_orderInfo = null;

	//---------------事件定义----------------
	var evtFuncs = {
		changeticketText: function (ev) {
			m_orderInfo.changeticketText(ev.data.txt);
		}
    }

	//---------------子模块定义---------------
	var modInit = function() {
		if (nodeList.header) {
			m_header = header(nodeList.header);
			m_header.init();
		}

		m_orderInfo = orderInfo(nodeList.orderInfo,opts);
		m_orderInfo.init();

		virtualLink('data-href');
	}

	//-----------------绑定事件---------------
	var bindEvents = function() {
		webBridge.onBackPressed = function() {
			if(opts.url.from == "payResult") {
				webBridge.openUrl(opts["orderList"] +"&form=payResult");
			} else {
				webBridge.close();
			}
			var isIPhone = navigator.appVersion.match(/iphone/gi);
			if (isIPhone) {
				return "turnBackSucceed";
			}
		}
		storageMessager.bind("customTicketPaper",evtFuncs.changeticketText);
	}

	//-----------------自定义函数-------------
	var custFuncs = {}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts || {};
		opts.url = queryToJson(URL.parse(location.href)["query"]);

		nodeList = {
			header: queryNode("#m_header"),
			orderInfo: queryNode("#m_orderInfo")
		}

		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});