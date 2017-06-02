/**
 * 订单支付
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var webBridge = require("sea/webBridge");
    var header = require("sea/payOrder/header");
    var orderAmount = require("sea/payOrder/orderAmount");
    var payType = require("sea/payOrder/payType");
    var countdown = require("sea/payOrder/countdown");
    var storageMessager = require("lib/evt/storageMessager");
    var parseNode = require("lib/dom/parseNode");
    var util = require("sea/utils");
    var virtualLink = require("lib/util/virtualLink");

    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_payType = null;
    var m_orderAmount = null;
    var m_countdown = null;

    //---------------事件定义----------------
    var evtFuncs = {
        payGui: function(ev) {
            m_orderAmount.payGui(ev.data);
        },
        cancelDis: function(ev) {
            if (nodeList.header) {
                m_header.cancelDis(ev.data);
            }
        },
        changeUserData: function(ev) {
            if (ev.data.changeData == 'true') {
                webBridge.reload();
            } else {
                if (ev.data.changeStyle == 'true') {
                    m_payType.cancelStyle();
                    m_orderAmount.cancelVipValue();

                    m_payType.flushCountType(); /*刷新变量prevType*/
                    m_orderAmount.fakeFlush(); /*刷新orderAmount的变量flag*/

                }
                if (ev.data.hasOwnProperty('cancelFavorable')) {
                    m_orderAmount.cancelFavorable(ev.data.cancelFavorable);
                    m_payType.cancelStyle();
                    m_orderAmount.cancelVipValue();
                    m_orderAmount.fakeFlush(); /*刷新变量flag*/
                    m_payType.flushCountType(); /*刷新变量prevType*/
                }
                if (ev.data.hasOwnProperty('withoutActivityFakeFlushev')) {
                    //alert(1);
                    m_payType.cancelStyle();
                    m_orderAmount.cancelVipValue();
                    m_orderAmount.fakeFlush(); /*刷新变量flag*/
                    m_payType.flushCountType(); /*刷新变量prevType*/
                }
            }
        },
        getCountDownTime: function(ev) {
            /*给模块倒计时时间*/
            m_orderAmount.getCountDownTime(m_countdown.timeChange());
            m_payType.getCountDownTime(m_countdown.timeChange())

        }

    }

    //---------------子模块定义---------------
    var modInit = function() {
        m_header = header(nodeList.header, opts);
        m_header.init();

        m_payType = payType(nodeList.payType, opts);
        m_payType.init();

        m_orderAmount = orderAmount(nodeList.orderAmount, opts);
        m_orderAmount.init();

        m_countdown = countdown(nodeList.countDown, opts);
        m_countdown.init();

        virtualLink('data-url');

    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        m_payType.bind("payGui", evtFuncs.payGui);

        m_orderAmount.bind("getCountDownTime", evtFuncs.getCountDownTime);
        m_payType.bind("getCountDownTime", evtFuncs.getCountDownTime);

        storageMessager.bind("changeUserData", evtFuncs.changeUserData);
        /*通知header 可以使用 会员特惠接口*/
        m_orderAmount.bind("cancelDis", evtFuncs.cancelDis);

        webBridge.notification = function(param) { //{'changeData':'false','cancelFavorable':true} 传入参数
            custFuncs.appChangeUserDate(param);
        }
        webBridge.onBackPressed = function() {
            m_header.onBackPressed();
            var isIPhone = navigator.appVersion.match(/iphone/gi);
            if (isIPhone) {
                return "turnBackSucceed";
            }
        }
    }

    //-----------------自定义函数-------------
    var custFuncs = {
            initView: function() {
                webBridge.close(2);
                window.localStorage.setItem('outstandingOrderUrl', util.getCurrentURL()); //存储url用于二次支付
                storageMessager.send('outstandingOrderUrl', '');
            }
        }
        //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts;
        nodeList = {
            countDown: queryNode("#m_countdown"),
            orderInfo: queryNode("#order_info"),
            payType: queryNode("#pay_type"),
            orderAmount: queryNode("#order_amount"),
            header: queryNode("#m_header")
        };
        modInit();
        bindEvents();
        custFuncs.initView();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});