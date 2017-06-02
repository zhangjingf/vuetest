/**
 * 首页签到提示框
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
    var TMPL = '<div class="sign-dialog" id="dialog">\
                     <span class="sprite icon-sign-close" node-name="closeBtn"></span>\
                     <div class="sign-tip-box"><span class="span icon-sign-tip"></span></div>\
                     <p class="content-tip">\
                        <span class="sign-text">【签到有礼】</span>\
                        每天签到可获得2积分，连续签到还有额外积分、15元优惠券幸福相送！\
                     </p>\
                     <div class="sprite icon-sign-pic"></div>\
                     <div class="sign-box">\
                        <div node-name="cancel">不再提醒</div><div node-name="ok">今日签到</div>\
                     </div>\
                </div>';

    return function(content, opts) {
        var that = modal();
        opts = merge({
            "time": null,
            "url":null
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
            "closeDialog" : function () {
                window.localStorage.setItem("sign", opts["time"] + 86400);//1天后
                document.querySelector('body').style.cssText = "overflow: scroll;";
                that.hide();
            },
            "ok": function () {
                window.localStorage.setItem("sign", opts["time"] + 86400);//1天后
                document.querySelector('body').style.cssText = "overflow: scroll;";
                that.hide();
                webBridge.openUrl(opts["url"]);
            },
            cancel: function () {
                document.querySelector('body').style.cssText = "overflow: scroll;";
                window.localStorage.setItem("sign", opts["time"] + 8640000);//100天后
                that.hide();
            }

        }

        //---------------子模块定义---------------
        var modInit = function() {
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.closeBtn, "tap", evtFuncs.closeDialog);
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
            node.className = "m-mode-sign";
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