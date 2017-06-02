/**
 * 子页面顶部功能，仅有一个返回连接
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var storageMessager = require("lib/evt/storageMessager");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    var showMessage = require("sea/showMessage");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var isPaying = false;

        //---------------事件定义----------------
        var evtFuncs = {
            back: function() {
                if (isPaying) {
                    showMessage('正在支付中，请稍后');
                    return;
                }
                //storageMessager.send("cancelStyle");/*通知“支付页面”改变样式*/
                //storageMessager.send("cancelFavorable",false);/*取消会员优惠  并改变样式*/
                storageMessager.send("changeUserData",{'changeData':'false','cancelFavorable':false});
                webBridge.close();
            },
            reload: function () {
                webBridge.reload();
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.back, "tap", evtFuncs.back);
            if(nodeList.reload) {
                touch.on(nodeList.reload, "tap", evtFuncs.reload);
            }
            webBridge.onBackPressed = function () {
                evtFuncs.back();
                var isIPhone = navigator.appVersion.match(/iphone/gi);
                if (isIPhone) {
                    return "turnBackSucceed";
                }
            }
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            paying: function() {
                isPaying = true;
            },

            payed: function() {
                isPaying = false;
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.paying = custFuncs.paying;
        that.payed = custFuncs.payed;

        return that;
    }
});