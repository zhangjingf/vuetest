/**
 * 影片详情页面
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var opacityHeader = require("sea/opacityHeader");
    var syncPages = require("sea/syncPages");
    var virtualLink = require("lib/util/virtualLink");
    var flexBoxRefresh = require("sea/flexBoxRefresh");
    var webBridge = require("sea/webBridge");

    var info = require("sea/filmInfo/info");
    var brief = require("sea/filmInfo/brief");
    var review = require("sea/filmInfo/review");
    var storageMessager = require("lib/evt/storageMessager");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_info = null;
    var m_brief = null;

    var m_flexBoxRefresh = null;
    var m_review = null;
    //---------------事件定义----------------
    var evtFuncs = {
        "switch": function(ev) {
            m_info.infoSwiperSwitch(ev.data);
        },
        "respondComment": function (ev) {
            window.location.reload();
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = opacityHeader(nodeList.header, opts);
            m_header.init();
        }

        m_info = info(nodeList.info, opts);
        m_info.init();

        m_brief = brief(nodeList.brief, opts);
        m_brief.init();


        m_flexBoxRefresh = flexBoxRefresh(nodeList.pbd, { 'atTheTop': custFuncs.atTheTop, 'leaveTheTop': custFuncs.leaveTheTop });
        m_flexBoxRefresh.init();

        m_review = review(nodeList.review, opts);
        m_review.init();

        virtualLink('data-url');

        storageMessager.bind("commentLaunchDetail", evtFuncs.respondComment);

        syncPages.syncReviews();    
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {

    }

    //-----------------自定义函数-------------
    var custFuncs = {
        atTheTop: function() {
            webBridge.flexBoxRefresh({ atTheTop: '1' });
            m_flexBoxRefresh.work();
        },
        leaveTheTop: function() {
            webBridge.flexBoxRefresh({ atTheTop: '0' });
            m_flexBoxRefresh.work();
        }

    }

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts || {};
        nodeList = {
            header: queryNode("#m_opacity_header"),
            brief: queryNode('#m_brief'), // 包含点赞的模块
            info: queryNode('#film_info'),
            review: queryNode('#info_review'),
            pbd: queryNode('#m_pbd')
        };
        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});