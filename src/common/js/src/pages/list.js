/**
 * 现金积分
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var virtualLink = require('lib/util/virtualLink');
    var pay = require("sea/list/pay");
    var main = require("sea/list/main");
    var header = require("sea/header");
    var URL = require("lib/util/URL");
    var storageMessager = require("lib/evt/storageMessager");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_main = null;
    var m_pay = null;

    //---------------事件定义----------------
    var evtFuncs = {
        "changePayType": function (ev) {
            m_pay.payType(ev.data);
        },
        "changeData": function (ev) {
            m_pay.payNum(ev.data);
        },
        "payResult": function(ev) {
            if( ev.data.url == URL.parse(location.href)["query"]) {
                window.location.reload();
            } else {
               window.location.replace(ev.data.href);
            }
        }
    }

    //---------------子模块定义---------------
    var modInit = function () {
        if (nodeList.header) {
            m_header = header(nodeList.header);
            m_header.init();
        }

        m_main = main(nodeList.main, opts);
        m_main.init();

        m_pay = pay(nodeList.pay, opts);
        m_pay.init();
        
        storageMessager.bind("payResult", evtFuncs.payResult);

        virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function () {
        m_main.bind("changeData", evtFuncs.changeData);
        m_main.bind("changePayType", evtFuncs.changePayType);
    }

    //-----------------自定义函数-------------
    var custFuncs = {}

    //-----------------初始化----------------
    var init = function (_opts) {
        opts = _opts || {};
        nodeList = {
            header: queryNode("#m_header"),
            main: queryNode("#m_recharge"),
            pay: queryNode("#m_orderAmount")
        }

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});