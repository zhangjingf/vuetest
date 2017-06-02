/**
 * 确认弹层
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var modal = require("lib/layer/modal");
    var merge = require("lib/json/merge");
    var touch = require("touch");
    //---------- require end -------------
    var TMPL = '<div class="title" node-name="title"></div>\
        <div class="body" node-name="content"></div>\
        <div class="footer"><div class="borderright" node-name="ok"></div><div node-name="cancel"></div></div>';

    return function(content, opts) {
        var that = modal();

        content = content || "提示内容";
        opts = merge({
            "title": "温馨提示",
            "OKText": "确定",
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
            "ok": function(ev) {
                opts["OK"]();
                that.hide("ok");
            },
            "cancel": function(ev) {
                opts["cancel"]();
                that.hide("cancel");
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.ok, "tap", evtFuncs.ok);
            touch.on(nodeList.cancel, "tap", evtFuncs.cancel);
        }

        //-----------------自定义函数-------------
        var custFuncs = {}

        //-----------------初始化----------------
        var init = function(_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-mode-one";
            nodeList = parseNode(node);
            data = _data;

            nodeList.title.innerHTML = opts["title"];
            nodeList.content.innerHTML = content;
            nodeList.ok.innerHTML = opts["OKText"];
            nodeList.cancel.innerHTML = opts["cancelText"];

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});