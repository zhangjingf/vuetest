/**
 * 软件反馈
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var feedback = require("sea/feedback/feedback");
    var header = require("sea/header");
    var webBridge = require("sea/webBridge");
    //var virtualLink = require("lib/util/virtualLink");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_feedback = null;
    var m_header = null;

    //---------------事件定义----------------
    var evtFuncs = {}

    //---------------子模块定义---------------
    var modInit = function() {
        m_feedback = feedback(nodeList.feedback, opts);
        m_feedback.init();

        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }

        //virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {}

    //-----------------自定义函数-------------
    var custFuncs = {
        initView: function() {}
    }
    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts || {};

        nodeList = {
            feedback: queryNode("#m_feedback"),
            header: queryNode("#m_header")
        }

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});