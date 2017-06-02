/**
 *
 *  首页热映电影
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var webBridge = require("sea/webBridge");
    var closest = require("lib/dom/closest");
    var storageMessager = require("lib/evt/storageMessager");
    var sizzle = require("lib/dom/sizzle");
    var each = require("lib/util/each");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            more: function (ev) {
                var target = ev.target;
                var pNode = closest(target, "[data-num]", node);
                if (pNode == null) {
                    return;
                }
                localStorage.setItem("indexToBuyTicketPage", pNode.getAttribute("data-num"));//第二次点击时 赋值
                storageMessager.send("changeType", pNode.getAttribute("data-num"));
                webBridge.popToSelectedController("buyTicket");
            }
        };

        //---------------子模块定义---------------
        var modInit = function () {
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.more, "tap", evtFuncs.more);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            changeImgSrc: function () {
                var imgArr = sizzle("img",node);
                each(imgArr, function (item) {
                    if(item.getAttribute("data-src")){
                        if(item.getAttribute("data-src").match(/[^\s]+\.(jpg|gif|png|bmp)/i)) {
                            item.setAttribute("src",item.getAttribute("data-src"));
                            item.setAttribute("data-src","");
                        }
                    }
                })
            }
        }


        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
            custFuncs.changeImgSrc();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});