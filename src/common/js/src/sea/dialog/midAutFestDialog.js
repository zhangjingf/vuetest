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
    //var timer = require("sea/utils/timer");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------
    var TMPL = '<div class="tip-dialog" id="dialog">\
                     <span class="sprite icon-close close" node-name="close"></span>\
                     <div class="sprite icon-monkey">\
                        <div class="open-box" node-name="openBox">马上拆宝盒</div>\
                     </div>\
                     <!--<div class="count-down-time">距离结束还有<span node-name="minute">9</span>分<span node-name="second">15</span>秒</div>-->\
                </div>';

    return function(content, opts) {
        var that = modal();

        /*content = content || "提示内容";
        opts = merge({
            "title": "温馨提示",
            "OKText": "我知道了",
            "OK": function() {},
            "cancel": function() {}
        }, opts || {});*/

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var node = null;
        //var m_timer = null;
        var superMethod = {
            init: that.init
        };

        //---------------事件定义----------------
        var evtFuncs = {
            "closeDialog" : function (ev) {
                document.querySelector('body').style.cssText = "overflow: scroll;";
                that.hide();
            },
            "openBox": function () {
                document.querySelector('body').style.cssText = "overflow: scroll;";
                that.hide();
                webBridge.openUrl(data["zqFestivalApi"], "blank");
            }

        }

        //---------------子模块定义---------------
        var modInit = function() {
            //m_timer = timer();
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.close, "tap", evtFuncs.closeDialog);
            touch.on(nodeList.openBox, "tap", evtFuncs.openBox);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            /*"initView": function (time) {
                //custFuncs.startTimer(time);
            },
            "change" : function(hour, minute, second, total){
                nodeList.minute.innerHTML = minute;
                nodeList.second.innerHTML = second;
            },
            "end" : function(){

            },
            "startTimer" : function(time){
                m_timer.init({
                    isMinute: false,
                    time: time,//分钟
                    change: custFuncs.change,
                    end: custFuncs.end
                });
            }*/
        }

        //-----------------初始化----------------
        var init = function(_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-mode-qx";
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
            //custFuncs.initView(data);
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});