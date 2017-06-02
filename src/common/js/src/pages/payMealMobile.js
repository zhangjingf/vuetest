/**
 * 订单，话费支付
 *
 *
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	//var showMessage = require("sea/showMessage");
	//var header = require("sea/header");
	var queryToJson = require("lib/json/queryToJson");
	var URL = require("lib/util/URL");
	var header = require("sea/payMealMobile/header");
	var payMobile = require("sea/payMealMobile/payMobile");
	var webBridge = require("sea/webBridge");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
	var m_header = null;
	var m_payMobile = null;
	var url = null;

	//---------------事件定义----------------
	var evtFuncs = {
		cancelMobilePay: function (ev) {
			m_payMobile.cancelMobilePay();
		},
		back: function() {
			if(url["nowPage"] == "mobile") {
				that.fire("payMobileBack",{});
			} else {
				webBridge.close();
			}
		}
	}

	//---------------子模块定义---------------
	var modInit = function() {
		if (nodeList.header) {
			m_header = header(nodeList.header, opts);
			m_header.init();
		}

		m_payMobile = payMobile(nodeList.payMobile, opts);
		m_payMobile.init();
	}

	//-----------------绑定事件---------------
	var bindEvents = function() {
		//m_header.bind("payMobileBack",evtFuncs.cancelMobilePay);
		m_header.bind("payMobileBack",evtFuncs.cancelMobilePay);
		if(!nodeList.header) {
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
	}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts;
		url = queryToJson(URL.parse(location.href)["query"]);
		nodeList = {
			header: queryNode("#m_header"),
			payMobile: queryNode("#m_payMobile")
		};
		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});