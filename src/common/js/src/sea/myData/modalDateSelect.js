/**
 * 提示弹层
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var modal = require("sea/dialog/modals");
    var ajax = require("lib/io/ajax");
    var merge = require("lib/json/merge");
    var swiper = require("swiper");
    var className = require("lib/dom/className");
    var touch = require("touch");
    var toast = require("sea/toast");
    var each = require("lib/util/each");
    var webBridge = require("sea/webBridge");
    var utils = require("sea/utils");
    //---------- require end -------------
    var TMPL = '<div class="layout-1"><div node-name="cancel">取消</div><div node-name="ok">确定</div></div>\
        <div class="body" node-name="body"></div><div class="centerBox" node-name="centerBox"></div>';

    return function (opts) {
        var that = modal();
        opts = merge({
            "yearList": '',//选择年份区间1900-当前年份传入格式'1900-2016'
            "selectedDate": "1990-1-1",//默认选择时间
            "OK": function () {
            }
        }, opts || {});
        console.log(opts['selectedDate'])
        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var node = null;
        var yearScroll = null;
        var monthScroll = null;
        var dayScroll = null;

        var selectedYear = opts.selectedDate.split("-")[0];
        var selectedMonth = opts.selectedDate.split("-")[1];
        var selectedDay = opts.selectedDate.split("-")[2];

        var date = new Date();
        var superMethod = {
            init: that.init
        };

        //---------------事件定义----------------
        var evtFuncs = {
            "ok": function (ev) {
                custFuncs.setBirthday();
                opts["OK"]();
                that.hide("ok");
            },
            cancel: function () {
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
            initView: function () {
                var selectedDay = opts.selectedDate.split("-");
                var selectedDate = new Date(selectedDay[0], selectedDay[1], 0);
                var nowMonthDay = selectedDate.getDate();//当前选择月份有多少天
                var yearList = !!opts.yearList ? opts.yearList : '1900-' + date.getFullYear();
                var yearHtml = '<div class="year swiper-container" node-name="year"><ul class="swiper-wrapper">';
                var monthHtml = '<div class="month swiper-container" node-name="month"><ul class="swiper-wrapper">';
                var dayHtml = '<div class="day swiper-container" node-name="day"><ul class="swiper-wrapper" node-name="dayItem">';
                for (var a = parseInt(yearList.split('-')[0]); a <= parseInt(yearList.split('-')[1]); a++) {
                    yearHtml += '<li class="swiper-slide" data-year="' + a + '">' + a + '年' + '</li>'
                }
                for (var b = 1; b <= 12; b++) {
                    monthHtml += '<li class="swiper-slide" data-month="' + b + '">' + b + '月' + '</li>'
                }
                for (var c = 1; c <= nowMonthDay; c++) {
                    dayHtml += '<li class="swiper-slide" data-day="' + c + '">' + c + '日' + '</li>'
                }
                yearHtml += '</ul></div>';
                monthHtml += '</ul></div>';
                dayHtml += '</ul></div>';
                nodeList.body.innerHTML += yearHtml + monthHtml + dayHtml;
                nodeList = parseNode(node);
            },
            initiScroll: function () {
                yearScroll = new swiper(nodeList.year, {
                    'direction': 'vertical',
                    'centeredSlides': true,
                    'slideActiveClass': "selected",
                    'slidesPerView': 5,
                    'spaceBetween': 0,
                    'loop': true,
                    'loopAdditionalSlides': 20,
                    "touchMoveStopPropagation": false,
                    'onTap': function (ev) {
                        yearScroll.slideTo(ev.clickedIndex);
                    },
                    'onSlideChangeEnd': function (ev) {
                        selectedYear = ev.slides[ev.activeIndex].getAttribute("data-year");
                        custFuncs.reloadDay();
                    }
                });
                monthScroll = new swiper(nodeList.month, {
                    'direction': 'vertical',
                    'centeredSlides': true,
                    'slideActiveClass': "selected",
                    'slidesPerView': 5,
                    'spaceBetween': 0,
                    "touchMoveStopPropagation": false,
                    'loop': true,
                    'loopAdditionalSlides': 12,
                    'onTap': function (ev) {
                        monthScroll.slideTo(ev.clickedIndex);
                    },
                    'onSlideChangeEnd': function (ev) {
                        selectedMonth = ev.slides[ev.activeIndex].getAttribute("data-month");
                        custFuncs.reloadDay();
                    }
                });
                dayScroll = new swiper(nodeList.day, {
                    'direction': 'vertical',
                    'centeredSlides': true,
                    'slideActiveClass': "selected",
                    'slidesPerView': 5,
                    'spaceBetween': 0,
                    'loop': false,
                    'paginationClickable': true,
                    'touchMoveStopPropagation': false,
                    'observer': true, //修改swiper自己或子元素时，自动初始化swiper
                    'observeParents': true, //修改swiper的父元素时，自动初始化swiper
                    'onTap': function (ev) {
                        dayScroll.slideTo(ev.clickedIndex);
                    },
                    'onSlideChangeEnd': function (ev) {
                        selectedDay = ev.slides[ev.activeIndex].getAttribute("data-day");
                    }
                });
                yearScroll.update();
                each(yearScroll.slides, function (item) {
                    if(item.nodeType !='1') {
                        return;
                    }
                    if (item.getAttribute("data-year") == opts['selectedDate'].split('-')[0]) {
                        //奇怪的问题第一个index输出activeIndex是25；可能是slides太多导致计算问题
                        yearScroll.slideTo(item.getAttribute("data-year")-1900+25);
                        selectedYear = yearScroll.slides[yearScroll.activeIndex].getAttribute("data-year");
                    }
                });
                each(monthScroll.slides, function (item) {
                    if(item.nodeType !='1') {
                        return;
                    }
                    if (item.getAttribute("data-month") == parseFloat(opts['selectedDate'].split('-')[1])) {
                        monthScroll.slideTo(item.getAttribute("data-swiper-slide-index"));
                        selectedMonth = monthScroll.slides[monthScroll.activeIndex].getAttribute("data-month");
                    }
                });
                each(dayScroll.slides, function (item) {
                    if(item.nodeType !='1') {
                        return;
                    }
                    if (item.getAttribute("data-day") == parseFloat(opts['selectedDate'].split('-')[2])) {
                        dayScroll.slideTo(item.getAttribute("data-day")-1);
                        selectedDay = dayScroll.slides[dayScroll.activeIndex].getAttribute("data-day");
                    }
                });
            },
            getSelectedTime: function () {
                return selectedYear + '-' + selectedMonth + '-' + selectedDay;
            },
            reloadDay: function () {
                //刷新日期列表
                var _selectedDate = new Date(selectedYear, selectedMonth, 0);
                var _nowMonthDayNum = _selectedDate.getDate();//当前选择月份有多少天
                var _nowMonthDayHtml = '';
                for (var c = 1; c <= _nowMonthDayNum; c++) {
                    _nowMonthDayHtml += '<li class="swiper-slide" data-day="' + c + '">' + c + '日' + '</li>'
                }
                nodeList.dayItem.innerHTML = _nowMonthDayHtml;
            },
            setBirthday: function () {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                var param = {
                    "birthday": selectedYear + '-' + selectedMonth + '-' + selectedDay
                };
                ajax({
                    "url": opts["modify"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res["status"] == 0) {
                            return;
                        }
                        toast(res["msg"]);
                        webBridge.openUrl(utils.getCurrentURL(),'self');
                        //that.fire("changeBirthday", {"date": selectedYear + '-' + selectedMonth + '-' + selectedDay})
                    },
                    "onError": function (req) {
                        that.unLock();
                        console.error("操作失败，状态码：" + req["status"]);
                    }
                });
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-selected-day";
            nodeList = parseNode(node);
            data = _data;
            custFuncs.initView();
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.initiScroll = custFuncs.initiScroll;

        return that;
    }
});