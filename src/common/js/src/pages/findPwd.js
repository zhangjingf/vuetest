/**
 * 找回密码
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var findPwd = require("sea/findPwd/findPwd");
    var header = require("sea/header");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_findPwd = null;

    //---------------事件定义----------------
    var evtFuncs = {}

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }

        m_findPwd = findPwd(nodeList.findPwd, opts);
        m_findPwd.init();

    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
    }

    //-----------------自定义函数-------------
    var custFuncs = {}

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts;
        nodeList = {
            header: queryNode("#m_header"),
            findPwd: queryNode("#m_findPwd")
        }
        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;
    return that;
});