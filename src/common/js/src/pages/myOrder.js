/**
 * 我的订单页面
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var orderInfo = require("sea/myOrder/order");
    var slideNav = require("sea/slideNav");
    var header = require("sea/myOrder/header");
    var queryToJson = require("lib/json/queryToJson");
    var URL = require("lib/util/URL");
    var virtualLink = require("lib/util/virtualLink");
    var util = require("sea/utils");
    var storageMessager = require("lib/evt/storageMessager");
    var webBridge = require("sea/webBridge");
    var flexBoxRefresh = require("sea/flexBoxRefresh");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_orderInfo = null;
    var m_typeTabs = null;
    var m_header = null;
    var m_flexBoxRefresh = null;

    var url = null;
    //---------------事件定义----------------
    var evtFuncs = {
        slideTap: function (ev) {
            m_orderInfo.swiper(ev.data);
        },
        slideChange: function (ev) {
            m_typeTabs.slideShift(ev.data.index + 1);
        },

        back: function () {
            if (url["form"] == "payResult") {
                webBridge.popToSelectedController("mine");
            }
            else {
                webBridge.close();
            }
        },
        reload: function (ev) {
            if(ev.data.orderNo) {
                //改签订单二次支付返回失败，取消订单
                m_orderInfo.cancelOrder(ev.data.orderNo,'0');
            } else {
                webBridge.openUrl(util.getCurrentURL(), 'self');
            }
        }
    }

    //---------------子模块定义---------------
    var modInit = function () {
        m_typeTabs = slideNav(nodeList.typeTabs, {
            count: 4
        });
        m_typeTabs.init();

        m_orderInfo = orderInfo(nodeList.myOrder, opts);
        m_orderInfo.init();

        virtualLink('data-url');

        m_flexBoxRefresh = flexBoxRefresh(nodeList.pbd, {
            'atTheTop': custFuncs.atTheTop,
            'leaveTheTop': custFuncs.leaveTheTop
        });
        m_flexBoxRefresh.init();

        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }

    }

    //-----------------绑定事件---------------
    var bindEvents = function () {
        m_typeTabs.bind("switchTab", evtFuncs.slideTap);
        m_orderInfo.bind("slideChange", evtFuncs.slideChange);
        storageMessager.bind("outstandingOrderUrl", evtFuncs.reload);
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
        atTheTop: function () {
            webBridge.flexBoxRefresh({atTheTop: '1'});
            m_flexBoxRefresh.work();
        },
        leaveTheTop: function () {
            webBridge.flexBoxRefresh({atTheTop: '0'});
            m_flexBoxRefresh.work();
        }
    }
    //-----------------初始化----------------
    var init = function (_opts) {
        opts = _opts || {};
        url = queryToJson(URL.parse(location.href)["query"]);

        nodeList = {
            myOrder: queryNode("#my_order"),
            typeTabs: queryNode("#m_typeTabs"),
            header: queryNode("#m_header"),
            pbd: queryNode("#m_pbd")
        };

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});