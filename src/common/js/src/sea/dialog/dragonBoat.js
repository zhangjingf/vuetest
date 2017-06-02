/**
 * 提示弹层
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var modal = require("lib/layer/modal");
    var merge = require("lib/json/merge");
    var loader = require("lib/io/imageLoader");
    var touch = require("touch");
    //---------- require end -------------
    var TMPL = ' <div class="bg">\
                <div class="bg-plates1">\
                <div class="bg-plates"></div>\
                </div>\
                </div>\
                <img class="gif" node-name="gif">\
                <div class="close" node-name="ok"></div>';

    return function(content, opts) {
        var that = modal();

        content = content || "提示内容";
        opts = merge({
            "title": "温馨提示",
            "OKText": "我知道了",
            "OK": function() {}
        }, opts || {});

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var node = null;
        var superMethod = {
            init: that.init
        };

        //---------------事件定义----------------
        var evtFuncs = {
            "ok": function(ev) {
                opts["OK"]();
                nodeList.gif.removeAttribute("src");
                that.hide("ok");
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
            loader("./images/dragonGif.gif", function(image) {
                if (image == null) {
                    console.log("加载失败")
                } else {
                    console.log("已经加载成功");
                    nodeList.gif.setAttribute("src","./images/dragonGif.gif");
                }
            });
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.ok, "tap", evtFuncs.ok);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            initGif: function () {
                nodeList.gif.setAttribute("src",'./images/dragonGif.gif');
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-mode-dragonBoat";
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.initGif = custFuncs.initGif;
        return that;
    }
});