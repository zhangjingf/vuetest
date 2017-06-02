/**
 *活动页面
 *
 *
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var swiper = require("swiper");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_swiper = null;

        //---------------事件定义----------------
        var evtFuncs = {}

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {}

        //-----------------自定义函数-------------
        var custFuncs = {
            initView: function() {
                m_swiper = new swiper(".sales-swiper", {
                    "loop": true,
                    "autoplay": 3000,
                    "speed": 1000,
                    "autoplayDisableOnInteraction": false,
                    "paginationClickable": true,
                    "lazyLoading": true,
                    lazyLoadingInPrevNext : true,
                    "touchMoveStopPropagation": false,
                    "pagination": '.swiper-point'
                });
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();

            custFuncs.initView();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});