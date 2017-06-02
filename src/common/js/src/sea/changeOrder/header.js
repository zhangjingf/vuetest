/**
 * 返回，取消订单
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    var confirm = require("sea/dialog/confirm");
    var ajax = require("lib/io/ajax");
    var showMessage = require("sea/showMessage");
    var queryToJson = require("lib/json/queryToJson");
    var storageMessager = require("lib/evt/storageMessager");
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
                var dialog = confirm("点击【确定】后，您当前的订单和选定<br/>的卖品将会被取消，并返回购买列表页", {
                    "OK": function () {
                        custFuncs.cancelOrder();
                    }
                });
                dialog.init();
                dialog.show();
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
            m_loading = loading();
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            if(!!nodeList.back) {
                touch.on(nodeList.back, "tap", evtFuncs.back);
            }

        }

        //-----------------自定义函数-------------
        var custFuncs = {
            /*取消订单*/
            cancelOrder: function() {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                m_loading.show();
                var param = {
                    "orderNo": opts["url"]["orderNo"]
                }
                ajax({
                    "url": opts["cancelOrder"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function(res) {
                        that.unLock();
                        m_loading.hide();
                        if (res["status"]!= '1') {
                            showMessage(res["msg"], function () {
                                webBridge.close();
                            });
                            return;
                        }
                        storageMessager.send("outstandingOrderUrl",{});
                        webBridge.close();
                    },
                    "onError": function(req) {
                        that.unLock();
                        m_loading.hide();
                        console.error("网络连接失败:" + req.msg);
                    }
                });
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
            webBridge.onBackPressed = function () {
                evtFuncs.back();
                var isIPhone = navigator.appVersion.match(/iphone/gi);
                if (isIPhone) {
                    return "turnBackSucceed";
                }
            }
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.cancelDis = custFuncs.cancelDis;
        return that;
    }
});
