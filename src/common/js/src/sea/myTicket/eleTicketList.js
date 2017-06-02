/**
 * 我的电子券列表
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    //var ajax = require("lib/io/ajax");
    //var closest = require("lib/dom/closest");
    //var webBridge = require("sea/webBridge");
    var swiper = require("swiper");
    //var touch = require("touch");

    //var showMessage = require("sea/showMessage");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_swiper = null;

        //---------------事件定义----------------
        var evtFuncs = {
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {}

        //-----------------自定义函数-------------
        var custFuncs = {
            initView: function () {
                custFuncs.initSwiper();
                custFuncs.swiperTo(0);
            },
            initSwiper: function() {
                if (m_swiper == null) {
                    m_swiper = new swiper(".eleTicket-swiper", {
                        "speed": 400,
                        "touchMoveStopPropagation": false,
                        "autoHeight":true,
                        "onSlideChangeStart": function () {
                            that.fire("slideChange", {
                                "index": m_swiper.activeIndex
                            });
                        }
                    });
                }
            },
            swiperTo : function (slideTo) {
                m_swiper.slideTo(slideTo);
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;

            custFuncs.initView();
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.swiperTo = custFuncs.swiperTo;
        that.initView = custFuncs.initView;

        return that;
    }
});