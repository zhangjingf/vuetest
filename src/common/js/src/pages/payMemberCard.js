/**
 * 会员卡支付页面
 * 改签流程确认改签也使用这个页面，确认是判断pageInt的changOrderInfo是否为空判断走改签还是购票流程
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var pay = require("sea/payMemberCard/pay");
    var queryToJson = require("lib/json/queryToJson");
    var URL = require("lib/util/URL");
    var storageMessager = require("lib/evt/storageMessager");
    var showMessage = require("sea/showMessage");
    var header = require("sea/payMemberCard/header");
    var webBridge = require('sea/webBridge');
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_pay = null;
    var url = null;
    var isPaying = false;
    //---------------事件定义----------------
    var evtFuncs = {
        paying: function() {
            m_header.paying();
        },

        payed: function() {
            m_header.payed();
        },

        back: function(ev) {
            if (isPaying) {
                showMessage('正在支付中，请稍后');
                return;
            }
            //alert(opts["payment"]);
            //storageMessager.send("cancelActivity", opts["cardActId"]);
            /*                console.log(opts["virtualDiscountAmount"]);
             if (opts["virtualDiscountAmount"] >=1) {/!*用户有活动优惠票时 回退需要取消*!/
             storageMessager.send("cancelActivity", opts["cardActId"]);
             }*/  //不取消

            //storageMessager.send("cancelStyle");/*通知“支付页面”改变样式*/
            storageMessager.send("changeUserData",{'changeData':'false','cancelFavorable':true});
            //storageMessager.send("cancelFavorable",true);/*取消会员优惠  并改变样式*/
            webBridge.close();
        },
        appPaying: function () {
            isPaying = true;
        },
        appPayed: function () {
            isPaying = false;
        }

    }

    //---------------子模块定义---------------
    var modInit = function() {
        m_pay = pay(nodeList.pay, opts);
        m_pay.init();

        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        if (nodeList.header) {
            m_pay.bind('paying', evtFuncs.paying);
            m_pay.bind('payed', evtFuncs.payed);
        } else {
            m_pay.bind('paying', evtFuncs.appPaying);
            m_pay.bind('payed', evtFuncs.appPayed);
        }
        if(!nodeList.header) {
            webBridge.onBackPressed = function () {
                evtFuncs.back();
                /*var isAndroid = navigator.appVersion.match(/android/gi);*/
                var isIPhone = navigator.appVersion.match(/iphone/gi);
                if (isIPhone) {
                    return "turnBackSucceed";
                }
            }
        }

    }

    //-----------------自定义函数-------------
    var custFuncs = {
        initView: function () {
            if(opts["memberPayError"] =='1') {
                showMessage(opts["statusRemark"], function () {
                    webBridge.close();
                });
            }
        }
    }

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts;
        url = queryToJson(URL.parse(location.href)["query"]);
        nodeList = {
            pay: queryNode("#m-pay"),
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