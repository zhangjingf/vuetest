/**
 * 我的观影美食
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var swiper = require("swiper");
    var header = require("sea/myWatchFilmCate/header");
    var slideNav = require("sea/slideNav");
    var webBridge = require("sea/webBridge");
    var myStatusCate = require("sea/myWatchFilmCate/myStatusCate");
    var storageMessager = require("lib/evt/storageMessager");
    var virtualLink = require("lib/util/virtualLink");
    var flexBoxRefresh = require("sea/flexBoxRefresh");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_slideNav = null;
    var m_myStatusCate = null;
    var m_pageSwiper = null;
    var m_flexBoxRefresh = null;

    //---------------事件定义----------------
    var evtFuncs = {
        slideShiftType: function(ev) {
            m_pageSwiper.slideTo(ev.data);
            //m_header.toMovie();
        },
        slideChange: function (index) {
            m_slideNav.slideShift(index+1)
        },
        cancelMealOrder: function (ev) {
            webBridge.openUrl(ev["data"]["url"],'self');
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        m_header = header(nodeList.header, opts);
        m_header.init();

        m_slideNav = slideNav(nodeList.cateStatusTabs, { count: 4});
        m_slideNav.init();

        m_flexBoxRefresh = flexBoxRefresh(nodeList.myStatusCate,{'atTheTop':custFuncs.atTheTop,'leaveTheTop':custFuncs.leaveTheTop});
        m_flexBoxRefresh.init();

        m_myStatusCate = myStatusCate(nodeList.myStatusCate, opts);
        m_myStatusCate.init();
        m_pageSwiper = swiper(".tabs-content", {
            "speed": 400,
            "touchMoveStopPropagation": false,
            "autoHeight":true,
            "onSlideChangeStart": function () {
                evtFuncs.slideChange(m_pageSwiper.activeIndex);
            }
        });
        virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        m_slideNav.bind("switchTab", evtFuncs.slideShiftType);
        storageMessager.bind("cancelMealOrder",evtFuncs.cancelMealOrder);
        webBridge.onBackPressed = m_header.onBackPressed;
    }

    //-----------------自定义函数-------------
    var custFuncs = {
        atTheTop: function () {
            webBridge.flexBoxRefresh({atTheTop:'1'});
            m_flexBoxRefresh.work();
        },
        leaveTheTop: function () {
            webBridge.flexBoxRefresh({atTheTop:'0'});
            m_flexBoxRefresh.work();
        }
    }

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts || {};

        nodeList = {
            header: queryNode("#m_header"),
            cateStatusTabs: queryNode("#m_cateStatusTabs"),
            myStatusCate: queryNode("#m_myStatusCate")
        }
        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});