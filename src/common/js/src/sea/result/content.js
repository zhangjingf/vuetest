define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var webBridge = require("sea/webBridge");
    var virtualLink = require("lib/util/virtualLink");
    var storageMessager = require("lib/evt/storageMessager");
    var touch = require("touch");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;

        //---------------事件定义----------------
        var evtFuncs = {
            "check": function(ev) {
                var urldata = {
                    "url": ev.target.dataset.url.split("?")[1].split("&")[0].split("%2F").join("/"),
                    "href": ev.target.dataset.url
                }
                storageMessager.send("payResult", urldata);
                webBridge.close();
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {

        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            if(nodeList.reBuy) {
                touch.on(nodeList.reBuy, 'tap', evtFuncs.check);
            }
            if(nodeList.check) {
                touch.on(nodeList.check, 'tap', evtFuncs.check);
            }
        }

        //-----------------自定义函数-------------
        var custFuncs = {

        }

        //-----------------初始化----------------
        var init = function (_data) {
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