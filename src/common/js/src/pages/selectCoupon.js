/**
 * 订单支付 优惠券支付
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    //var touch = require("touch");
    var header = require("sea/selectCoupon/header");
    var couponList = require("sea/selectCoupon/couponList");
    var webBridge = require("sea/webBridge");
    var storageMessager = require("lib/evt/storageMessager");


    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_couponList = null;
    var m_header = null;
    var ticketArr = null;
    //---------------事件定义----------------
    var evtFuncs = {
        selected: function (ev) {
            if (nodeList.header) {
                m_header.changeBindState(ev.data.index,ev.data.selectTicketArr);
            }
        },
        appSelected: function (ev) {
            ticketArr = ev.data.selectTicketArr;
            if (ev.data.index == "0") {
                webBridge.changeRightButColor({"color": "#6a6a6a", "flag": "false"});//变为灰色
            } else if (ev.data.index == "1") {
                webBridge.changeRightButColor({"color": "#FF9600", "flag": "true"});//变为黄色
            }
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }
        m_couponList = couponList(nodeList.couponList, opts);
        m_couponList.init();
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        m_couponList.bind("selected",evtFuncs.selected);
        m_couponList.bind("selected",evtFuncs.appSelected);
        //webBridge.changeRightButColor({"color":"#FF9600","flag":"true"});

        webBridge.clickRightEnsure = function () {
            if(ticketArr== null || ticketArr=='') {
                return;
            }
            storageMessager.send("selectedCoupon",
                {
                    ticketArr:ticketArr
                }
            );
            webBridge.close();
        }
    }

    //-----------------自定义函数-------------
    var custFuncs = {

    }

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts;
        nodeList = {
            header: queryNode("#m_header"),
            couponList: queryNode("#m_couponList")
        }

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;
    return that;
});