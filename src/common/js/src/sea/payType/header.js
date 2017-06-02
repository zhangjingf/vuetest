/**
 * 子页面顶部功能，仅有一个返回连接
 * payType=“TicketPay”//优惠券支付
 *         "CouponTicketPay"//电子券支付
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var webBridge = require("sea/webBridge");
    var ajax = require("lib/io/ajax");
    var merge = require("lib/json/merge");
    var showMessage = require("sea/showMessage");
    var storageMessager = require("lib/evt/storageMessager");
    var touch = require("touch");
    var loading = require("sea/dialog/loading");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_loading = null;

        //---------------事件定义----------------
        var evtFuncs = {
            back: function() {
                /*if(opts["payType"] == "TicketPay") {
                    custFuncs.canceldiscountTicketPay();
                } else if(opts["payType"] == "CouponTicketPay") {
                    custFuncs.cancelCouponTicketPay();
                }
                webBridge.close();*/
                if (opts["gui"] == "1") {
                    //storageMessager.send("cancelStyle");/*通知“支付页面”改变样式*/
                    if (opts["cardActId"] != "") {
                        //storageMessager.send("cancelStyle");/*通知“支付页面”改变样式*/
                        storageMessager.send("changeUserData",{'changeData':'false','changeStyle':'true'});
                    } else {
                        //storageMessager.send("bindCard");/*不是会员活动需要刷新, 用体验很差*/
                        //storageMessager.send("withoutActivityFakeFlush");
                        storageMessager.send("changeUserData",{'changeData':'false','withoutActivityFakeFlush':'true'});
                    }
                } else {
                    if(opts["payType"] == "TicketPay") {
                        custFuncs.canceldiscountTicketPay();
                    } else if(opts["payType"] == "CouponTicketPay") {
                        custFuncs.cancelCouponTicketPay();
                    } else {
                        webBridge.close();
                    }
                    return;
                }
                webBridge.close();
            }
        };

        //---------------子模块定义---------------
        var modInit = function() {
            m_loading = loading();
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            if(nodeList.back) {
                touch.on(nodeList.back, "tap", evtFuncs.back);
            }
            webBridge.onBackPressed = function () {
                evtFuncs.back();
                var isIPhone = navigator.appVersion.match(/iphone/gi);
                if (isIPhone) {
                    return "turnBackSucceed";
                }
            };
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            //撤销电子券支付方式
            cancelCouponTicketPay: function () {
                if(that.isLock()) {
                    return;
                }
                that.lock();
                var param ={
                    "orderNo":opts["orderNo"]
                };
                m_loading.show();
                ajax({
                    "url": opts["pageInt"]["disCouponPay"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        m_loading.hide();
                        that.unLock();
                        if (res["status"] != '1') {
                            showMessage(res["msg"],function(){
                                webBridge.close();
                            });
                        } else {
                            if(res["data"]) {
                                webBridge.openUrl(res["data"]["resultUrl"]);
                            }else {
                                webBridge.close();
                            }
                        }
                        //showMessage(res["msg"]);
                    },
                    "onError": function (req) {
                        m_loading.hide();
                        that.unLock();
                        console.error("网络连接失败:" + req.data);
                    }
                })
            },
            //撤销优惠券支付方式
            canceldiscountTicketPay: function () {
                if(that.isLock()) {
                    return;
                }
                that.lock();
                var param = {
                    "orderNo":opts["orderNo"]
                    };
                m_loading.show();
                ajax({
                    "url": opts["pageInt"]["disTicketPay"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        m_loading.hide();
                        that.unLock();
                        if (res["status"] != '1') {
                            showMessage(res["msg"],function(){
                                webBridge.close();
                            });

                        } else {
                            if(res["data"]) {
                                webBridge.openUrl(res["data"]["resultUrl"]);
                            } else {
                                webBridge.close();
                            }
                        }
                        //showMessage(res["msg"]);
                    },
                    "onError": function (req) {
                        m_loading.hide();
                        that.unLock();
                        console.error("网络连接失败:" + req.data);
                    }
                })
            }/*,
            //取消会员特惠
            cancelDiscount: function () {
                var param = {
                    //a)orderNo: 订单号
                    //b)cardActId： 活动id
                    "orderNo": opts["orderNo"],
                    "cardActId": opts["cardActId"]
                };
                ajax({
                    "url": opts["cancelActivity"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        if (res["status"] == 0) {
                            console.log(res["msg"]);
                            return;
                        }
                        //custFuncs.cancelActivityShow();
                    },
                    "onError": function (req) {
                        console.error("网络连接失败(" + req.status + ")");
                    }
                });
            }*/
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
        };

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});