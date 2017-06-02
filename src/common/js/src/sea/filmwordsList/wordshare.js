/**
 * 确认弹层
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var modal = require("sea/dialog/modals");
    var merge = require("lib/json/merge");
    var touch = require("touch");
    //---------- require end -------------
    var TMPL = '<div node-name="share">分享</div><div node-name="cancel">取消</div>';

    return function(opts) {
        var that = modal();
        opts = merge({
            "cancelText": "取消",
            "OK": function() {},
            "cancel": function() {}
        }, opts || {});

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var node = null;
        var superMethod = {
            init: that.init
        };

        //---------------事件定义----------------
        var evtFuncs = {
            "cancel": function(ev) {
                opts["cancel"]();
                that.hide("cancel");
            },
            "share": function(ev) {
                opts["OK"]();
                that.hide("ok");
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {

        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.cancel, "tap", evtFuncs.cancel);
            touch.on(nodeList.share, "tap", evtFuncs.share);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
        }

        //-----------------初始化----------------
        var init = function(_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-word-share";
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