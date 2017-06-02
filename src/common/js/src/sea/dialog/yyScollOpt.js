/**
 * 选择职业
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var modal = require("lib/layer/modal");
    var merge = require("lib/json/merge");
    var touch = require("touch");
    var each = require("lib/util/each");
    var swiper = require("swiper");
    //---------- require end -------------
    var TMPL = ' <div class="innerHTML AniBounceInUp">\
                    <div class="layout-1"><div node-name="cancel">取消</div> <div class="ok" node-name="ok">确定</div> </div>\
                    <div class="layout-2">\
                       <div class="swiper-container" node-name="optSwiper">\
                                <ul class="swiper-wrapper" node-name="content"></ul>\
                            </div>\
                        <div class="box"></div>\
                    </div>\
                </div>';
    return function (content, opts) {
        var that = modal();
        content = content || {};
        opts = merge({
            "OKText": "确定",
            "cancelText": "取消",
            "OK": function () {
            },
            "cancel": function () {
            }
        }, opts || {});

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var node = null;
        var m_swiper = null;
        var choiceInfo = null;
        var superMethod = {
            init: that.init
        };

        //---------------事件定义----------------
        var evtFuncs = {
            "ok": function (ev) {
                opts["OK"]();
                that.hide("ok");
            },
            "cancel": function (ev) {
                opts["cancel"]();
                that.hide("cancel");
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {

        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.ok, "tap", evtFuncs.ok);
            touch.on(nodeList.cancel, "tap", evtFuncs.cancel);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            initSwiper: function () {
                m_swiper = new swiper(nodeList.optSwiper, {
                    'direction': 'vertical',
                    'loop': true,
                    'centeredSlides': true,
                    'slideActiveClass': "selected",
                    'slidesPerView': 5,
                    'spaceBetween': 0,
                    "touchMoveStopPropagation": false,
                    'onTap': function (ev) {
                        ev.slideTo(ev.clickedIndex);
                    },
                    'onSlideChangeEnd': function (ev) {
                        choiceInfo = ev.slides[ev.activeIndex].dataset;
                    },
                    'onInit': function (ev) {
                        choiceInfo = ev.slides[ev.activeIndex].dataset;
                    }
                });
            },
            buildHTML: function (obj) {
                var _html = '';
                each(obj, function (item) {
                    _html += '<li class="swiper-slide" data-value="'+ item.Value +'" data-name="'+ item.Name +'">' + item.Name + '</li>'
                })
                nodeList.content.innerHTML = _html;
            },
            getChoice: function () {
                return choiceInfo;
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-modal-scrollOpt";
            nodeList = parseNode(node);
            data = _data;

            nodeList.cancel.innerHTML = opts["cancelText"];
            nodeList.ok.innerHTML = opts["OKText"];
            custFuncs.buildHTML(content);

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.initSwiper = custFuncs.initSwiper;
        that.getChoice = custFuncs.getChoice;

        return that;
    }
});