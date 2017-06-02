/**
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var storageMessager = require("lib/evt/storageMessager");
    var className = require("lib/dom/className");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var ticketArr = null;

        //---------------事件定义----------------
        var evtFuncs = {
            back: function () {
                webBridge.close();
            },
            selectedBack: function () {
                if(ticketArr==null || ticketArr=='') {
                    return;
                }
                storageMessager.send("selectedCoupon",
                    {
                        ticketArr:ticketArr
                    }
                );
                webBridge.close();
            }

        }

        //---------------子模块定义---------------
        var modInit = function () {
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.back, "tap", evtFuncs.back);
            touch.on(nodeList.ensure, "tap", evtFuncs.selectedBack);

            webBridge.selectedBank = function () {
                evtFuncs.selectedBack();
            }
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            changeBindState: function (index,selectTicketArr) {
                ticketArr = selectTicketArr;
                if (index == 1) {
                    if (className.has(nodeList.ensure, "ensure-color")) {
                        return;
                    } else if (className.has(nodeList.ensure, "unbind")) {
                        className.remove(nodeList.ensure, "unbind");
                        className.add(nodeList.ensure, "ensure-color");
                    }
                } else if(index == 0) {
                    if (className.has(nodeList.ensure, "unbind")) {
                        return;
                    } else if (className.has(nodeList.ensure, "ensure-color")) {
                        className.remove(nodeList.ensure, "ensure-color");
                        className.add(nodeList.ensure, "unbind");
                    }
                }
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
        that.changeBindState = custFuncs.changeBindState;

        return that;
    }
});