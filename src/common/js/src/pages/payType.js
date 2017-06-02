/**
 * 第三方支付首页
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    //var webBridge = require("sea/webBridge");
    var URL = require("lib/util/URL");
    var queryToJson = require("lib/json/queryToJson");
    var payType = require("sea/payType/payType");
    var storageMessager = require("lib/evt/storageMessager");
    var header = require("sea/payType/header");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_payType = null;
    var m_header = null;

    //---------------事件定义----------------
    var evtFuncs = {
        back: function() {
            /*if(opts["payType"] == "TicketPay") {
             custFuncs.canceldiscountTicketPay();
             } else if(opts["payType"] == "CouponTicketPay") {
             custFuncs.cancelCouponTicketPay();
             }
             webBridge.close();*/
         /*   if (opts["gui"] == undefined) {
                if(opts["payType"] == "TicketPay") {
                    custFuncs.canceldiscountTicketPay();
                } else if(opts["payType"] == "CouponTicketPay") {
                    custFuncs.cancelCouponTicketPay();
                }
            }*/
            if (opts["gui"] == 1) {
                //storageMessager.send("cancelStyle");/*通知“支付页面”改变样式*/
                if (opts["cardActId"] != "") {
                    //storageMessager.send("cancelStyle");/*通知“支付页面”改变样式*/
                    storageMessager.send("changeUserData",{'changeData':'false','changeStyle':'true'});
                } else {
                    //storageMessager.send("bindCard");/*不是会员活动需要刷新, 用体验很差*/
                    //storageMessager.send("withoutActivityFakeFlush");
                    storageMessager.send("changeUserData",{'changeData':'false','withoutActivityFakeFlush':'true'});
                }
            }
            webBridge.close();
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        m_payType = payType(nodeList.payType, opts);
        m_payType.init();

        m_header = header(nodeList.header, opts);
        m_header.init();
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
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
    var custFuncs = {
        initView: function () {
            m_payType.initView();
        }
    }

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = queryToJson(URL.parse(location.href)["query"]);
        opts.pageInt = _opts;
        //console.log(opts.pages);
        nodeList = {
            payType: queryNode("#m_payType"),
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