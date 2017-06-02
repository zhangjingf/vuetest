/**
 * 绑定优惠券 页面控制器
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var header = require("sea/header");
    var bindCoupon = require("sea/bindCouponView/bindConponInput");
    //var touch = require("touch");
    var showMessage = require("sea/showMessage");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_bindCoupon = null;


    //---------------事件定义----------------
    var evtFuncs = {}

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header);
            m_header.init();
        }

        m_bindCoupon = bindCoupon(nodeList.bindCoupon, opts);
        m_bindCoupon.init();
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        window.addEventListener('resize', function(ev) {
            showMessage("22222")
        })
    }

    //-----------------自定义函数-------------
    var custFuncs = {}

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts || {};
        nodeList = {
            header: queryNode("#m_header"),
            bindCoupon: queryNode("#m_bindCoupon")
        }

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});