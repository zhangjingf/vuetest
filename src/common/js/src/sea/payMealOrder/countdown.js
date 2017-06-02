/**
 * 倒计时
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var util = require("sea/utils");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        //---------------事件定义----------------
        var evtFuncs = {
        }

        //---------------子模块定义---------------
        var modInit = function() {

        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            initView: function () {
                util.countDown(nodeList.time, opts["pageInt"]["orderTime"], "1800");
            },
            timeChange: function () {
                return nodeList.time.innerHTML;
            } 
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
            custFuncs.initView();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.timeChange = custFuncs.timeChange;
        return that;
    }
});
