/**
 * 搜索输入框
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var className = require("lib/dom/className");
    var isEmpty = require("lib/str/isEmpty");
    var trim = require("lib/str/trim");
    var touch = require("touch");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            focus: function(ev) {
                className.remove(nodeList.keyword, "empty");
            },
            blur: function(ev) {
                var val = trim(nodeList.keyword.value);
                if (isEmpty(val)) {
                    className.add(nodeList.keyword, "empty");
                }
            },
            input: function(ev) {
                var val = trim(nodeList.keyword.value);

                that.fire("input", {
                    "value": val
                });
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.keyword, "focus", evtFuncs.focus);
            touch.on(nodeList.keyword, "blur", evtFuncs.blur);
            touch.on(nodeList.keyword, "input", evtFuncs.input);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            getKeyword: function() {
                return trim(nodeList.keyword.value);
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;

            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.getKeyword = custFuncs.getKeyword;

        return that;
    }
});