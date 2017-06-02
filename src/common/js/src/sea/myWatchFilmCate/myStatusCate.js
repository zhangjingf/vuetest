/**
 * 我的光影美食 tab
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var closest = require("lib/dom/closest");
    var confirm = require("sea/dialog/confirm");
    var webBridge = require("sea/webBridge");
    var ajax = require("lib/io/ajax");
    var showMessage = require("sea/showMessage");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            cancelWiatingPay: function (ev) {
                ev.stopPropagation();
                var dialog = confirm("确定要取消订单吗？",{
                    "title": "温馨提示",
                    "OKText": "确定",
                    "cancelText": "取消",
                    "OK": function() {
                        var target = ev.target;
                        var pNode = closest(target, "[data-order]", node);/*开始元素,含有的属性,终点元素*/
                        if (pNode == null) {
                            return;
                        }
                        var dataOrder = pNode.getAttribute("data-order");
                        if(that.lock()){
                            return;
                        }
                        that.lock();
                        ajax({
                            "url": opts["cancelOrderApi"],
                            "method": "post",
                            "data": {
                                "orderNo": dataOrder,
                                "orderType": 1
                            },
                            "onSuccess": function (res) {
                                that.unLock();
                                if (res.status != 1) {
                                    console.error(res["msg"]);
                                    showMessage(res["msg"]);
                                    return;
                                }
                                webBridge.openUrl(res["data"]["url"],'self');
                            },
                            "onError": function (req) {
                                that.unLock();
                                console.error("网络连接失败(" + req.status + ")");
                            }
                        });
                    },
                    "cancel": function() {}
                });
                dialog.init();
                dialog.show();
            }
        };

        //---------------子模块定义---------------
        var modInit = function() {

        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(node, "tap", "[node-name=cancelBtn]", evtFuncs.cancelWiatingPay);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});