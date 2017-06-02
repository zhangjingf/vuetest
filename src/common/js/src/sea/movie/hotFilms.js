/**
 * 热映影片
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var encodeHTML = require("lib/str/encodeHTML");
    var className = require("lib/dom/className");
    var closest = require("lib/dom/closest");
    var each = require("lib/util/each");
    var swiper = require("swiper");
    var touch= require("touch");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_swiper = null;
        var clickedIndex = 0;

        //---------------事件定义----------------
        var evtFuncs = {
            changeInfo: function (ev) {
                //nodeList.thumb.getAttribute()
                var target = ev.target;
                var pNode = closest(target, "[node-name=thumb]", node);/*开始元素,含有的属性,终点元素*/
                if (pNode == null) {
                    return;
                }
                var filmNo = pNode.getAttribute("data-filmNo");
                var cName = pNode.getAttribute("data-cName");
                var averageDegree = pNode.getAttribute("data-averageDegree");

                that.fire("change", {
                    "filmNo": filmNo,
                    "cName": cName,
                    "averageDegree": averageDegree
                });
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
            // console.log(nodeList.thumb);
console.log(opts.url);

            var curFilmNoIndex = 0;
            for (var i=0 ; i<nodeList.thumb.length ; i++ ) {
                if (opts.url.filmNo == nodeList.thumb[i].getAttribute('data-filmno')) {
                    curFilmNoIndex = i;
                }
            }

            m_swiper = new swiper(".tabsThumbnail", {
                "slidesPerView": 3,
                //"spaceBetween": 0,
                /*"preventClicks": true,*/
                "initialSlide" :curFilmNoIndex,
                "centeredSlides": true,
                "slideActiveClass": "cur",
                "lazyLoading": true,
                "lazyLoadingInPrevNext": true,
                "preventLinksPropagation": false,
                "paginationClickable": true,
                "longSwipes":true,
                "touchMoveStopPropagation": false,
                "onTap": function (ev) {
console.log(ev.clickedIndex);
                    //console.log(ev.clickedIndex);
                    m_swiper.slideTo(ev.clickedIndex);
                },
                "onSlideChangeStart": function () {
console.log(m_swiper);
                    if (m_swiper == null) {
                        var curDataNode = document.querySelector('.cur');
                        var index = curFilmNoIndex;
                        var filmNo = curDataNode.getAttribute("data-filmNo");
                        var cName = curDataNode.getAttribute("data-cName");
                        var averageDegree = curDataNode.getAttribute("data-averageDegree");
                        that.fire("change", {
                            "index": index,
                            "filmNo": filmNo,
                            "cName": cName,
                            "averageDegree": averageDegree
                        });
                        return;
                    }

                    var index = m_swiper.activeIndex;
                    var filmNo = m_swiper.slides[m_swiper.activeIndex].getAttribute("data-filmNo");
                    var cName = m_swiper.slides[m_swiper.activeIndex].getAttribute("data-cName");
                    var averageDegree = m_swiper.slides[m_swiper.activeIndex].getAttribute("data-averageDegree");
                    that.fire("change", {
                        "index": index,
                        "filmNo": filmNo,
                        "cName": cName,
                        "averageDegree": averageDegree
                    });
                }
                /*onTap: function(swiper, event){
                    if (swiper.clickedIndex == clickedIndex) {
                        return ;
                    }
                    if (event.target.parentNode.tagName != 'LI') {
                        return ;
                    }
                    var oldIndex = clickedIndex;
                    clickedIndex = swiper.clickedIndex;
                    //that.fire("change", data[swiper.clickedIndex]);/!*原来是一次把数据加载过来了,通过fire出去一个1,2,3,4... 去选数据*!/
                    //custFuncs.shiftClass(swiper.clickedIndex, oldIndex);
                    className.remove(nodeList.thumb[oldIndex], "selected");
                    className.add(nodeList.thumb[swiper.clickedIndex], "selected");
                    /!*className.remove(nodeListThumb.thumb[oldIndex], "selected");
                    className.add(nodeListThumb.thumb[swiper.clickedIndex], "selected");*!/
                }*/
            });
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            //touch.on(node, "tap", "[node-name=thumb]", evtFuncs.changeInfo);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            initView: function() {
/*                var html = "";
                each(data, function (item, index) {
                    if (index == 0) {
                        html += '<li class="swiper-slide selected" node-name="thumb" filmNo="' + item.filmNo + '" cName="' + encodeHTML(item.cName) + '" averageDegree="'+ item.averageDegree +'" ><img src="' + item["thumbnail"] + '"></li>';
                    } else {
                        html += '<li class="swiper-slide" node-name="thumb" filmNo="' + item.filmNo + '" cName="' + encodeHTML(item.cName) + '" averageDegree="'+ item.averageDegree +'" ><img src="' + item["thumbnail"] + '"></li>';
                    }
                });
                nodeList.list.innerHTML = html;
                nodeListThumb = parseNode(nodeList.list);*/
            }/*,
            shiftClass : function (index, oldIndex) {
                className.remove(nodeListThumb.thumb[oldIndex], "selected");
                className.add(nodeListThumb.thumb[index], "selected");
            }*/
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;
            /*custFuncs.initView();*/
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});