/**
 * 我的 跳转
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var storageMessager = require("lib/evt/storageMessager");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            updateMsgNumber: function () {
                var msgNumber = parseInt(nodeList.msgNumber.innerHTML)-1;
                if(msgNumber > 0) {
                    nodeList.msgNumber.innerHTML =msgNumber;
                } else {
                    nodeList.msgNumber.parentElement.removeChild(nodeList.msgNumber);
                }

            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            storageMessager.bind("readMsg",evtFuncs.updateMsgNumber);
        }

        //-----------------自定义函数-------------
        var custFuncs = {

        }

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