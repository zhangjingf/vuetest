/**
 * 电子券支付 头部 模块控制器
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var header = require("sea/header");
    var className = require("lib/dom/className");

    var storageMessager = require("lib/evt/storageMessager");
    var webBridge = require("sea/webBridge");
    //var showMessage = require("sea/showMessage");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_header = null;
        var arrRus = null;
        //var mobile = null;
        //var orderNo = null;

        //---------------事件定义----------------
        var evtFuncs = {
            ensureSelect: function () {
                if (className.has(nodeList.ensure, "ensure-color")) {
                    storageMessager.send("ensureTicket",{
                        "arrRus": arrRus
                    });
                    webBridge.close();
                }
            }

        }

        //---------------子模块定义---------------
        var modInit = function() {
            m_header = header(nodeList.backBtn);
            m_header.init();
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.ensure, 'tap', evtFuncs.ensureSelect);

            /*webBridge.ensureSelect = function () {
                evtFuncs.ensureSelect();
            }*///想的太简单了
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            changeEnsure : function (result) {
                /*暴露到页面*/
                if (result.length == 2) {
                    className.remove(nodeList.ensure, "ensure-color");
                    className.add(nodeList.ensure, "unbind");
                } else {
                    className.remove(nodeList.ensure, "unbind");
                    className.add(nodeList.ensure, "ensure-color");
                }
                arrRus = result;
            }
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
        that.changeEnsure = custFuncs.changeEnsure;

        return that;
    }
});