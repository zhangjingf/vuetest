/**
 * 返回，取消订单
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    var confirm = require("sea/dialog/confirm");
    var ajax = require("lib/io/ajax");
    var showMessage = require("sea/showMessage");
    var loading = require("sea/dialog/loading");
    var when = require("lib/util/when");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var hasbindCardAct = false;//是否需要取消会员特惠

        var m_loading = null;
        //---------------事件定义----------------
        var evtFuncs = {
            back: function () {
                var dialog = confirm("点击【确定】后，您当前的订单和选定<br/>的座位将会被取消，并返回购买列表页", {
                    "OK": function () {
                        if(hasbindCardAct) {
                            custFuncs.unBindCardAct()
                                .then(function () {
                                    custFuncs.cancelOrder();
                                });
                        } else {
                            custFuncs.cancelOrder();
                        }

                    }
                });
                dialog.init();
                dialog.show();
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_loading = loading();
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            if (node) {
                touch.on(nodeList.back, "tap", evtFuncs.back);
            }
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            /*取消订单*/
            cancelOrder: function () {
                var defer = when.defer();
                if (that.isLock()) {
                    return;
                }
                that.lock();
                m_loading.show();
                var param = {
                    "orderNo": opts["url"]["orderNo"]
                };
                ajax({
                    "url": opts["cancelOrder"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        m_loading.hide();
                        defer.resolve();
                        webBridge.openUrl(opts["urlShowTime"] + '&from=payOrder');
                        if (res["status"] != 1) {
                            showMessage(res["msg"]);
                            return;
                        }
                    },
                    "onError": function (req) {
                        that.unLock();
                        m_loading.hide();
                        defer.reject("网络连接失败:" + req.status);
                        console.error("网络连接失败:" + req.msg);
                    }
                });
                return defer.promise;
            },
            /*取消会员特惠*/
            unBindCardAct: function () {
                var defer = when.defer();
                ajax({
                    "url": opts["cancelBindCardAct"],
                    "method": "post",
                    "data":  {
                        "orderNo": opts["url"]["orderNo"],
                        "cardActId": opts["url"]["cardActId"]
                    },
                    "onSuccess": function (res) {
                        defer.resolve();
                        if (res["status"] != '1') {
                            console.log(res["msg"]);
                            return;
                        }
                    },
                    "onError": function (req) {
                        defer.resolve();
                        console.error("网络连接失败(" + req.status + ")");
                    }
                });
                return defer.promise;
            },
            cancelcardAct: function (data) {
                hasbindCardAct = data;
            },
            onBackPressed: function () {
                evtFuncs.back();
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.cancelcardAct = custFuncs.cancelcardAct;
        that.onBackPressed = custFuncs.onBackPressed;

        return that;
    }
});