/**
 * 影片简介
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var encodeHTML = require("lib/str/encodeHTML");
    var appendQuery = require("lib/str/appendQuery");
    var touch = require("touch");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            /*jump : function () {
                if (data["score"] == "" || data["score"] == undefined) {
                    data["score"] = 0.00;
                }
                //webBridge.openUrl("filmInfo.html?filmNo="+filmNo+"&shown=true&averageDegree="+data["score"]);
                webBridge.openUrl(appendQuery("filmInfo.html", {
                    "filmNo": data["filmNo"],
                    "shown": true,
                    "averageDegree": data["score"]
                }), "blank");
            }*/
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            //touch.on(node, "tap", evtFuncs.jump);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            updateView: function(newData) {
                data = newData;
                var match = newData["score"].match(/^(\d+\.)(\d+)$/);
                var html = "0.<span>0分</span>"; //8.<span>2分</span>

                if (match != null) {
                    html = match[1] + "<span>" + match[2] + "分</span>";
                }

                node.setAttribute("data-url", data["url"]+"&status=1");
                nodeList.name.innerHTML = encodeHTML(newData["name"]);
                nodeList.score.innerHTML = html;
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
            //custFuncs.updateView(data);
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.updateView = custFuncs.updateView;

        return that;
    }
});