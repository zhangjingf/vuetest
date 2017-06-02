/**
 * 新人礼包提示框
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
                     <div class="sign-tip-box"><span class="span icon-new-gift"></span></div>\
                     <div class="sprite icon-new-biggift"></div>\
                     <p class="content-tip">\
                        新人大礼包已发送至“我的钱包”中！\
                     </p>\
                     <div class="sign-box">\
                        <div class="sprite icon-sign-btn1" node-name="btn">去看看</div>\
                     </div>\
                </div>';

    return function(content, opts) {
        var that = modal();
        opts = merge({
            "url": null
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
            "closeDialog" : function (ev) {
                document.querySelector('body').style.cssText = "overflow: scroll;";
                that.hide();
            },
            "openBox": function (ev) {
                document.querySelector('body').style.cssText = "overflow: scroll;";
                that.hide();
                webBridge.openUrl(opts["url"]);
            }

        }

        //---------------子模块定义---------------
        var modInit = function() {
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.closeBtn, "tap", evtFuncs.closeDialog);
            touch.on(nodeList.btn, "tap", evtFuncs.openBox);
        }

        //-----------------自定义函数-------------
        var custFuncs = {

        }

        //-----------------初始化----------------
        var init = function(_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-mode-newgift";
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