/**
 * 支付结果
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var content = require("sea/result/content");
    var webBridge = require("sea/webBridge");
    
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_content = null;

    //---------------事件定义----------------
    var evtFuncs = {
    }

    //---------------子模块定义---------------
    var modInit = function () {

    }

    //-----------------绑定事件---------------
    var bindEvents = function () {
        webBridge.onBackPressed = function () {
            webBridge.popToSelectedController("mall");
            var isIPhone = navigator.appVersion.match(/iphone/gi);
            if (isIPhone) {
                return "turnBackSucceed";
            }
        }
        webBridge.clickRightEnsure = function () {
            webBridge.popToSelectedController("mall");
            var isIPhone = navigator.appVersion.match(/iphone/gi);
            if (isIPhone) {
                return "turnBackSucceed";
            }
        }

        m_content = content(nodeList.content, opts);
        m_content.init();

    }

    //-----------------自定义函数-------------
    var custFuncs = {
    }

    //-----------------初始化----------------
    var init = function (_opts) {
        opts = _opts || {};
        nodeList = {
            header : queryNode("#m_header"),
            content : queryNode("#m_content")
        }
        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});