/**
 * 单独卖品订单详情
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var header = require("sea/header");
    var virtualLink = require("lib/util/virtualLink");
    var webBridge = require("sea/webBridge");
    var orderInfo = require("sea/mealDetails/orderInfo");
    //---------- require end -------------

    //------------声明各种变量----------------
    var that = compBase();
    var m_header = null;
    var m_orderInfo = null;
    var nodeList = null;
    var opts = null;

    //---------------事件定义----------------
    var evtFuncs = {}

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }
        m_orderInfo = orderInfo(nodeList.orderInfo, opts);
        m_orderInfo.init();

        virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {}

    //-----------------自定义函数-------------
    var custFuncs = {}

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts || {};

        nodeList = {
            header: queryNode("#m_header"),
            orderInfo: queryNode("#m_order_info")
        }

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});