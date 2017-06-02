/**
 * 倒计时的button
 * <a href="javascript:void(0);" onclick="return false;">重发短信</a>
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var addEvent = require("lib/evt/add");
    var merge = require("lib/json/merge");

    return function(node, opts) {
        var that = compBase();

        opts = merge({
            format: "重新发送({count})",
            // className: "m_button_disabled",
            times: 30
        }, opts || {})

        //------------声明各种变量----------------
        var nodeList = null;
        var defaultText = null;
        var ready = true;

        //---------------事件定义----------------
        var evtFuncs = {}

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {}

        //-----------------自定义函数-------------
        var custFuncs = {
            start: function(callback) {
                var time = opts.times;
                ready = false;
                // className.add(node, opts.className);
                node.innerHTML = opts.format.replace(/\{count\}/ig, time);

                var tid = setInterval(function() {
                    time--;

                    if (time == 0) {
                        // className.remove(node, opts.className);
                        node.innerHTML = defaultText;
                        clearInterval(tid);
                        tid = 0;
                        ready = true;
                        that.fire("ready");

                        if (callback) {
                            callback();
                        }
                    } else {
                        node.innerHTML = opts.format.replace(/\{count\}/ig, time);
                    }
                }, 1000);
            },
            isReady: function() {
                return ready;
            }
        }

        //-----------------初始化----------------
        var init = function() {
            nodeList = parseNode(node);
            defaultText = node.innerHTML;

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.start = custFuncs.start;
        that.isReady = custFuncs.isReady;

        return that;
    }
});