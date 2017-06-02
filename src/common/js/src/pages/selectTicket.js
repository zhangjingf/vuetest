/**
 * 订单支付 电子券支付 页面控制器
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    //var touch = require("touch");
    var header = require("sea/selectTicket/header");
    var eleTicketList = require("sea/selectTicket/eleTicketList");
    var webBridge = require("sea/webBridge");
    var storageMessager = require("lib/evt/storageMessager");

    //var showMessage = require("sea/showMessage");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_eleTicketList = null;
    var m_header = null;
    var arrRus = null;

    //---------------事件定义----------------
    var evtFuncs = {
        headerEnsure: function (event) {
            if (nodeList.header) {
                m_header.changeEnsure(event.data.value);
            }
        },
        appHeaderEnsure: function (event) {
            var result = event.data.value;
            if (result.length == 2) {
                /*className.remove(nodeList.ensure, "ensure-color");
                className.add(nodeList.ensure, "unbind");*/
                webBridge.changeRightButColor({"color":"#6a6a6a","flag":"false"});//变为灰色
            } else {
                /*className.remove(nodeList.ensure, "unbind");
                className.add(nodeList.ensure, "ensure-color");*/
                webBridge.changeRightButColor({"color":"#FF9600","flag":"true"});//变为黄色
            }
            arrRus = result;
        }
    }


    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }

        m_eleTicketList = eleTicketList(nodeList.eleTicketList, opts);
        m_eleTicketList.init();
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        m_eleTicketList.bind("ensureChange", evtFuncs.headerEnsure);
        m_eleTicketList.bind("ensureChange", evtFuncs.appHeaderEnsure);

        webBridge.clickRightEnsure = function () {
            storageMessager.send("ensureTicket",{
                "arrRus": arrRus
            });
            webBridge.close();
        }
    }

    //-----------------自定义函数-------------
    var custFuncs = {}

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts || {};

        nodeList = {
            header: queryNode("#m_header"),
            eleTicketList: queryNode("#m_eleTicketList")
        };

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});