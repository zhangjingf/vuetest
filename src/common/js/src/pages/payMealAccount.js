/**
 *
 * 虚拟会员支付单独卖品
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	//var webBridge = require("sea/webBridge");
	//var showMessage = require("sea/showMessage");
	var header = require("sea/payMealAccount/header");
	var storageMessager = require("lib/evt/storageMessager");
	var webBridge = require("sea/webBridge");
	var queryToJson = require("lib/json/queryToJson");
	var URL = require("lib/util/URL");
	var payMealAccount = require("sea/payMealAccount/payMealAccount");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
	var m_header = null;
	var m_payMealAccount = null;

	//---------------事件定义----------------
	var evtFuncs = {
		back: function(ev) {
			storageMessager.send("changeUserData",{'changeData':'false','cancelFavorable':true});
			webBridge.close();
		}
	}

	//---------------子模块定义---------------
	var modInit = function() {
		if (nodeList.header) {
			m_header = header(nodeList.header, opts);
			m_header.init();
		}
		
		m_payMealAccount = payMealAccount(nodeList.payAccount, opts);
		m_payMealAccount.init();
	}

	//-----------------绑定事件---------------
	var bindEvents = function () {
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
	var custFuncs = {}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = queryToJson(URL.parse(location.href)["query"]);
		opts.pageInt = _opts;

		nodeList = {
			header: queryNode("#m_header"),
			payAccount: queryNode("#m_payMember")
		};

		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;
	return that;
});