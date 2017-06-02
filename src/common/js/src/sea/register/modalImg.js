/**
 * 只有图片的模态弹层
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
    var TMPL = '<div class="close" node-name="close"><span class="icon-close"></span></div>\
                <div class="container">\
                    <div class="ok" node-name="ok"></div>\
                    <img src="./images/lucky_bag.png" alt="红包图片">\
                </div>';

    return function(opts) {
        var that = modal();

        opts = merge({
            "OK": function() {}
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
            close: function() {
                opts["CLOSE"]();
                that.hide('close');
            },

            ok: function(ev) {
                opts["OK"]();
                that.hide("ok");
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.ok, "tap", evtFuncs.ok);
            touch.on(nodeList.close, "tap", evtFuncs.close);
        }

        //-----------------自定义函数-------------
        var custFuncs = {}

        //-----------------初始化----------------
        var init = function(_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-register-success";
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.doBeforeClose = custFuncs.doBeforeClose;

        return that;
    }
});