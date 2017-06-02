/**
 *
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    var storageMessager = require("lib/evt/storageMessager");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            toMywallet: function () {
                webBridge.openUrl(nodeList.mywallet.getAttribute("data-url")+'&from=openSeaCard');
            },
            toPayOrder: function () {
                if('from' in opts["url"] && opts["url"]["from"] == 'order') {
                    webBridge.openUrl(localStorage.getItem("outstandingOrderUrl"));
                } else if('from' in opts["url"] && opts["url"]["from"] == 'meal') {
                    webBridge.openUrl(localStorage.getItem("outstandingMealUrl")+'from=openSeaCard');
                } else {
                    webBridge.popToSelectedController("buyTicket");
                }
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {

        }

        //-----------------绑定事件---------------
        var bindEvents = function () {

            touch.on(nodeList.mywallet,"tap",evtFuncs.toMywallet);
            if(nodeList.payOrder) {
                touch.on(nodeList.payOrder,"tap",evtFuncs.toPayOrder);
            }
            webBridge.onBackPressed = function () {
                var isIPhone = navigator.appVersion.match(/iphone/gi);
                if (isIPhone) {
                    return "turnBackSucceed";
                }
            }

        }

        //-----------------自定义函数-------------
        var custFuncs = {}

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.switch = custFuncs.switchSlide;

        return that;
    }
});