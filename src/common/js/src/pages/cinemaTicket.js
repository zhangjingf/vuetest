/**
 * 根据日期筛选影院排期
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var header = require("sea/header");
    var listTime = require("sea/cinemaTicket/listTime");
    var cinemaRemark = require("sea/cinemaTicket/cinemaRemark");
    var virtualLink = require("lib/util/virtualLink");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;

    var m_header = null;
    var m_listTime = null;
    var m_cinemaRemark = null;
    //---------------事件定义----------------
    var evtFuncs = {
        outDate : function (event) {
            //alert(event.data.value);
            m_cinemaRemark.inputDate(event.data.value);
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }
        /*时间滑动切换*/
        m_listTime = listTime(nodeList.listTime, opts);
        m_listTime.init();
        /*获取影院信息*/
        m_cinemaRemark = cinemaRemark(nodeList.cinemaRemark, opts);
        m_cinemaRemark.init();

        virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        m_listTime.bind('changeDay', evtFuncs.outDate);
    }

    //-----------------自定义函数-------------
    var custFuncs = {}

    //-----------------初始化----------------
    var init = function(_opts) {
        nodeList = {
            header : queryNode('#m_header'),
            listTime : queryNode('#m_listTime'),
            cinemaRemark : queryNode('#m_cinemaRemark')
        };
        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});