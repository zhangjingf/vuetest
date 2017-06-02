/**
 * 有输入的对话框
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
        <div class="body-input" node-name="content"><input type="password" placeholder="请输入尊享卡密码" class="pwd-input" node-name="pwd"></div>\
        <div class="footer"><div class="borderright" node-name="ok"></div><div node-name="cancel"></div></div>';

    return function(opts) {
        var that = modal();

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
                //that.hide("ok");
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
        var custFuncs = {
            getInputMsg: function () {
                var getMsg = nodeList.pwd.value;
                return getMsg;
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-mode-one";
            nodeList = parseNode(node);
            data = _data;

            nodeList.title.innerHTML = opts["title"];
            nodeList.ok.innerHTML = opts["OKText"];
            nodeList.cancel.innerHTML = opts["cancelText"];

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.getInputMsg = custFuncs.getInputMsg;

        return that;
    }
});