/**
 * 购票首页
 * 包含两个页面：影片列表以及影院列表
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var webBridge = require("sea/webBridge");
    var slideNav = require("sea/slideNav");
    var tabNav = require("sea/tabNav");//兼容旧版
    var swiper = require("swiper");
    var virtualLink = require("lib/util/virtualLink");
    var storageMessager = require("lib/evt/storageMessager");
    var movieSlide = require("sea/buyTicket/movieSlide");
    var parseNode = require("lib/dom/parseNode");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_movieSlideNav = null;
    var m_movieSlide = null;
    var m_pageSwiper = null;

    //---------------事件定义----------------
    var evtFuncs = {
        headerSlideTap: function(ev) {
            m_pageSwiper.slideTo(ev.data);
            var nodeMovieSlide = parseNode(nodeList.movieSlide);
            if(ev.data == 0) {
                nodeMovieSlide.futureList.style.overflow = "auto";
            }else{
                nodeMovieSlide.futureList.style.overflow = "hidden";
            }
        },


        movieSlideTap: function(ev) {
            m_movieSlide.movieSlideTo(ev.data);
        },
        slideShiftType: function(ev) {
            m_movieSlideNav.slideShift(ev.data);
            webBridge.changeBuyTicketType(0);

            m_header.toMovie();
        },
        slideChange: function (ev) {
            m_movieSlideNav.slideShift(ev.data.index+1);
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        if(nodeList.header) {
            m_header = tabNav(nodeList.header, {
                count: 2
            });
            m_header.init();
        }

        virtualLink('data-url');

        m_movieSlideNav = slideNav(nodeList.movieSlideNav, {
            count: 2
        });
        m_movieSlideNav.init();

        m_movieSlide = movieSlide(nodeList.movieSlide, opts);
        m_movieSlide.init();

        m_pageSwiper = swiper(".m-page-swiper", {
            "noSwiping": true,
            "speed": 500,
            "swipeHandler": ".tabs",
            "autoHeight":true
        });

    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
       if(nodeList.header) {
           m_header.bind("switchTab", evtFuncs.headerSlideTap);
       }

        m_movieSlideNav.bind("switchTab", evtFuncs.movieSlideTap);/*热映即将上映滑块的滑动*/

        storageMessager.bind("changeType", evtFuncs.slideShiftType);
        storageMessager.bind('selectedCityChanged', webBridge.reload);
        m_movieSlide.bind("slideChange",evtFuncs.slideChange);
       /*影院影片切换保留方法给app*/
        if(nodeList.header) {
            m_header.toMovie();
            webBridge.changeBuyTicketType(0);
        }
        webBridge.switchFilmCinema= function (data) {
            //alert(data["selectedSegmentIndex"]);
            m_pageSwiper.slideTo(data["selectedSegmentIndex"]);
            var nodeMovieSlide = parseNode(nodeList.movieSlide);
            if(data["selectedSegmentIndex"]=='0') {
                nodeMovieSlide.futureList.style.overflow = "auto";
            }else{
                nodeMovieSlide.futureList.style.overflow = "hidden";
            }
        }
    }

    //-----------------自定义函数-------------
    var custFuncs = {
        shift: function () {
            var number = localStorage.getItem("indexToBuyTicketPage");
            webBridge.updateBuyTicketInterfaceIfNecessary();//通知万珂sb js加载好了
            localStorage.removeItem("indexToBuyTicketPage");
            if (number != null) {
                m_movieSlideNav.slideShift(number);
            }
        }
    }

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts;

        nodeList = {
            header: queryNode("#m_header"),
            pageSwiper: queryNode("#m_pageSwiper"),
            movieSlideNav: queryNode("#m_movieSlideNav"),
            movieSlide: queryNode("#m_movieSlide"),
            cinemaSlide: queryNode("#m_cinemaSlide")
        };
        modInit();
        bindEvents();
        custFuncs.shift();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});