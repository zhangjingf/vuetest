/**
 * 可用优惠券列表
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var each = require("lib/util/each");
    var className = require("lib/dom/className");
    var closest = require("lib/dom/closest");
    var showMessage = require("sea/showMessage");
    var touch = require("touch");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var selectTicketList = [];

        //---------------事件定义----------------
        var evtFuncs = {
            selectTicket: function (ev) {
                var ticketNode = closest(ev.target, "[data-ticket]", node);
                var nodeSelected = parseNode(ticketNode).selected;
                if (className.has(nodeSelected, "icon-green-select")) {
                    className.remove(nodeSelected, "icon-green-select");
                    each(selectTicketList, function (item,index) {
                        if(item == ticketNode.getAttribute("data-ticket")) {
                            selectTicketList.splice(index,1);
                        }
                    })
                } else {
                    className.add(nodeSelected, "icon-green-select");
                    selectTicketList.push(ticketNode.getAttribute("data-ticket"));
                }
                if(selectTicketList.length > 0) {
                    that.fire("selected", {
                        index: 1,
                        selectTicketArr:selectTicketList
                    })
                } else {
                    that.fire("selected", {
                        index: 0,
                        selectTicketArr:selectTicketList
                    })
                }
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(node, "tap", "[data-ticket]", evtFuncs.selectTicket);
        }

        //-----------------自定义函数-------------
        var custFuncs = {

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