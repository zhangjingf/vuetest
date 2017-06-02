/**
 * 视频播放页面
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var touch = require("touch");
    var videoPlay = require("sea/videoPlay/videoPlay");

    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_videoPlay = null;
    var m_header = null;

    //---------------事件定义----------------
    var evtFuncs = {};

    //---------------子模块定义---------------
    var modInit = function() {
        m_videoPlay = videoPlay(nodeList.pbd, opts);
        m_videoPlay.init();
    };

    //-----------------绑定事件---------------
    var bindEvents = function() {};

    //-----------------自定义函数-------------
    var custFuncs = {
        setFontSize: function () {
            var docEl = document.documentElement;
            var isAndroid = navigator.appVersion.match(/android/gi);
            var isIPhone = navigator.appVersion.match(/iphone/gi);
            var baseDpr = "devicePixelRatio" in window ? devicePixelRatio : 1;
            var dpr = baseDpr;
            if (isIPhone) {
                // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
                if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                    dpr = 3;
                } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                    dpr = 2;
                } else {
                    dpr = 1;
                }
            } else {
                // 其他设备下，仍旧使用1倍的方案
                dpr = 1;
            }
            scale = 1 / dpr;
            docEl.setAttribute("data-dpr", dpr);
            docEl.setAttribute("data-device-type", isIPhone ? "iphone" : (isAndroid ? "android" : "other"));

            var width = docEl.getBoundingClientRect().width;
            var multiple = 1.775;
            var lastWidth = null;
            switch (dpr) {
                case (1):
                    multiple = 1;
                    break;
                case (2):
                    multiple = 1.775;
                    break;
                case (3):
                    multiple = 1.771;
                    break;
            }
            if (width != lastWidth) {
                docEl.style.fontSize = ((width / 32) / multiple) + "px";
                //lastWidth = width;
            }
        }
    };

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts || {};

        //custFuncs.setFontSize();
        nodeList = {
            pbd: queryNode("#m_pbd")
        };

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});