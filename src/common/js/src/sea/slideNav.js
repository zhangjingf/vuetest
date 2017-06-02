/**
 * 滑动切换导航条
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var className = require("lib/dom/className");
    var each = require("lib/util/each");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var showMessage = require("sea/showMessage");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            switch: function(ev) {
                if (className.has(ev.target, "active")) {
                    return;
                }

                var index = ev.target.getAttribute("data-index");
                var widthPercentage = parseInt(1 * 10000 / opts.count) / 100;

                nodeList.line.style.left = index * widthPercentage + "%";

                each(nodeList.tab, function(tab, key, source) {
                    className.remove(tab, 'active');
                })
                className.add(ev.target, 'active');

                that.fire("switchTab", index);
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.tabs, "tap", ".tab", evtFuncs.switch);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            slideShift: function(index) {
                each(nodeList.tab, function(items, i) {
                    if (i != index - 1) {
                        className.remove(items, 'active');
                    } else {
                        className.add(items, 'active');
                        var widthPercentage = parseInt(1 * 10000 / opts.count) / 100;
                        nodeList.line.style.left = (index - 1) * widthPercentage + "%";
                    }
                });
                that.fire("switchTab", index - 1);
            }
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
        that.slideShift = custFuncs.slideShift;

        return that;
    }
});