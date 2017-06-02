/**
 * 更换登录手机号
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var changeMobile = require("sea/changeMobile/changeMobile");
    var header = require("sea/header");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_changeMobile = null;

    //---------------事件定义----------------
    var evtFuncs = {}

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }

        m_changeMobile = changeMobile(nodeList.changeMobile, opts);
        m_changeMobile.init();

    }

    //-----------------绑定事件---------------
    var bindEvents = function() {}

    //-----------------自定义函数-------------
    var custFuncs = {}

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts;

        nodeList = {
            header: queryNode("#m_header"),
            changeMobile: queryNode("#m_forgotForm")
        }

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});