/**
 * 我的光影美食 tabs
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var closest = require("lib/dom/closest");
    var className = require("lib/dom/className");
    var each = require("lib/util/each");
    //var webBridge = require("sea/webBridge");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            selectTab: function (ev) {
                var target = ev.target;
                var pNode = closest(target, "[node-name=tab]", node);/*开始元素,含有的属性,终点元素*/
                if (pNode == null) {
                    return;
                }
                var ppNode = pNode.parentNode;
                var ppNodeList = parseNode(ppNode);
                each(ppNodeList.tab, function (item, index) {
                    className.remove(item, "active");
                });
                className.add(pNode, "active");
                ppNodeList = parseNode(ppNode);
                each(ppNodeList.tab, function (item, index) {
                    if (className.has(item, "active")) {
                        nodeList.line.style.left = ((0.25*index)*100)+"%";
                    }
                });
                var dataIndex = pNode.getAttribute("data-index");
                that.fire("outIndex",dataIndex);
                /*webBridge.openUrl(appendQuery("movieShow.html", {
                    "cinemaNo": pNode.getAttribute('cinemano'),
                    "areaNo": opts["areaNo"],
                    "filmNo": opts["filmNo"]
                }), "blank");*/
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.tab, "tap", evtFuncs.selectTab);
        }

        //-----------------自定义函数-------------
        var custFuncs = {}

        //-----------------初始化----------------
        var init = function(_data) {
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