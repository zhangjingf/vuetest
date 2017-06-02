/**
 * 电子券支付 页面控制器
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var header = require("sea/payTicket/header");
    var payTicket = require("sea/payTicket/payTicket");
    var virtualLink = require("lib/util/virtualLink");
    var storageMessager = require("lib/evt/storageMessager");
    var webBridge = require("sea/webBridge");
    var showMessage = require("sea/showMessage");

    var touch = require("touch");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_payTicket = null;

    var isPaying = null;
    //---------------事件定义----------------
    var evtFuncs = {
        showResult : function (ev) {
            /* 展示选中的电子券 */
            m_payTicket.showTicket(ev.data.arrRus);
        },
        paying: function() {
            m_header.paying();
        },

        payed: function() {
            m_header.payed();
        },

        appPaying: function () {
            isPaying = true;
        },

        appPayed: function () {
            isPaying = false;
        },

        back: function() {
            if (isPaying) {
                showMessage('正在支付中，请稍后');
                return;
            }
            //storageMessager.send("cancelStyle");/*通知“支付页面”改变样式*/
            //storageMessager.send("cancelFavorable",false);/*取消会员优惠  并改变样式*/
            storageMessager.send("changeUserData",{'changeData':'false','cancelFavorable':false});
            webBridge.close();
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header);
            m_header.init();
        }

        m_payTicket = payTicket(nodeList.payTicket, opts);
        m_payTicket.init();

        virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        /* 选择电子券页面hook出来的事件 */
        storageMessager.bind("ensureTicket", evtFuncs.showResult);
        if (nodeList.header) {
            m_payTicket.bind('paying', evtFuncs.paying);
            m_payTicket.bind('payed', evtFuncs.payed);
        } else {
            m_payTicket.bind('paying', evtFuncs.appPaying);
            m_payTicket.bind('payed', evtFuncs.appPayed);
        }
        if(!nodeList.header) {
            webBridge.onBackPressed = function () {
                evtFuncs.back();
                var isIPhone = navigator.appVersion.match(/iphone/gi);
                if (isIPhone) {
                    return "turnBackSucceed";
                }
            };
        }
    }

    //-----------------自定义函数-------------
    var custFuncs = {}

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts || {};
        nodeList = {
            header: queryNode("#m_header"),
            payTicket: queryNode("#m_payTicket")
        }

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});