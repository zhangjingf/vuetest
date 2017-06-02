/**
 * 我的优惠券列表
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var appendQuery = require("lib/str/appendQuery");
    var closest = require("lib/dom/closest");
    var webBridge = require("sea/webBridge");
    var swiper = require("swiper");
    var touch = require("touch");

    var showMessage = require("sea/showMessage");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_swiper = null;

        //---------------事件定义----------------
        var evtFuncs = {
            jumpPage: function (ev) {
                var target = ev.target;
                var getNode = closest(target, "[node-name=instructions]", node);
                if (getNode == null) {
                    return;
                }
                var status = getNode.getAttribute("data-status");
                var discountNo = getNode.getAttribute("data-discountNo");
                if (status == 1) {
                    webBridge.openUrl(appendQuery("myCouponExplainUnused.html",{
                        "discountNo": discountNo
                    }), "blank");
                    return;
                }
                webBridge.openUrl(appendQuery("myCouponExplain.html",{
                    "discountNo": discountNo
                }), "blank");
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            //touch.on(node, "tap", "[node-name=instructions]", evtFuncs.jumpPage);
        };

        //-----------------自定义函数-------------
        var custFuncs = {
            initView: function () {
                custFuncs.initSwiper();
                custFuncs.swiperTo(0);
            },
            initSwiper: function () {
                if (m_swiper == null) {
                    m_swiper = new swiper(".coupon-swiper", {
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
            swiperTo: function (slideTo) {/*需要等下面的数据加载完才能 点击“待使用”“已使用” 滑块*/
                m_swiper.slideTo(slideTo);
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            data = _data;

            custFuncs.initView();
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.swiperTo = custFuncs.swiperTo;

        return that;
    }
});