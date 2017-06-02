/**
 * 注册页面
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    //var webBridge = require("sea/webBridge");
    var regForm = require("sea/register/regForm");
    var header = require("sea/header");
    var virtualLink = require("lib/util/virtualLink");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_regForm = null;
    var m_header = null;

    //---------------事件定义----------------
    var evtFuncs = {}

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }

        m_regForm = regForm(nodeList.regForm, opts);
        m_regForm.init();

        virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        webBridge.showKeyboard = function (data) {
            var dpr = document.documentElement.getAttribute("data-dpr");
            document.querySelector("body").style.marginBottom = parseInt(data)*dpr+'px';
            //document.querySelector("body").scrollTop = 80;
        };
        webBridge.hiddenKeyboard = function () {
            document.querySelector("body").style.marginBottom =0;
        };
    }

    //-----------------自定义函数-------------
    var custFuncs = {}
    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts || {};

        nodeList = {
            header: queryNode("#m_header"),
            regForm: queryNode("#m_regForm")
        }

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});