/**
 * 
 * 开通海洋会员卡
 *  
 *   
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var URL = require("lib/util/URL");
    var queryToJson = require("lib/json/queryToJson");
    var slideNav = require("sea/slideNav");
    var content = require("sea/openSeaVIPCard/content");
    var virtualLink = require("lib/util/virtualLink");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_tabs = null;
    var m_content = null;

    //---------------事件定义----------------
    var evtFuncs = {
        switch: function(ev) {
            m_content.switch(ev.data);
        },
        slideChange: function(ev) {
            m_tabs.slideShift(ev.data.index + 1);
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        m_tabs = slideNav(nodeList.tabs, { count: 2 });
        m_tabs.init();

        m_content = content(nodeList.content, opts);
        m_content.init();

        virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        m_tabs.bind('switchTab', evtFuncs.switch);
        m_content.bind("slideChange", evtFuncs.slideChange);
    }

    //-----------------自定义函数-------------
    var custFuncs = {}

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts || {};
        opts.url = queryToJson(URL.parse(location.href)["query"]);
        nodeList = {
            tabs: queryNode("#m_tabs"),
            content: queryNode("#m_content")
        }

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});