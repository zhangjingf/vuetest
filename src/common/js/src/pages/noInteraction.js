/**
 * 本页为公共页面，提供给那些除了顶部返回之外没有任何交互的页面
 * 如果调用了本文件的页面有新的功能，请为它新建个文件，严禁在这里再添加逻辑
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var header = require("sea/header");
    var virtualLink = require('lib/util/virtualLink');
    var webBridge = require("sea/webBridge");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;

    //---------------事件定义----------------
    var evtFuncs = {}

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header);
            m_header.init();
        }

        virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        webBridge.onBackPressed = function() {
            webBridge.close();
            var isIPhone = navigator.appVersion.match(/iphone/gi);
            if (isIPhone) {
                return "turnBackSucceed";
            }
        }
    }

    //-----------------自定义函数-------------
    var custFuncs = {}

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts || {};

        nodeList = {
            header: queryNode("#m_header")
        }

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});