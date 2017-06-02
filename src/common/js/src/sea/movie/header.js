/**
 * 影院详情头部
 */
define(function(require, exports, module) {
    //----0------ require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var encodeHTML = require("lib/str/encodeHTML");
    var touch = require("touch");
    var webBridge = require("sea/webBridge");
    var queryToJson = require("lib/json/queryToJson");
    var URL = require("lib/util/URL");
    //var showMessage = require("sea/showMessage");
    //---------- require end -------------

    //-----1--------全局变量 --------------
    return function(node, opts) {

        //------2-------模块扩展--------------
        var that = compBase();
        //------3------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var url = null;


        //------4---------事件定义----------------
        var evtFuncs = {
            back: function () {
                if(url["from"] == "payOrder") {
                    webBridge.close(1);
                }else  {
                    webBridge.close();
                }
            }

        }

        //-------5--------子模块定义---------------
        var modInit = function() {
        }

        //-------6----------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.back, "tap", evtFuncs.back);

            webBridge.onBackPressed = function () {
                evtFuncs.back();
                var isIPhone = navigator.appVersion.match(/iphone/gi);
                if (isIPhone) {
                    return "turnBackSucceed";
                }
            }
        }

        //--------7---------自定义函数-------------
        var custFuncs = {}

        //--------8---------初始化----------------
        var init = function(_data) {
            url = queryToJson(URL.parse(location.href)["query"]);
            data = _data;
            nodeList = parseNode(node);
            modInit();
            bindEvents();
        }

        //--------9---------暴露各种方法-----------
        that.init = init;

        return that;
    }
});