/**
 * 影院影片排期页面
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var header = require("sea/movieShow/header");
    var cinemaInfo = require("sea/movieShow/cinemaInfo");
    var timeSwiper = require("sea/movieShow/timeSwiper");
    var virtualLink = require("lib/util/virtualLink");
    var queryToJson = require("lib/json/queryToJson");
    var webBridge = require("sea/webBridge");
    var URL = require("lib/util/URL");
    var flexBoxRefresh = require("sea/flexBoxRefresh");

    //---------- require end -------------
    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_cinemaInfo = null;
    var m_timeSwiper = null;
    var m_flexBoxRefresh = null;
    var url = null;

    //---------------事件定义----------------
    var evtFuncs = {

    }

    //---------------子模块定义---------------
    var modInit = function() {
        m_header = header(nodeList.header, opts);
        m_header.init();

        /*影院影片排期信息展示模块*/
        m_timeSwiper = timeSwiper(nodeList.timeSwiper, opts);
        m_timeSwiper.init();
        /*影院信息模块*/
        m_cinemaInfo = cinemaInfo(nodeList.cinemaInfo, opts);
        m_cinemaInfo.init();

        m_flexBoxRefresh = flexBoxRefresh(nodeList.pbd,{'atTheTop':custFuncs.atTheTop,'leaveTheTop':custFuncs.leaveTheTop});
        m_flexBoxRefresh.init();

        virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {

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
        url = queryToJson(URL.parse(location.href)["query"]);
        opts = _opts || {};
        nodeList = {
            pbd : queryNode('#m_pbd'),
            header : queryNode('#m_header'),
            cinemaInfo : queryNode('#m_cinemaInfo'),
            timeSwiper : queryNode('#m_timeSwiper')
        };
        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});