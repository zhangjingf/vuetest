/**
 * 台词选择
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var wordshare = require("sea/filmwordsList/wordshare");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    var jsonToQuery = require("lib/json/jsonToQuery");

    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var activeNode = null;

        //---------------事件定义----------------
        var evtFuncs = {
            "share": function (ev) {
                var m_dialog = wordshare({
                    "cancel": function () {
                        ev.target.parentNode.classList.remove("active");
                    },
                    "OK": function () {
                        ev.target.parentNode.classList.remove("active");
                        webBridge.openUrl(opts["shareWord"] + "&" + jsonToQuery({
                                "filmNo": opts.url.filmNo,
                                "lineId": ev.target.getAttribute("data-lineid")
                            }));
                    }
                });
                m_dialog.init();
                m_dialog.show({
                    "afterAnimate": function () {
                        ev.target.parentNode.classList.add("active");
                    }
                });
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(node, "hold", ">div", evtFuncs.share);
        };

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

        return that;
    }
});