/**
 *
 * 虚拟会员支付
 * 改签流程确认改签也使用这个页面，确认是判断pageInt的changOrderInfo是否为空判断走改签还是购票流程
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	//var webBridge = require("sea/webBridge");
	var showMessage = require("sea/showMessage");
	var webBridge = require("sea/webBridge");
	var storageMessager = require("lib/evt/storageMessager");
	var util = require("sea/utils");
	//var header = require("sea/header");
	var header = require("sea/payAccount/header");
	var payAccount = require("sea/payAccount/payAccount");
	var virtualLink = require("lib/util/virtualLink");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
	var m_header = null;
	var m_payAccount = null;

	var isPaying = false;
	//---------------事件定义----------------
	var evtFuncs = {
		paying: function() {
			m_header.paying();
		},

		payed: function() {
			m_header.payed();
		},


		back: function(ev) {
			if (isPaying) {
				showMessage('正在支付中，请稍后');
				return;
			}
			//storageMessager.send("cancelActivity", opts["cardActId"]);
			/*if (opts["virtualDiscountAmount"] >= 1) {//用户还有活动优惠票数， 必须释放
			 storageMessager.send("cancelActivity", opts["cardActId"]);
			 }*///不取消
			//storageMessager.send("cancelStyle");
			storageMessager.send("changeUserData",{'changeData':'false','cancelFavorable':true});
			//storageMessager.send("cancelFavorable", true);/*取消会员优惠  并改变样式*/
			webBridge.close();
		},
		appPaying: function () {
			isPaying = true;
		},
		appPayed: function () {
			isPaying = false;
		},
		reload: function () {
			webBridge.openUrl(util.getCurrentURL(), 'self');
		}
	}

	//---------------子模块定义---------------
	var modInit = function() {
		if (nodeList.header) {
			m_header = header(nodeList.header, opts);
			m_header.init();
		}

		m_payAccount = payAccount(nodeList.payAccount, opts);
		m_payAccount.init();

		virtualLink('data-url');
	}

	//-----------------绑定事件---------------
	var bindEvents = function () {
		storageMessager.bind("changeUserData",evtFuncs.reload);
		if (nodeList.header) {
			m_payAccount.bind('paying', evtFuncs.paying);
			m_payAccount.bind('payed', evtFuncs.payed);
		} else {
			m_payAccount.bind('paying', evtFuncs.appPaying);
			m_payAccount.bind('payed', evtFuncs.appPayed);
		}
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
		opts = _opts;

		nodeList = {
			header: queryNode("#m_header"),
			payAccount: queryNode("#m_payMember")
		}

		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;
	return that;
});