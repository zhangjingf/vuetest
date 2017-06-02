/**
 * 单独卖品订单支付
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var storageMessager = require("lib/evt/storageMessager");
    var parseNode = require("lib/dom/parseNode");
    var URL = require("lib/util/URL");
    var queryToJson = require("lib/json/queryToJson");
    var webBridge = require("sea/webBridge");
    var header = require("sea/payMealOrder/header");
    var orderAmount = require("sea/payMealOrder/orderAmount");
    var payType = require("sea/payMealOrder/payType");
    var countdown = require("sea/payMealOrder/countdown");
    var server = require("sea/payMealOrder/server");

    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_payType = null;
    var m_orderAmount = null;
    var m_countdown = null;
    var m_server = null;

    //---------------事件定义----------------
    var evtFuncs = {
        payType: function (ev) {
            m_orderAmount.payOrder(ev.data);
            console.log(ev.data)
        },
        timeChange: function (ev) {
            console.log(ev.data);
        },
        getCountTime: function () {
            var timeChange= m_countdown.timeChange();
                m_orderAmount.timeChange(timeChange);
        },
        changeUserData: function (ev) {
            /*处理各种后退*/
            if(ev.data.changeData=="true") {
                //订单数据改变操作
                webBridge.reload();

            } else {
                m_payType.emptySelectedPayType();
                //订单数据未改变操作
            }
        }
    }

    //---------------子模块定义---------------
    var modInit = function () {
        m_header = header(nodeList.header, opts);
        m_header.init();

        m_payType = payType(nodeList.payType, opts);
        m_payType.init();

        m_server = server(nodeList.server, opts);
        m_server.init();

        m_orderAmount = orderAmount(nodeList.orderAmount, opts);
        m_orderAmount.init();

        m_countdown = countdown(nodeList.countdown, opts);
        m_countdown.init();

    }

    //-----------------绑定事件---------------
    var bindEvents = function () {
        m_payType.bind("payType",evtFuncs.payType);
        m_orderAmount.bind("getCountTime",evtFuncs.getCountTime);
        storageMessager.bind("changeUserData",evtFuncs.changeUserData);
        webBridge.onBackPressed = function () {
            m_header.back();
            var isIPhone = navigator.appVersion.match(/iphone/gi);
            if (isIPhone) {
                return "turnBackSucceed";
            }
        }
    }

    //-----------------自定义函数-------------
    var custFuncs = {

    }
    //-----------------初始化----------------
    var init = function (_opts) {
        opts = queryToJson(URL.parse(location.href)["query"]);
        opts.pageInt = _opts;
        nodeList = {
            header: queryNode("#m_header"),
            countdown: queryNode("#m_countdown"),
            payType: queryNode("#pay_type"),
            server: queryNode("#m_server"),
            orderAmount: queryNode("#order_amount")
        };
        modInit();
        bindEvents();
        localStorage.setItem("outstandingMealUrl",location.href);
        //webBridge.close(2);
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});