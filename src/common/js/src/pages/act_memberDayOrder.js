/**
 * 会员日活动购买电子券
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var storageMessager = require("lib/evt/storageMessager");
    var parseNode = require("lib/dom/parseNode");
    var header = require("sea/header");
    var orderAmount = require("sea/act_memberDayOrder/orderAmount");
    var payType = require("sea/act_memberDayOrder/payType");
    var orderInfo = require("sea/act_memberDayOrder/orderInfo");
    var showMessage = require("sea/showMessage");

    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_payType = null;
    var m_orderAmount = null;
    var m_orderInfo = null;

    //---------------事件定义----------------
    var evtFuncs = {
        payType: function (ev) {
            m_orderAmount.payOrder(ev.data);
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
        },
        changeNum: function (ev) {
            console.log(ev.data);
            m_orderAmount.couponNum(ev.data.num);
        }
    }

    //---------------子模块定义---------------
    var modInit = function () {
        if(nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }

        m_payType = payType(nodeList.payType, opts);
        m_payType.init();

        m_orderAmount = orderAmount(nodeList.orderAmount, opts);
        m_orderAmount.init();

        m_orderInfo = orderInfo(nodeList.orderInfo, opts);
        m_orderInfo.init();

    }

    //-----------------绑定事件---------------
    var bindEvents = function () {
        m_payType.bind("payType",evtFuncs.payType);
        m_orderInfo.bind("changeNum",evtFuncs.changeNum)
        storageMessager.bind("changeUserData",evtFuncs.changeUserData);
    }

    //-----------------自定义函数-------------
    var custFuncs = {

    }
    //-----------------初始化----------------
    var init = function (_opts) {
        opts = {};
        opts.pageInt = _opts;
        nodeList = {
            header: queryNode("#m_header"),
            orderInfo: queryNode("#order_info"),
            payType: queryNode("#pay_type"),
            orderAmount: queryNode("#order_amount")
        };
        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});