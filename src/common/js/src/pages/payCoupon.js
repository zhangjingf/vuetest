/**
 *
 *优惠券支付
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	var storageMessager = require("lib/evt/storageMessager");
	var header = require("sea/payCoupon/header");
	var payCoupon = require("sea/payCoupon/payCoupon");
	var showMessage = require("sea/showMessage");
	var webBridge = require("sea/webBridge");
	var virtualLink = require("lib/util/virtualLink");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
	var m_header = null;
	var m_payCoupon = null;
	var isPaying = false;

	//---------------事件定义----------------
	var evtFuncs = {
		showSelectedCoupon: function (ev) {
			//showMessage(ev.data.ticketArr);
			m_payCoupon.showSelectCouponList(ev.data.ticketArr);
		},

		paying: function() {
			m_header.paying();
		},

		payed: function() {
			m_header.payed();
		},


		back: function() {
			/*showMessage('正在支付中，请稍后');
			return;*/

			if (isPaying) {
				showMessage('正在支付中，请稍后');
				//alert("正在支付中，请稍后");
				return;
			}
			//storageMessager.send("cancelStyle");/*通知“支付页面”改变样式*/
			//storageMessager.send("cancelFavorable",false);/*取消会员优惠  并改变样式*/
			storageMessager.send("changeUserData",{'changeData':'false','cancelFavorable':false});
			webBridge.close();
		},
		appPaying: function () {
			isPaying = true;
		},
		appPayed: function () {
			isPaying = false;
		}
	}

	//---------------子模块定义---------------
	var modInit = function() {
		if (nodeList.header) {
			m_header = header(nodeList.header);
			m_header.init();
		}

		m_payCoupon = payCoupon(nodeList.payCoupon, opts);
		m_payCoupon.init();

		virtualLink('data-url');
	}

	//-----------------绑定事件---------------
	var bindEvents = function() {
		storageMessager.bind("selectedCoupon", evtFuncs.showSelectedCoupon);
		if (nodeList.header) {
			m_payCoupon.bind('paying', evtFuncs.paying);
			m_payCoupon.bind('payed', evtFuncs.payed);
		} else {
			m_payCoupon.bind('paying', evtFuncs.appPaying);
			m_payCoupon.bind('payed', evtFuncs.appPayed);
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
			payCoupon: queryNode("#m_payCoupon")
		}

		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});