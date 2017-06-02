/**
 * 时间滑块
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var each = require("lib/util/each");
    var className = require("lib/dom/className");
    var encodeHTML = require("lib/str/encodeHTML");
    var closest = require("lib/dom/closest");
    var appendQuery = require("lib/str/appendQuery");
    var insertHTML = require("lib/dom/insertHTML");
    var swiper = require("swiper");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    var queryToJson = require("lib/json/queryToJson");
    var URL = require("lib/util/URL");
    var preferentialList = require("sea/dialog/preferentialList");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();
        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_swiper = null;
        var dataList = null; //一部影片里面的不同天的所有排期
        var clickedIndex = 0;
        var flags = true;
        var urlObject = null;

        var m_preferentialList = null;
        //---------------事件定义----------------
        var evtFuncs = {
            /*jumpPage : function (ev) {
                var target = ev.target;
                var pNode = closest(target, "[node-name=movieShow]", node);
                if (pNode == null) {
                    return;
                }
                var url = appendQuery(dataList["seatUrl"], {
                    "showNo": pNode.getAttribute('data-show-no'),
                    "cardActId": pNode.getAttribute('data-cardActId')
                });
                webBridge.openUrl(url);
            },*/
            showPreferentialList: function(ev) {
                ev.stopPropagation();
                var target = ev.target;
                var pNode = closest(target, "[node-name=movieShow]", node);
                if (pNode == null) {
                    return;
                }
                var dataUrl = pNode.getAttribute("data-url");
                var dataStatus = pNode.getAttribute("data-status"); /*data-status = 0不需要弹框  1有三种优惠  2有两种优惠*/
                var preferenticalPrice = pNode.getAttribute("data-preferPrice");
                m_preferentialList.init({ "url": dataUrl, "prices": preferenticalPrice, "status": dataStatus });
                m_preferentialList.show();

            }

        };

        //---------------子模块定义---------------
        var modInit = function() {
            m_preferentialList = preferentialList('', {
                "title": "会员优惠",
                "OKText": " ",
                "OK": function() {}
            });
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            //touch.on(nodeList.list, 'tap', "[node-name=movieShow]", evtFuncs.jumpPage);
            if (!!nodeList.moviesContainer) {
                //touch.on(nodeList.moviesContainer, 'tap', "[node-name=num]", evtFuncs.showPreferentialList)
            }
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            showFilms: function(showList) {
                //console.log(showList);

                dataList = showList; /*此时会出现dataList = undefined 而 showList = ""*/
                var timeHtml = '';
                if (dataList != undefined && dataList != "" && dataList != null) {
                    custFuncs.loadCinemaShow(0);

                    var dateNow = new Date();
                    var curYear = dateNow.getFullYear();
                    var curMonth = dateNow.getMonth() + 1;
                    if (curMonth <= 9) {
                        curMonth = "0" + curMonth;
                    }
                    var curDate = dateNow.getDate();
                    if (curDate <= 9) {
                        curDate = "0" + curDate
                    }
                    var curDay = curYear + "-" + curMonth + "-" + curDate;
                    var curse = new Date(curDay);
                    var curSencod = curse.getTime() / 1000;

                    var weekList = dataList.weekList;

                    var weekNameObj = { '星期一': 0, '星期二': 1, '星期三': 2, '星期四': 3, '星期五': 4, '星期六': 5, '星期日': 6 };
                    var weekNameArr = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
                    each(weekList, function(item, index) {
                        var weekName = item.weekName;
                        var showDate = item.showDate;
                        /*1 先做跨年判断  通过月份判断
                         2 在用时间戳 判断“后天 预售”*/
                        var dateStr = showDate.match(/\d+/g);
                        var dateIntMonth = parseInt(dateStr[0]);
                        if (dateIntMonth >= curMonth) { // 未跨年
                            var day = curYear + "-" + dateStr[0] + "-" + dateStr[1];
                            var date = new Date(day);
                            var second = date.getTime() / 1000;
                            var difSecond = second - curSencod;
                            if (difSecond < 172800 && difSecond >= 86400) {
                                weekName = '明天';
                            }
                            if (difSecond < 259200 && difSecond >= 172800) {
                                weekName = '后天';
                            }
                            if (difSecond >= 259200) {
                                //weekName = '预售';
                                weekName = weekNameArr[weekNameObj[weekName]];
                            }
                        } else { // 跨年
                            curYear = curYear + 1;
                            var dayp = curYear + "-" + dateStr[0] + "-" + dateStr[1];
                            var datep = new Date(dayp);
                            var secondp = datep.getTime() / 1000;
                            var difSecondp = secondp - curSencod;
                            /*if (difSecondp <= 172800 && difSecondp >= 86400) {
                                weekName = '后天';
                            }*/
                            if (difSecondp < 172800 && difSecondp >= 86400) {
                                weekName = '明天';
                            }
                            if (difSecondp < 259200 && difSecondp >= 172800) {
                                weekName = '后天';
                            }

                            if (difSecondp >= 259200) {
                                //weekName = '预售';
                                weekName = weekNameArr[weekNameObj[weekName]];
                            }
                        }
                        /* var dateInt = 2;
                         if (dateInt == (curDate + 2)) {
                             weekName = '后天';
                         }
                         if (dateInt > (curDate + 2)) {
                             weekName = '预售';
                         }*/
                        var allTime = weekName + showDate;
                        /*if (index == 0) {
                            timeHtml += '<li class="swiper-slide" node-name="thumb">\
                                                <div class="link time-movie active">' + encodeHTML(allTime) + '</div>\
                                                <div class="line show" node-name="line"></div>\
                                             </li>';
                        } else {
                            timeHtml += '<li class="swiper-slide" node-name="thumb">\
                                                <div class="link time-movie">' + encodeHTML(allTime) + '</div>\
                                                <div class="line" node-name="line"></div>\
                                             </li>';
                        }*/
                        //debugger;
                        
                        console.log(showDate);
                        if (index == 0) {
                            if (item.isMerAct == 1) {
                                timeHtml += '<li class="swiper-slide" node-name="thumb">\
                                                <div class="link time-movie active">' + encodeHTML(allTime) + '<div class="icon-hui"></div></div>\
                                                <div class="line show" node-name="line"></div>\
                                             </li>';
                            } else {
                                timeHtml += '<li class="swiper-slide" node-name="thumb">\
                                                    <div class="link time-movie active">' + encodeHTML(allTime) + '</div>\
                                                    <div class="line show" node-name="line"></div>\
                                                 </li>';
                            }
                        } else {
                            if (item.isMerAct == 1) {
                                timeHtml += '<li class="swiper-slide" node-name="thumb">\
                                                <div class="link time-movie">' + encodeHTML(allTime) + '<div class="icon-hui"></div></div>\
                                                <div class="line" node-name="line"></div>\
                                             </li>';
                            } else {
                                timeHtml += '<li class="swiper-slide" node-name="thumb">\
                                                    <div class="link time-movie">' + encodeHTML(allTime) + '</div>\
                                                    <div class="line" node-name="line"></div>\
                                                 </li>';
                            }
                        }
                    });
                }

                /*每次绑定之前，先对原来的绑定销毁*/
                if (m_swiper) {
                    m_swiper.destroy(true, true);
                }

                if (timeHtml != '') {
                    nodeList.swiper.innerHTML = timeHtml;
                    nodeList = parseNode(node);
                }

                clickedIndex = 0;
                m_swiper = new swiper(".tabs", { /*这里是时间切换 下面的排期*/
                    "slidesPerView": 3,
                    "paginationClickable": true,
                    "spaceBetween": 0,
                    "touchMoveStopPropagation": false,
                    onTap: function(swiper, event) {
                        if (event.target.parentNode.tagName != 'LI') {
                            return;
                        }
                        if (swiper.clickedIndex == clickedIndex) {
                            return;
                        }

                        var oldIndex = clickedIndex;
                        clickedIndex = swiper.clickedIndex;
                        if (dataList != undefined && dataList != "" && dataList != null) { /*第一次不需要自己去绚烂页面*/
                            custFuncs.loadCinemaShow(clickedIndex); /*去切换排期展示*/
                            className.remove(nodeList.thumb[oldIndex].childNodes[1], "active");
                            className.remove(nodeList.thumb[oldIndex].childNodes[3], "show");
                            className.add(nodeList.thumb[clickedIndex].childNodes[1], "active");
                            className.add(nodeList.thumb[clickedIndex].childNodes[3], "show");
                        } else {
                            each(nodeList.showMovies, function(item, i) {
                                item.style.display = "none"
                            });
                            nodeList.showMovies[clickedIndex].style.display = "block";

                            className.remove(nodeList.thumb[oldIndex].childNodes[1], "active");
                            className.remove(nodeList.thumb[oldIndex].childNodes[3], "show");
                            className.add(nodeList.thumb[clickedIndex].childNodes[1], "active");
                            className.add(nodeList.thumb[clickedIndex].childNodes[3], "show");
                        }
                    }
                });
            },
            /* 加载选中天,排期展示 */
            loadCinemaShow: function(index) {
                /* 会员特惠 tip */
                if (!!nodeList.tips) {
                    (nodeList.tips).remove();
                }
                if (dataList.statusAct == 1) { //有会员特惠
                    var htmlTip = '<div class="tips" node-name="tips" data-url="' + dataList.reMarkUrl + '">\
                                <span class="special-deals">会员特惠</span>\
                                <span>' + dataList.ActRemark + '</span>\
                               </div>';
                    insertHTML(nodeList.listTime, htmlTip, "afterend");
                }
                /* 排期项的展示 */
                var currentShow = dataList["weekList"][index];

                /*console.log(urlObject.changeInfo.split(/\|/)[1]);
                console.log(dataList);
                console.log(queryToJson(URL.parse(dataList.seatUrl)["query"]).filmNo);
                console.log(currentShow);
                console.log(currentShow.shows);*/

                if (flags) {
                    /*each(nodeList.list, function(items, indexs) {
                        if (indexs != 0) {
                            items.parentNode.remove();
                        } else {
                            items.parentNode.setAttribute("data-day","");
                            items.parentNode.style.display = "block";
                        }
                    });*/
                    if (nodeList.list instanceof Array) {
                        each(nodeList.list, function(items, indexs) {
                            if (indexs != 0) {
                                items.parentNode.remove();
                            } else {
                                items.parentNode.setAttribute("data-day", "");
                                items.parentNode.style.display = "block";
                            }
                        });
                    } else {
                        nodeList.list.parentNode.setAttribute("data-day", "");
                        nodeList.list.parentNode.style.display = "block";
                    }

                    flags = false;
                }
                nodeList = parseNode(node);
                var items = currentShow.shows;
                /*              var weekNameSeat = currentShow.weekName;
                                var showDateSeat = currentShow.showDate;*/
                var moviesHtml = '';
                var AM = 600;
                var BM = 1800;
                var flagBm = true;
                var flagAm = true;

                each(items, function(item, index) {
                    //console.log(item);
                    var filmType = "";
                    var cardPerferentical = item.arrCardType;

                    /* 20161110 改版 */
                    //console.log(item);
                    var perferHtml = "";
                    /* 海洋会员 */
                    if (item.virtualUserPrice != 0) {
                        perferHtml = '<div class="discount">\
                                            <div class="label">海洋会员</div>\
                                            <div class="num" node-name="num">¥' + item.virtualUserPrice + '</div>\
                                       </div>';
                    } else {
                        if (item.oceanCardPrice != 0) {
                            perferHtml = '<div class="discount">\
                                                <div class="label">海洋会员</div>\
                                                <div class="num" node-name="num">¥' + item.oceanCardPrice + '</div>\
                                           </div>';
                        }
                    }
                    
                    /* 尊享卡 */
                    if (item.zunCardPrice != 0) {
                        perferHtml += '<div class="discount">\
                                            <div class="label">尊享卡</div>\
                                            <div class="num" node-name="num">¥' + item.zunCardPrice + '</div>\
                                       </div>';
                    }

                    /* 影城会员 */
                    if (item.userCardPrice != 0) {
                        perferHtml += '<div class="discount">\
                                            <div class="label">影城会员</div>\
                                            <div class="num" node-name="num">¥' + item.userCardPrice + '</div>\
                                       </div>';
                    }

                    /* 拼接会员特惠的价格情况 虚拟会员、影城会员、尊享卡*/
                    // var cardPerferentical = item.arrCardType;
                    // var perferHtml = '<div class="discount">\
                    //                         <div class="label">会员特惠</div>\
                    //                         <div class="num" node-name="num">' + cardPerferentical.memberPrice + '元起\
                    //                             <span class="icon-dropDown"></span>\
                    //                         </div>\
                    //                     </div>';
                    // if (cardPerferentical.statusPrice) { /*statusPrice 返回1 三种特惠同价*/
                    //     perferHtml = '<div class="discount">\
                    //                         <div class="label">会员特惠</div>\
                    //                         <div class="num" node-name="num">' + cardPerferentical.memberPrice + '\
                    //                             <span class="icon-dropDown"></span>\
                    //                         </div>\
                    //                     </div>';
                    // }

                    // if (cardPerferentical.statusMem == 2) { //statusMem返回 2 两种特惠的价格不一致  页面显示会员特惠
                    //     perferHtml = '<div class="discount">\
                    //                         <div class="label">会员特惠</div>\
                    //                         <div class="num" node-name="num">' + cardPerferentical.memberPrice + '元起\
                    //                             <span class="icon-dropDown"></span>\
                    //                         </div>\
                    //                     </div>';
                    // }

                    // if (!cardPerferentical.statusMem) { /*statusMem是否三种特惠都有 1 是 ，0 否    ,2两种特惠的价格不一致*/
                    //     var htmlPrice = '';
                    //     if (cardPerferentical.virtualUserPrice) { /*虚拟会员*/
                    //         htmlPrice += '<div class="discount">\
                    //                         <div class="label">虚拟会员</div>\
                    //                         <div class="num">' + cardPerferentical.virtualUserPrice + '</div>\
                    //                     </div>';
                    //     }
                    //     if (cardPerferentical.userCardPrice) { /*影城会员*/
                    //         htmlPrice += '<div class="discount">\
                    //                         <div class="label">影城会员</div>\
                    //                         <div class="num">' + cardPerferentical.userCardPrice + '</div>\
                    //                     </div>';
                    //     }
                    //     if (cardPerferentical.zunCardPrice) { /*尊享卡*/
                    //         htmlPrice += '<div class="discount">\
                    //                         <div class="label">尊享卡</div>\
                    //                         <div class="num">' + cardPerferentical.zunCardPrice + '</div>\
                    //                     </div>';
                    //     }
                    //     perferHtml = htmlPrice;
                    // }

                    

                    var price = parseFloat(item.price);
                    var CinemaPrice = parseFloat(item.CinemaPrice);
                    //退改签 调转地址后面添加参数
                    var jumpUrl = item.seatUrl;
                    if (!!urlObject.seatNum) {
                        jumpUrl = appendQuery(jumpUrl, {
                            "goods": urlObject['goods'],
                            "seatNum": urlObject['seatNum'],
                            "orderNoBackPrice": urlObject['orderNoBackPrice'],
                            "orderNo": urlObject['orderNo'],
                            "integralNum": urlObject['integralNum']
                        });
                    }

                    var moon = '<div class="moon">\
                                        <span class="line-left"></span>\
                                        <span class="middle">\
                                            <span class="sprite icon-movie-moon"></span>\
                                            <span class="middle-text">夜场</span>\
                                        </span>\
                                        <span class="line-right"></span>\
                                    </div>';
                    var sun = '<div class="sun">\
                                    <span class="line-left"></span>\
                                    <span class="middle">\
                                        <span class="sprite icon-movie-sun"></span>\
                                        <span class="middle-text">日场</span>\
                                    </span>\
                                    <span class="line-right"></span>\
                                </div>';

                    //添加海会员时添加  <div class="layout-4">' + perferHtml + '</div>\
                    var noneHtml = '<li class="movie-item" node-name="movieShow" data-status="' + cardPerferentical.statusMem + '" data-url="' + jumpUrl /*item.seatUrl*/ + '&isChange=' + opts["isChange"] + '&isBack=' + opts["isChange"] + '">\
                                        <div class="layout-1">\
                                            <div class="time">' + item.showTime + '</div>\
                                            <div class="end-time">' + item.showEndTime + '结束</div>\
                                        </div>\
                                        <div class="layout-2">\
                                            <div class="type">' + item.lang + '/' + item.showType + '</div>\
                                            <div class="place">' + item.hallName + '</div>\
                                            <div class="' + (item.surplusPercent > 30 ? "green-font" : item.surplusPercent == 0 ? "gray-font" : "red-font") + '">' + item.surplusSeatStr + '</div>\
                                        </div>\
                                        <div class="layout-4">' + perferHtml + '</div>\
                                        <div class="layout-3">\
                                            <div>\
                                                <div class="now-price"><span>¥</span>' + price + '</div>\
                                                <div class="market-price">挂牌价¥' + CinemaPrice + '</div>\
                                            </div>\
                                            <div class="sprite ico-back-s"></div>\
                                        </div>\
                                    </li>';

                    //非活动的 退改签置灰     <div class="layout-4">' + perferHtml + '</div>\  海洋会员时添加的
                    var noneHtmlGray = '<li class="movie-item setGray" node-name="movieShow" data-status="' + cardPerferentical.statusMem + '">\
                                            <div class="layout-1">\
                                                <div class="time">' + item.showTime + '</div>\
                                                <div class="end-time">' + item.showEndTime + '结束</div>\
                                            </div>\
                                            <div class="layout-2">\
                                                <div class="type">' + item.lang + '/' + item.showType + '</div>\
                                                <div class="place">' + item.hallName + '</div>\
                                                <div class="' + (item.surplusPercent > 30 ? "green-font" : item.surplusPercent == 0 ? "gray-font" : "red-font") + '">' + item.surplusSeatStr + '</div>\
                                            </div>\
                                            <div class="layout-4">' + perferHtml + '</div>\
                                            <div class="layout-3">\
                                                <div>\
                                                    <div class="now-price"><span>¥</span>' + price + '</div>\
                                                    <div class="market-price">挂牌价' + CinemaPrice + '</div>\
                                                </div>\
                                                <div class="sprite ico-back-s"></div>\
                                        </li>';

                    var noneHtmlHy = '<li class="movie-item" node-name="movieShow" data-status="' + cardPerferentical.statusMem + '" data-preferPrice="' + item.arrCardType.virtualUserPrice + ',' + item.arrCardType.userCardPrice + ',' + item.arrCardType.zunCardPrice + '" data-url="' + jumpUrl /*item.seatUrl*/ + '&isChange=' + opts["isChange"] + '&isBack=' + opts["isChange"] + '">\
                                        <div class="layout-1">\
                                            <div class="time">' + item.showTime + '</div>\
                                            <div class="end-time">' + item.showEndTime + '结束</div>\
                                        </div>\
                                        <div class="layout-2">\
                                            <div class="type">' + item.lang + '/' + item.showType + '</div>\
                                            <div class="place">' + item.hallName + '</div>\
                                            <div class="' + (item.surplusPercent > 30 ? "green-font" : item.surplusPercent == 0 ? "gray-font" : "red-font") + '">' + item.surplusSeatStr + '</div>\
                                        </div>\
                                        <div class="layout-4">' + perferHtml + '</div>\
                                        <div class="layout-3">\
                                            <div>\
                                                <div class="now-price"><span>¥</span>' + price + '</div>\
                                                <div class="market-price">挂牌价¥' + CinemaPrice + '</div>\
                                            </div>\
                                            <div class="sprite ico-back-s"></div>\
                                        </div>\
                                    </li>';

                    /*var moonHtml = moon + noneHtml;
                    var moonHtmlHy = moon + noneHtmlHy;
                    var sunHtml = sun + noneHtml;
                    var sunHtmlHy = sun + noneHtmlHy;*/
                    var moonHtml = moon + noneHtml;
                    var moonHtmlGray = moon + noneHtmlGray;
                    var moonHtmlHy = moon + noneHtmlHy;

                    var sunHtml = sun + noneHtml;
                    var sunHtmlGray = sun + noneHtmlGray;
                    var sunHtmlHy = sun + noneHtmlHy;

                    var bgTime = parseInt(item["showTime"].substr(0, item["showTime"].indexOf(":")) + item["showTime"].substr(item["showTime"].indexOf(":") + 1, item["showTime"].length));

                    //非活动的退改签 逻辑
                    var changeTicketDate = null;
                    if (!!urlObject.changeInfo) { //区别是 退改签进入 还是主流程进入排期
                        changeTicketDate = urlObject.changeInfo.split(/\|/);
                    }

                    //dataList 某个影院某个影片所有信息
                    //dataList.seatUrl 获得某个影院某个影片地址
                    //item 最小排期单元
                    var filmObject = queryToJson(URL.parse(dataList.seatUrl)["query"]);
                    //找到需要改签的票
                    //if (filmObject.filmNo == changeTicketDate[0] && item.showNo.indexOf(changeTicketDate[1]) != -1) {}
                    if (index == 0) {
                        if (AM <= bgTime && bgTime <= BM) {
                            //太阳
                            if (item.isActShow != 0) {
                                moviesHtml += sunHtmlHy;
                            } else {
                                //item.showNo.indexOf(changeTicketDate[2]) != -1  或者 filmObject.cinemaNo == changeTicketDate[2] 都可以
                                if (changeTicketDate != null && filmObject.filmNo == changeTicketDate[0] && item.showNo.indexOf(changeTicketDate[2]) != -1 && item.showNo.indexOf(changeTicketDate[1]) != -1) { //找到需要改签的票
                                    moviesHtml += sunHtmlGray;
                                } else {
                                    moviesHtml += sunHtml;
                                }
                            }
                            flagAm = false;
                        } else {
                            //月亮
                            if (item.isActShow != 0) {
                                moviesHtml += moonHtmlHy;
                            } else {
                                if (changeTicketDate != null && filmObject.filmNo == changeTicketDate[0] && item.showNo.indexOf(changeTicketDate[2]) != -1 && item.showNo.indexOf(changeTicketDate[1]) != -1) {
                                    moviesHtml += moonHtmlGray;
                                } else {
                                    moviesHtml += moonHtml;
                                }
                            }
                            flagBm = false;
                        }
                    } else {
                        if (flagAm && AM <= bgTime && bgTime <= BM) {
                            //太阳
                            if (item.isActShow != 0) {
                                moviesHtml += sunHtmlHy;
                            } else {
                                if (changeTicketDate != null && filmObject.filmNo == changeTicketDate[0] && item.showNo.indexOf(changeTicketDate[2]) != -1 && item.showNo.indexOf(changeTicketDate[1]) != -1) { //找到需要改签的票
                                    moviesHtml += sunHtmlGray;
                                } else {
                                    moviesHtml += sunHtml;
                                }
                            }
                            flagAm = false;
                            flagBm = true; //月亮 又满足条件了
                        } else if (flagBm && (bgTime > BM || bgTime < AM)) {
                            //月亮
                            if (item.isActShow != 0) {
                                moviesHtml += moonHtmlHy;
                            } else {
                                if (changeTicketDate != null && filmObject.filmNo == changeTicketDate[0] && item.showNo.indexOf(changeTicketDate[2]) != -1 && item.showNo.indexOf(changeTicketDate[1]) != -1) {
                                    moviesHtml += moonHtmlGray;
                                } else {
                                    moviesHtml += moonHtml;
                                }
                            }
                            flagBm = false;
                            flagAm = true; //太阳 又满足条件了
                        } else {
                            if (item.isActShow != 0) {
                                moviesHtml += noneHtmlHy;
                            } else {
                                if (changeTicketDate != null && filmObject.filmNo == changeTicketDate[0] && item.showNo.indexOf(changeTicketDate[2]) != -1 && item.showNo.indexOf(changeTicketDate[1]) != -1) {
                                    moviesHtml += noneHtmlGray;
                                } else {
                                    moviesHtml += noneHtml;
                                }
                            }
                        }
                    }
                });
                nodeList.list.innerHTML = moviesHtml;
                nodeList = parseNode(node);
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;

            //urlObject = opts.url;
            urlObject = queryToJson(URL.parse(location.href)["query"]);

            custFuncs.showFilms();
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.showFilms = custFuncs.showFilms;

        return that;
    }
});