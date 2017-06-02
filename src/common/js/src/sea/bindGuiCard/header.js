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
   /* var URL = require("lib/util/URL");
    var queryToJson = require("lib/json/queryToJson");*/
    var touch = require("touch");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var flag = false;

        //---------------事件定义----------------
        var evtFuncs = {
            back: function() {
                //console.log(opts);
                if (opts["fromType"] == undefined || opts["fromType"] == "") {
                    if (flag) {
                        //storageMessager.send("bindCard");
                        storageMessager.send("changeUserData",{'changeData':'true'});
                    } else {
                        //storageMessager.send("cancelStyle");/*通知“支付页面”改变样式*/
                        storageMessager.send("changeUserData",{'changeData':'false','changeStyle':'true'});
                    }
                }
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
            bindLuxuryCard: function () {
                flag = true;
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            //url = queryToJson(URL.parse(location.href)["query"]);
            //url = queryToJson(URL.parse(location.href)["query"]);
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.bindLuxuryCard = custFuncs.bindLuxuryCard;

        return that;
    }
});