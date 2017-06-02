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
    var TMPL = '<div class="title"><div class="icon-orderDetails-remind2"></div><div node-name="title">改签须知</div></div>\
        <div class="body" >\
        <div class="list"><div>1.</div><div node-name="content"></div></div>\
        <div class="list"><div>2.</div><div>改签后的订单不支持再次改签与退票；</div></div>\
        <div class="list"><div>3.</div><div>如订单中包含卖品，将自动改签到新订单；</div></div>\
        <div class="list"><div>4.</div><div>改签范围:可改签到同一影院不同影片或场次；</div></div>\
        </div>\
        <div class="footer"><div node-name="cancel">取消</div><div node-name="ok">确认改签</div></div>';
   /* <div class="list"><div>1.</div><div>影城会员卡每月可改签N次，虚拟会员</div></div>
*/
    return function(content, opts) {
        var that = modal();

        content = content || "提示内容";
        opts = merge({
            "title": "改签须知",
            "OKText": "确认改签",
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
            nodeList.cancel.innerHTML = opts["cancelText"];

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});