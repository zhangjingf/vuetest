/**
 * 影院信息
 */
define(function(require, exports, module) {
    //----0------ require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var encodeHTML = require("lib/str/encodeHTML");
    var appendQuery = require("lib/str/appendQuery");
    var touch = require("touch");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------

    //-----1--------全局变量 --------------
    return function(node, opts) {

        //------2-------模块扩展--------------
        var that = compBase();
        //------3------声明各种变量----------------
        var nodeList = null;
        var data = null;


        //------4---------事件定义----------------
        var evtFuncs = {
            /*jump: function() {
                //window.location.href = 'cinemaDetail.html?areaNo='+opts["areaNo"]+'&cinemaNo='+opts["cinemaNo"]+'&filmNo='+opts["filmNo"];
                webBridge.openUrl(appendQuery("cinemaDetail.html", {
                    "areaNo": opts["areaNo"],
                    "cinemaNo": opts["cinemaNo"]
                }), "blank");
            }*/
        }

        //-------5--------子模块定义---------------
        var modInit = function() {}

        //-------6----------绑定事件---------------
        var bindEvents = function() {
            //touch.on(node, "tap", evtFuncs.jump);
        }

        //--------7---------自定义函数-------------
        var custFuncs = {}

        //--------8---------初始化----------------
        var init = function(_data) {
            data = _data;
            nodeList = parseNode(node);
            modInit();
            bindEvents();
            //nodeList.name.innerHTML = encodeHTML(data["name"]);
            //nodeList.address.innerHTML = encodeHTML(data["address"]);
        }

        //--------9---------暴露各种方法-----------
        that.init = init;

        return that;
    }
});