/**
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var each = require("lib/util/each");
    var touch = require("touch");
    var closest = require("lib/dom/closest");
    //var alert = require("sea/dialog/alert");
    //var webBridge = require("sea/webBridge");
    //var showMessage = require("sea/showMessage");
    var className = require("lib/dom/className");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var payType = null;
        var payOrderUrl = null;

        //---------------事件定义----------------
        var evtFuncs = {
            selectPayType: function (ev) {
                /*单选框切换*/
                var typeNode = closest(ev.target, "[data-type]", nodeList.payType);
                payType = typeNode.getAttribute("data-type");
                payOrderUrl = typeNode.getAttribute("data-href");

                each(nodeList.icon, function (item) {
                    var iconPayType = item.getAttribute("data-icon");
                    if(iconPayType == payType) {
                        if(className.has(item,"select-icon")) {

                            className.remove(item, "select-icon");
                            className.add(item, "selected-icon");
                        }
                    } else {
                        className.remove(item, "selected-icon");
                        className.add(item, "select-icon");
                    }
                });
                custFuncs.noticePayType();
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(node, "tap", "[data-type]", evtFuncs.selectPayType);
        }
        //-----------------自定义函数-------------
        var custFuncs = {
            emptySelectedPayType: function () {
                /*清空选中支付方式*/
                payType = null;
                payOrderUrl = null;
                each(nodeList.icon, function (item) {
                    className.remove(item, "selected-icon");
                    className.add(item, "select-icon");
                });
                custFuncs.noticePayType();
            },
            noticePayType: function () {
                /*传播支付方式选择*/
                that.fire("payType", {"payType":payType,"payOrderUrl":payOrderUrl});
            }
        };

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.emptySelectedPayType = custFuncs.emptySelectedPayType;
        return that;
    }
});
