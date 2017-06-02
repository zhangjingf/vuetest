/**
 * 指定影院影片排期信息展示
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var parseNode = require("lib/dom/parseNode");
    var closest = require("lib/dom/closest");
    var appendQuery = require("lib/str/appendQuery");
    var className = require("lib/dom/className");
    var URL = require("lib/util/URL");
    var queryToJson = require("lib/json/queryToJson");
    var webBridge = require("sea/webBridge");
    var swiper = require("swiper");
    var each = require("lib/util/each");
    var ajax = require("lib/io/ajax");
    var touch = require("touch");
    var preferentialList = require("sea/dialog/preferentialList");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_timeSwiper = null;
        var clickedIndex = 0;
        var m_preferentialList = null;
        var m_cinemaSwiper = null;
        var showList = null;

        //---------------事件定义----------------
        var evtFuncs = {
            showPreferentialList: function (ev) {
                ev.stopPropagation();
                var target = ev.target;
                var pNode = closest(target, "[node-name=movieShow]", node);
                if (pNode == null) {
                    return;
                }
                var dataUrl = pNode.getAttribute("data-url");
                var dataStatus = pNode.getAttribute("data-status");/*data-status = 0不需要弹框  1有三种优惠  2有两种优惠*/
                var preferenticalPrice = pNode.getAttribute("data-preferPrice");
                /*var url = appendQuery(dataList["seatUrl"], {
                 "showNo": pNode.getAttribute('data-show-no'),
                 "cardActId": pNode.getAttribute('data-cardActId')
                 });*/
                m_preferentialList.init({"url": dataUrl, "prices": preferenticalPrice, "status": dataStatus});
                m_preferentialList.show();
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_preferentialList = preferentialList("这是会员优惠列表",{
                "title": "会员优惠",
                "OKText": " ",
                "OK": function() {}
            });
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            /*if (!!nodeList.list) {
                touch.on(nodeList.list, 'tap', "[node-name=num]", evtFuncs.showPreferentialList)
            }*/
            if (!!nodeList.moviesContainer) {
                touch.on(nodeList.moviesContainer, 'tap', "[node-name=num]", evtFuncs.showPreferentialList)
            }
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            curIndex: function () {
                var selectValue = opts["showDate"];
                each(nodeList.thumb, function (item, index) {
                    var dataTime = item.getAttribute("data-time");
                    var loopDate = dataTime.substr(0,2)+dataTime.substr(3,2);
                    if (selectValue == loopDate) {
                        clickedIndex = index;/* 把位置号保存起来 改掉clickedIndex = 0; */
                    }
                    //className.remove(nodeList.thumb[index].lastElementChild, "show");
                });
                //className.add(nodeList.thumb[clickedIndex].lastElementChild, "show");

                each(nodeList.timeList, function(item,i){
                    item.style.display = "none"
                });
                if (nodeList.timeList instanceof Array) {
                    nodeList.timeList[clickedIndex].style.display = "block";
                } else {
                    nodeList.timeList.style.display = "block";
                }
            },
            initTimeSwiper: function () {
                m_timeSwiper = new swiper(".tabs", {
                    "slidesPerView": 3,
                    "paginationClickable": true,
                    "spaceBetween": 0,
                    "touchMoveStopPropagation": false,
                    onTap: function (swiper, event) {
//console.log(clickedIndex);
                        if (event.target.parentNode.tagName != 'LI') {
                            return ;
                        }
                        if (swiper.clickedIndex == clickedIndex) {
                            return ;
                        }
                        var oldIndex = clickedIndex;
                        clickedIndex = swiper.clickedIndex;
                        each(nodeList.timeList, function(item,i){
                            item.style.display = "none"
                        });
                        nodeList.timeList[clickedIndex].style.display = "block";

                        className.remove(nodeList.thumb[oldIndex].childNodes[1], "active");
                        className.remove(nodeList.thumb[oldIndex].childNodes[3], "show");
                        className.add(nodeList.thumb[clickedIndex].childNodes[1], "active");
                        className.add(nodeList.thumb[clickedIndex].childNodes[3], "show");
                    }
                });
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            opts = queryToJson(URL.parse(location.href)["query"]);
            nodeList = parseNode(node);

            modInit();
            bindEvents();
            custFuncs.curIndex();
            custFuncs.initTimeSwiper();
        }
        //-----------------暴露各种方法-----------
        that.init = init;


        return that;
    }
});