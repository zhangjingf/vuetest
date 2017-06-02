/*
 * 实现滚动到容器底部时回调
 * 注意：回调时，组件将被阻止监听，可以在加载完后重新设置调用work函数启用监听
 */
define(function(require, exports, module) {
    var base = require("../comp/base"); // 基础对象
    var merge = require("../json/merge");
    var addEvent = require("../evt/add");
    var removeEvent = require("../evt/remove");
    var index = require("../dom/index");

    return function(node, opts) {
        //-----------声明模块全局变量-------------
        var nodeList = null; // 存储所有id符合m-xxx的节点
        var that = base();
        var data = null;
        var height = 0;
        var scrollNode = null;

        opts = merge({
            "lazyload": function() {},
            "height": "100px" // 支持rem
        }, opts || {});

        //-------------事件响应声明---------------
        var evtFuncs = {
            scroll: function() {
                var clientHeight = scrollNode == document.body ? document.documentElement.clientHeight : scrollNode.clientHeight;
                if ((scrollNode.scrollHeight - (scrollNode.scrollTop + clientHeight)) <= height) {
                        custFuncs.disable();
                        opts["lazyload"]();
                    }
                }
        }

        //-------------子模块实例化---------------
        var initMod = function() {}

        //-------------绑定事件------------------
        var bindEvents = function() {
            addEvent(node, "scroll", evtFuncs.scroll, false);
        }

        //-------------自定义函数----------------
        var custFuncs = {
            disable: function() {
                removeEvent(node, "scroll", evtFuncs.scroll, false);
            },
            work: function() {
                addEvent(node, "scroll", evtFuncs.scroll, false);
            },
            testHeight: function() {
                var div = document.createElement("div");
                var _s = div.style;

                _s.width = "10px";
                _s.height = opts["height"];
                _s.position = "absolute";
                _s.left = "-200px";
                _s.top = "-200px";
                _s.overflow = "hidden";
                _s.margin = 0;
                _s.borderWidth = 0;

                document.body.appendChild(div);
                height = div.offsetHeight;
                document.body.removeChild(div);
                div = null;
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
            // 子模块实例化
            custFuncs.testHeight();
            custFuncs.fix();

            initMod();
            // 绑定事件
            bindEvents();
        }

        //---------------暴露API----------------
        that.init = init;
        that.disable = custFuncs.disable;
        that.work = custFuncs.work;
        that.getBox = custFuncs.getBox;

        return that;
    };
});