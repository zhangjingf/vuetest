/**
 * 个人资料
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var header = require("sea/header");
    var opera = require("sea/myData/opera");
    var storageMessager = require("lib/evt/storageMessager");
    var util = require("sea/utils");
    var webBridge = require("sea/webBridge");
    var virtualLink = require("lib/util/virtualLink");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_opera = null;

    //---------------事件定义----------------
    var evtFuncs = {
       /* changeMobile: function (ev) {
            m_opera.changeMobile(ev.data.mobile);
        },*/
        reload: function () {
            webBridge.openUrl(util.getCurrentURL(), 'self');
        },
        yyHobby: function (ev) {
           m_opera.changeHobby(ev.data.hobby);
        },
        yyWeChat:function(ev) {
            m_opera.changeWeChat(ev.data.WeiXin);
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        virtualLink('data-url');

        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }


        m_opera = opera(nodeList.opera, opts);
        m_opera.init();
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        //storageMessager.bind('changeMobile', evtFuncs.changeMobile);
        storageMessager.bind('selectedCityChanged', evtFuncs.reload);
        storageMessager.bind('yyHobby', evtFuncs.yyHobby);
        storageMessager.bind('yyWeChat', evtFuncs.yyWeChat);
    }

    //-----------------自定义函数-------------
    var custFuncs = {}

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts;

        nodeList = {
            header: queryNode("#m_header"),
            opera: queryNode("#m_opera")
        }

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});