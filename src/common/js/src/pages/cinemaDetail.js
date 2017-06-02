/**
 * 影片详情 页面控制器
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var webBridge = require("sea/webBridge");
//    var touch = require("touch");
    var detail = require("sea/cinemaDetail/detail");
    var virtualLink = require("lib/util/virtualLink");
    var opacityHeader = require("sea/opacityHeader");
    var flexBoxRefresh = require("sea/flexBoxRefresh");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_detail = null;
    var m_flexBoxRefresh = null;

    //---------------事件定义----------------
    var evtFuncs = {}

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = opacityHeader(nodeList.header, opts);
            m_header.init();
        }

        m_detail = detail(nodeList.detail, opts);
        m_detail.init();

        m_flexBoxRefresh = flexBoxRefresh(nodeList.pbd,{'atTheTop':custFuncs.atTheTop,'leaveTheTop':custFuncs.leaveTheTop});
        m_flexBoxRefresh.init();

        virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {}

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
        opts = _opts;
        nodeList = {
            pbd: queryNode("#m_pbd"),
            header: queryNode("#m_opacity_header"),
            detail : queryNode('#m_detail'),
            button :  queryNode('#m_button')
        };
        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});