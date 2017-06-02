/**
 * 修改头像方法
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var modal = require("sea/dialog/modals");
    var merge = require("lib/json/merge");
    var modifyFace = require("sea/dialog/modifyFace");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    //---------- require end -------------
    var TMPL = '<div class="layout" node-name="active">\
                    <div data-type="0">拍照</div>\
                    <div data-type="1">从相册中选择</div>\
                    <div data-type="2">选择系统头像</div>\
                </div>\
                <div class="cancel" node-name="cancel">取消</div>';
            
    return function(opts) {
        var that = modal();

        opts = merge({
            "cancel": function() {}
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
            "cancel": function(ev) {
                opts["cancel"]();
                that.hide("cancel");
            },
            "imageSrc": function(ev) {
                that.fire("modifyFaceWay", {"imageSrc": ev.data.imageSrc});
            },
            active: function (ev) {
                var activeNode = ev.target;
                if(activeNode.nodeType == 1) {
                    var index = activeNode.getAttribute("data-type");
                    that.hide();
                    if(index == "2") {
                        var dialog = modifyFace(opts);
                        dialog.init();
                        dialog.bind("modifyFace", evtFuncs.imageSrc);
                        dialog.show();
                    } else {
                        webBridge.replaceHead({"index":index});
                    }
                }
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.cancel, "tap", evtFuncs.cancel);
            touch.on(nodeList.active, "tap","[data-type]", evtFuncs.active);
        }

        //-----------------自定义函数-------------
        var custFuncs = {

        }

        //-----------------初始化----------------
        var init = function(_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-mode-way";
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