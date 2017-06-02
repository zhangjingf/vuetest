/**
 * 我的
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var banner = require("sea/myMenu/banner");
    var opera = require("sea/myMenu/opera");
    var virtualLink = require("lib/util/virtualLink");
    var storageMessager = require("lib/evt/storageMessager");
    var webBridge = require("sea/webBridge");
    var confirm = require("sea/dialog/confirm");
    var levelState = require("sea/levelState");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_banner = null;
    var m_opera = null;
    var m_levelState = null;

    //---------------事件定义----------------
    var evtFuncs = {
        flushData: function () {
            webBridge.reload();
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        m_banner = banner(nodeList.banner, opts);
        m_banner.init();

        m_opera = opera(nodeList.opera, opts);
        m_opera.init();
        if(nodeList.levelState) {
            m_levelState = levelState(nodeList.levelState,opts);
            m_levelState.init();
        }

        virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        storageMessager.bind("myDataChange", evtFuncs.flushData);
        storageMessager.bind("userChanged", evtFuncs.flushData);
    }

    //-----------------自定义函数-------------
    var custFuncs = {
        "tip": function () {
            if (!!localStorage.fromRegister && localStorage.fromRegister == "1") {
                localStorage.removeItem("fromRegister");
                var m_confirm = confirm("如您已办理影城会员卡或尊享卡，<br/>可在【我的钱包】中绑定",{
                    "title": "温馨提示",
                    "OKText": "现在去绑定",
                    "cancelText": "以后再说",
                    "OK": function() {
                        webBridge.openUrl(opts["myWalletUrl"], "blank");
                    },
                    "cancel": function() {}
                });
                m_confirm.init();
                m_confirm.show();
            }
        }
    }

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts;

        nodeList = {
            banner: queryNode("#m_banner"),
            opera: queryNode("#m_opera"),
            levelState: queryNode("#m_levelState")
        }

        custFuncs.tip();
        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});