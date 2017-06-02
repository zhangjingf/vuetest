/**
 *main
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var className = require("lib/dom/className");
    var closest = require("lib/dom/closest");
    var each = require("lib/util/each");
    var touch = require("touch");

    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            payType: function (ev) {
                var typeNode = closest(ev.target, "[data-type]", nodeList.payType);
                var payType = parseInt(typeNode.getAttribute("data-type"), 10);
                var iconNode = nodeList.icon;
                each(iconNode, function (item) {
                    var iconNodeNumber = item.getAttribute("data-icon");
                    if (iconNodeNumber == payType) {
                        if (className.has(item, "select-icon")) {
                            className.remove(item, "select-icon");
                            className.add(item, "selected-icon");
                        }
                    } else {
                        className.remove(item, "selected-icon");
                        className.add(item, "select-icon");
                    }
                });

                that.fire("changePayType",{"payType":payType,url:typeNode.getAttribute("data-href")});
            },
            payNum: function(ev) {
                custFuncs.curClear();
                ev.target.classList.add("cur");
                that.fire("changeData",ev.target);
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {

        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.payType, "tap", "[data-type]", evtFuncs.payType);
            touch.on(nodeList.fillMoney, "tap", "div", evtFuncs.payNum);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            "curClear": function() {
                each(nodeList.fillMoney.childNodes, function (item) {
                    if(item.nodeType == 1) {
                        item.classList.remove("cur");
                    }
                });
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
        return that;
    }
});