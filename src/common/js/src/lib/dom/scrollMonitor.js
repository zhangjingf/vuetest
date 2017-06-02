/**
 * 检测节点内部某些节点是否在显示区域
 * node的position必须为absolute|relative|fixed
 *
 * var node = document.getElementById("pbdMovieList");
 * var m_monitor = scrollMonitor(node, {
 *     "selector": "[data-lazyload]",
 *     "change": function(list) {
 *         for (var i = 0; i < list.length; i++) {
 *             list[i].src = list[i].dataset["lazyload"];
 *             delete list[i].dataset["lazyload"];
 *         }
 *     }
 * });
 *
 * m_monitor.init();
 * // 停止监听
 * m_monitor.disable();
 * // 重新监听
 * m_monitor.work();
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("../io/console");
    var compBase = require("../comp/base");
    var addEvent = require("../evt/add");
    var removeEvent = require("../evt/remove");
    var merge = require("../json/merge");
    var sizzle = require("./sizzle");
    var each = require("../util/each");
    var contains = require("./contains");
    var getStyle = require("./getStyle");
    var index = require("./index");
    //---------- require end -------------
    return function(node, opts) {
        //-----------声明模块全局变量-------------
        var nodeList = null; // 存储所有id符合m-xxx的节点
        var that = compBase();
        var data = null;
        var tid = 0;
        var scrollNode = null;

        opts = merge({
            "selector": "[data-src]",
            "interval": 100
        }, opts || {});

        //-------------事件响应声明---------------
        var evtFuncs = {
            scroll: function(ev) {
                if (tid) {
                    clearTimeout(tid);
                    tid = 0;
                }

                tid = setTimeout(function() {
                    tid = 0;
                    opts["change"].call(that, custFuncs.checkList());
                }, opts["interval"]);
            }
        }

        //-------------子模块实例化---------------
        var initMod = function() {}

        //-------------绑定事件------------------
        var bindEvents = function() {
            addEvent(scrollNode, "scroll", evtFuncs.scroll);
        }

        //-------------自定义函数----------------
        var custFuncs = {
            checkList: function() {
                var scrollTop = scrollNode.scrollTop;
                var scrollLeft = scrollNode.scrollLeft;
                var clientWidth = scrollNode.clientWidth;
                var clientHeight = scrollNode.clientHeight;
                var items = Array.prototype.slice.call(sizzle(opts["selector"], scrollNode), 0);
                var list = [];

                each(items, function(item) {
                    var itemLeft = 0;
                    var itemTop = 0;
                    var pItem = item;

                    while(contains(scrollNode, pItem)) {
                        itemLeft += pItem.offsetLeft;
                        itemTop += pItem.offsetTop;
                        pItem = pItem.offsetParent;
                    }

                    if (
                        ((itemLeft >= scrollLeft && (itemLeft <= (scrollLeft + clientWidth)))
                            || ((itemLeft + item.offsetWidth) >= scrollLeft) && ((itemLeft + item.offsetWidth) <= (scrollLeft + clientWidth))
                            || (itemLeft < scrollLeft && (itemLeft + item.offsetWidth) > (scrollLeft + clientWidth)))
                        && ((itemTop >= scrollTop && (itemTop <= (scrollTop + clientHeight)))
                            || ((itemTop + item.offsetHeight) >= scrollTop) && ((itemTop + item.offsetHeight) <= (scrollTop + clientHeight))
                            || (itemTop < scrollTop && (itemTop + item.offsetHeight) > (scrollTop + clientHeight)))
                    ) {
                        list.push(item);
                    }
                });

                return list;
            },
            disable: function() {
                removeEvent(scrollNode, "scroll", evtFuncs.scroll, false);
            },
            work: function() {
                removeEvent(scrollNode, "scroll", evtFuncs.scroll, false);
            },
            getBox: function() {
                return node;
            },
            fix: function() {
                if (index(node, [window, document, document.body, document.documentElement]) != -1) {
                    scrollNode = document.body;
                    node = window;
                } else {
                    scrollNode = node;
                }
            }
        }

        //-------------一切从这开始--------------
        var init = function(_data) {
            data = _data;
            custFuncs.fix();
            // 子模块实例化
            initMod();
            // 绑定事件
            bindEvents();

            var position = getStyle(scrollNode, "position");

            if (position != "absolute" && position != "relative" && position != "fixed") {
                console.error("scrollMonitor: node的position必须为absolute|relative|fixed");
            }

            // 在iOS上碰上如果内容区域是动态生成的，直接执行将会获取所有节点的问题，因此延迟一下下
            setTimeout(function() {
                opts["change"].call(that, custFuncs.checkList());
            }, 100);
        }

        //---------------暴露API----------------
        that.init = init;
        that.disable = custFuncs.disable;
        that.work = custFuncs.work;
        that.getBox = custFuncs.getBox;

        return that;
    };
});