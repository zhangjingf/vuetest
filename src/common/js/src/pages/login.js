/**
 * 登录页
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var header = require("sea/login/header");
    var form = require("sea/login/form");
    var webBridge = require("sea/webBridge");
    var virtualLink = require("lib/util/virtualLink");
    var storageMessager = require("lib/evt/storageMessager");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_form = null;

    //---------------事件定义----------------
    var evtFuncs = {
        back: function() {
            if(opts["from"] == "mall") {
                webBridge.popToSelectedController("homePage");
                return;
            }
            webBridge.close();
        },
        findPwd: function (ev) {
            m_form.setMobile(ev.data.mobile);
            webBridge.close(2);
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }

        m_form = form(nodeList.form, opts);
        m_form.init();

        virtualLink('data-url');
        if(!nodeList.header) {
            webBridge.onBackPressed = function () {
                evtFuncs.back();
                var isIPhone = navigator.appVersion.match(/iphone/gi);
                if (isIPhone) {
                    return "turnBackSucceed";
                }
            }
        }
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        webBridge.showKeyboard = function (data) {
            var dpr = document.documentElement.getAttribute("data-dpr");
            document.querySelector("body").style.marginBottom = parseInt(data)*dpr+'px';
            document.querySelector("body").scrollTop = 80;
        };
        webBridge.hiddenKeyboard = function () {
            document.querySelector("body").style.marginBottom =0;
        };
        storageMessager.bind("userResetPsd", evtFuncs.findPwd);

    }

    //-----------------自定义函数-------------
    var custFuncs = {}

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts;

        nodeList = {
            header: queryNode("#m_header"),
            form: queryNode("#m_form")
        }
        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});