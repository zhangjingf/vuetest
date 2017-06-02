/**
 * 我的观影美食，头部
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    var queryToJson = require("lib/json/queryToJson");
    var URL = require("lib/util/URL");
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
                if(url["form"] == "payResult") {
                    webBridge.popToSelectedController("mine");
                } else {
                    webBridge.close();
                }
                var isIPhone = navigator.appVersion.match(/iphone/gi);
                if (isIPhone) {
                    return "turnBackSucceed";
                }
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            if(node) {
                touch.on(nodeList.back, "tap", evtFuncs.back);
            }
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            onBackPressed:function() {
                evtFuncs.back();
            }
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
        that.onBackPressed = custFuncs.onBackPressed;
        return that;
    }
});