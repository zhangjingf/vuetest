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
    var TMPL = '<div class="title"><div class="icon-orderDetails-remind2"></div><div node-name="title">退款须知</div></div>\
        <div class="body" >\
        <div class="list"><div>1.</div><div node-name="content"></div></div>\
        <div class="list"><div>2.</div><div>已打印卖品票纸、已取卖品不支持退款</div></div>\
        </div>\
        <div class="footer"><div node-name="ok">我知道了</div></div>';
   /* <div class="list"><div>1.</div><div>影城会员卡每月可改签N次，虚拟会员</div></div>
*/
    return function(content, opts) {
        var that = modal();

        content = content || "提示内容";
        opts = merge({
            "title": "退款须知",
            "OKText": "我知道了",
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
        }

        //-----------------自定义函数-------------
        var custFuncs = {
        }

        //-----------------初始化----------------
        var init = function(_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-mode-remind";
            nodeList = parseNode(node);
            data = _data;

            nodeList.title.innerHTML = opts["title"];
            nodeList.content.innerHTML = content;
            nodeList.ok.innerHTML = opts["OKText"];

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});