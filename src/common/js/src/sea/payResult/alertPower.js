/**
 * 提示弹层
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var modal = require("lib/layer/modal");
    var merge = require("lib/json/merge");
    var touch = require("touch");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------
    var TMPL = '<div class="layout-1">\
        <div class="header"><div class="close" node-name="ok"></div> </div>\
        <div class="body"><div class="wrapper"><div class="item-1" node-name="content"></span></div>\
        <div class="item-2"><div node-name="ok"></div> </div>\
        <div class="item-3">*如本次购票订单发生退票退款则不予发放，<br/>自动延至下一次累计满后发放</div> </div></div></div>';

    return function(content, opts) {
        var that = modal();

        content = content || "提示内容";
        opts = merge({
            "title": "温馨提示",
            "OKText": "我知道了",
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
            "ok": function(ev) {
                opts["OK"]();
                that.hide("ok");
            },
            link: function () {
                webBridge.openUrl(opts["linkUrl"]);
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.ok, "tap", evtFuncs.ok);
            touch.on(nodeList.content, "tap", evtFuncs.link);
        }

        //-----------------自定义函数-------------
        var custFuncs = {}

        //-----------------初始化----------------
        var init = function(_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-mode-alertPower";
            nodeList = parseNode(node);
            data = _data;
            nodeList.content.innerHTML = content;
        /*    nodeList.title.innerHTML = opts["title"];

            nodeList.ok.innerHTML = opts["OKText"];*/

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});