/**
 * 侧边字母选择
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var parseNode = require("lib/dom/parseNode");
    var addEvent = require("lib/evt/add");
    var trim = require("lib/str/trim");
    var encodePattern = require("lib/str/encodePattern");
    var sizzle = require("lib/dom/sizzle");
    var pinyin = require("lib/util/pinyin");
    var touch = require("touch");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            charFilter: function (ev) {
                if (opts["scrollBox"].clientHeight == opts["scrollBox"].scrollHeight) {
                    return;
                }

                var target = ev.target;
                var ch = target.dataset["key"];
                var dt = queryNode("[data-key=" + ch + "]", nodeList.cities);
                opts["scrollBox"].scrollTop = dt.offsetTop;
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            //console.log(nodeList.filters);
            //touch.on(nodeList.filters, "tap", "a", evtFuncs.charFilter);
            touch.on(nodeList.filters, "tap", evtFuncs.charFilter);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            controlSide: function (param) {
                if (param == 0) {
                    nodeList.filters.style.display = "none";
                } else if ( param == 1 ) {
                    nodeList.filters.style.display = "block";
                }
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
        that.controlSide = custFuncs.controlSide;

        return that;
    }
});