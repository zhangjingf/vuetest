/**
 * 弹出层显示大图
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var modal = require("lib/layer/modal");
    var merge = require("lib/json/merge");
    var touch = require("touch");
    var swiper = require("swiper");
    var each = require("lib/util/each");
    var webBridge = require("sea/webBridge");
    var jsonToQuery = require("lib/json/jsonToQuery");
    var toast = require("sea/toast");
    //---------- require end -------------
    var TMPL = '<div class="swiper-container content bigImgSwiper"><div class="swiper-wrapper" node-name="content"></div></div>' +
        '<div class="active" node-name="active"><div data-type="1">分享剧照</div><div data-type="2">制作台词海报</div></div>';

    return function (content, opts) {
        var that = modal();

        content = content || "提示内容";
        opts = merge({
            "OK": function () {
            }
        }, opts || {});
        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var node = null;
        var superMethod = {
            init: that.init
        };

        var m_swiper = null;
        var initialScale = 1;
        var currentScale = 0;

        //---------------事件定义----------------
        var evtFuncs = {
            "ok": function (ev) {
                opts["OK"]();
                that.hide("ok");
                webBridge.topBarVisible({"hide": "0"});//2:替换为回退箭头
                each(node.querySelectorAll(".swiper-slide"), function (item) {
                    item.style.webkitTransform = 'scale(1)';
                });
            },
            //缩放图片
            pinchElement: function (ev) {

                var target = ev.target.parentElement;
                var _currentScale = ev.scale - 1;
                var _initialScale = initialScale + _currentScale;

                if (_initialScale < 0.8) {
                    _initialScale = 0.8;
                } else if (_initialScale > 2.2) {
                    _initialScale = 2.2;
                }
                target.style.webkitTransform = 'scale(' + _initialScale + ')';
            },
            pinchElementEnd: function (ev) {
                var target = ev.target.parentElement;
                currentScale = ev.scale - 1;
                currentScale = initialScale + currentScale;
                initialScale = currentScale;
                if (initialScale <= 1) {
                    target.style.webkitTransform = 'scale(1)';
                    initialScale = 1;
                }
            },
            active: function (ev) {
                ev.stopPropagation();
                var _type = ev.target.getAttribute("data-type");
                var imgUrl = m_swiper.slides[m_swiper.activeIndex].dataset.imgurl;
                if (_type == 1) {
                    webBridge.shareBigImageToWeiXin({
                        "type": "friends",
                        "uploadImageType": 1,
                        "base64String": imgUrl
                    }, function (res) {
                        toast(res.msg);
                        that.hide("cancel");
                    })
                } else if (_type == 2) {
                    //window.localStorage.setItem("designCoverImgUrl",imgUrl);
                    webBridge.openUrl(opts.designcover + '&' + jsonToQuery({
                            "filmNo": opts["filmNo"],
                            "imgUrl": imgUrl
                        }));
                    that.hide("cancel");
                }

            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(node, "tap", evtFuncs.ok);
            touch.on(that.getMask().getOuter(), "tap", evtFuncs.ok);

            touch.on(node, 'pinch', ".swiper-slide", evtFuncs.pinchElement);
            touch.on(node, 'pinchend', ".swiper-slide", evtFuncs.pinchElementEnd);
            touch.on(nodeList.active, "tap", ">div", evtFuncs.active);

        }

        //-----------------自定义函数-------------
        var custFuncs = {
            slideTo: function (index) {
                webBridge.topBarVisible({"hide": "1"});//关闭大图
                if (!m_swiper) {
                    m_swiper = new swiper(".bigImgSwiper", {
                        "direction": 'horizontal',
                        "zoom": true,
                        "speed": 500,
                        "touchMoveStopPropagation": false,
                        "width": window.innerWidth,
                        "observer": true,//修改swiper自己或子元素时，自动初始化swiper
                        onSlideChangeEnd: function () {
                            initialScale = 1;
                            currentScale = 0;
                            each(node.querySelectorAll(".swiper-slide"), function (item) {
                                item.style.webkitTransform = 'scale(1)';
                            })
                        }
                    });
                    that.getMask().getOuter().style.opacity = '1';
                }
                m_swiper.slideTo(index, 0, false);
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-mode-alertBigImg";
            nodeList = parseNode(node);
            data = _data;
            if(opts.isSup != "true") {
                nodeList.active.style.display = "none";
            }
            nodeList.content.innerHTML = content;

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.slideTo = custFuncs.slideTo;

        return that;
    }
});