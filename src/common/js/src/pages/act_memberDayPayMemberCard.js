/**
 * 会员卡支付单独卖品页面
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var pay = require("sea/act_memberDayPayMemberCard/pay");
    var queryToJson = require("lib/json/queryToJson");
    var URL = require("lib/util/URL");
    var header = require("sea/header");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_pay = null;

    //---------------事件定义----------------
    var evtFuncs = {

    }

    //---------------子模块定义---------------
    var modInit = function() {
        m_pay = pay(nodeList.pay, opts);
        m_pay.init();

        m_header = header(nodeList.header, opts);
        m_header.init();
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {

    }

    //-----------------自定义函数-------------
    var custFuncs = {}

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = queryToJson(URL.parse(location.href)["query"]);
        opts.pageInt = _opts;
        nodeList = {
            pay: queryNode("#m-pay"),
            header: queryNode("#m_header")
        };
        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;
    return that;
});