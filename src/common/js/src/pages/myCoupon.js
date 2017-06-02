/**
 * 我的优惠券页面控制器
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var storageMessager = require("lib/evt/storageMessager");
    var header = require("sea/myCoupon/header");
    var typeTabs = require("sea/slideNav");
    var couponList = require("sea/myCoupon/couponList");
    var showMessage = require("sea/showMessage");
    var virtualLink = require("lib/util/virtualLink");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;


    var m_header = null;
    var m_typeTabs = null;
    var m_couponList = null;


    //---------------事件定义----------------
    var evtFuncs = {
        /*刷新 待使用券*/
        flushTickets : function () {
            m_couponList.initView();
        },
        swiperTo : function (e) {
            m_couponList.swiperTo(e.data);
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }

        m_typeTabs = typeTabs(nodeList.typeTabs, {
            count: 2
        });
        m_typeTabs.init();

        m_couponList = couponList(nodeList.couponList, opts);
        m_couponList.init();

        virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        storageMessager.bind("couponChange", webBridge.reload);/*绑定电子券 需要刷新这个页面*/
        m_typeTabs.bind("switchTab",evtFuncs.swiperTo);
        m_couponList.bind('slideChange', custFuncs.slideChange);

        webBridge.clickRightEnsure = function () {
            webBridge.openUrl(opts["bindCoupon"], "blank", {
                "title": "优惠券绑定_userwallet/mycoupon"
            });
        };
    };

    //-----------------自定义函数-------------
    var custFuncs = {
        slideChange: function (ev) {
            m_typeTabs.slideShift(ev.data.index+1);
        }

    }

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts || {};

        nodeList = {
            header: queryNode("#m_header"),
            typeTabs: queryNode("#m_typeTabs"),
            couponList: queryNode("#m_couponList")
        };

        /*custFuncs.initView();*/
        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});