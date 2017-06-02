/**
 * 指定地区、日期和影片 日期滑动
 */
define(function(require, exports, module) {
    //----1------ require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var className = require("lib/dom/className");
    var closest = require("lib/dom/closest");
    var swiper = require("swiper");
    var touch = require("touch");
    //var calendar = require("lib/util/calendar");
    //---------- require end -------------

    //-----2--------全局变量 --------------

    return function(node, opts) {

        //------2-------模块扩展--------------
        var that = compBase();
        //------3------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_IMGswiper = null;
        var clickedIndex = 0;



        //------4---------事件定义----------------
        var evtFuncs = {
            findShow: function (ev) {
                var target = ev.target;
                var pNode = closest(target, "[node-name=timeItem]", node);/*开始元素,含有的属性,终点元素*/
                if (pNode == null) {
                    return;
                }
                var dataDay = pNode.getAttribute('data-day');
                that.fire("changeDay", {
                    "value": dataDay
                });

            }
        }

        //-------5--------子模块定义---------------
        var modInit = function() {}

        //-------6----------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.timeItem, "tap", evtFuncs.findShow);
        }

        //--------7---------自定义函数-------------
        var custFuncs = {
            /*初始化滑动效果*/
            initImgSwiper: function () {
                m_IMGswiper = new swiper(".tabs", {
                    "slidesPerView": 3,
                    "paginationClickable": true,
                    "spaceBetween": 0,
                    "touchMoveStopPropagation": false,
                    onTap: function(m_IMGswiper,event){
                        if (m_IMGswiper.clickedIndex == clickedIndex) {
                            return;
                        }
                        if (event.target.parentNode.tagName != 'LI') {
                            return ;
                        }
                        var oldIndex = clickedIndex;
                        clickedIndex = m_IMGswiper.clickedIndex;
                        /*that.fire('dateChange',{
                            'value' : event.target.innerText
                        });*/
                        className.remove(nodeList.timeItem[oldIndex].childNodes[1], "active");
                        className.add(nodeList.timeItem[clickedIndex].childNodes[1], "active");
                    }
                });
            }
        }

        //--------8---------初始化----------------
        var init = function(_data) {
            data = _data;
            nodeList = parseNode(node);

            modInit();
            bindEvents();
            custFuncs.initImgSwiper();
        };

        //--------9---------暴露各种方法-----------
        that.init = init;

        return that;
    }
});