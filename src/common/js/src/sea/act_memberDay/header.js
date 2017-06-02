/**
 * 子页面顶部功能，仅有一个返回连接
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var webBridge = require("sea/webBridge");
    var showMessage = require("sea/showMessage");
    var queryToJson = require("lib/json/queryToJson");
    var URL = require("lib/util/URL");
    var touch = require("touch");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var url = null;

        //---------------事件定义----------------
        var evtFuncs = {
            back: function() {
                if(url["fromType"] =="memberday") {
                    webBridge.close(2);
                }else {
                    webBridge.close();
                }

            },
            share: function () {
                webBridge.share(
                    {"type":"friends",
                    "title":"“幸福看”会员福利日震撼来袭，15元影票每月抢！快来参加吧",
                    "content":"“幸福看”会员福利日震撼来袭，15元影票每月抢！快来参加吧",
                    "url":window.location.href,
                    "iconUrl":window.location.host+"/images/header_bg.png"
                    }
                );
            },
            buy: function (ev) {
                var type = ev.target.getAttribute("data-type");
                if(nodeList.buyBt.getAttribute("data-href")) {
                    webBridge.openUrl(nodeList.buyBt.getAttribute("data-href"));
                }
            },
            goVirtualmemberfill:function(ev) {
                if(nodeList.goVirtualmemberfill.getAttribute("data-href")) {
                    webBridge.openUrl(nodeList.goVirtualmemberfill.getAttribute("data-href"));
                }
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.back, "tap", evtFuncs.back);
            touch.on(nodeList.share,"tap", evtFuncs.share);
            touch.on(nodeList.buyBt,"tap", evtFuncs.buy);
            touch.on(nodeList.goVirtualmemberfill,"tap", evtFuncs.goVirtualmemberfill);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;
            url = queryToJson(URL.parse(location.href)["query"]);

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});