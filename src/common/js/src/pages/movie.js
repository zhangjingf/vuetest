/**
 * 影片和排期选择页面,页面控制器
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var header = require("sea/header");
    var movieSummary = require("sea/movie/movieSummary");
    var storageMessager = require("lib/evt/storageMessager");
    var hotFilms = require("sea/movie/hotFilms");
    var webBridge = require("sea/webBridge");
    var ajax = require("lib/io/ajax");
    var touch = require("touch");
    var showMessage  = require("sea/showMessage");
    var queryToJson = require("lib/json/queryToJson");
    var URL = require("lib/util/URL");
    var alert = require("sea/dialog/alert");
    var virtualLink = require("lib/util/virtualLink");
    var flexBoxRefresh = require("sea/flexBoxRefresh");
    var timeSwiper = require("sea/movie/timeSwiper");
    //var movieVirtualLink = require("sea/movie/movieVirtualLink");
    var util = require("sea/utils");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var m_header = null;
    var m_hotFilms = null;
    var m_flexBoxRefresh = null;
    var m_movieSummary = null;
    var m_timeSwiper = null;
    var opts = null;

    var url = null;

    //---------------事件定义----------------
    var evtFuncs = {
        hotFilmsChange: function(ev) {
            var param = {
                "filmNo": ev.data.filmNo,
                "cName": ev.data.cName,
                "averageDegree": ev.data.averageDegree
            };
            custFuncs.loadFilesData(param);
        },

        back: function () {
            if(url["from"] == "payOrder") {
                webBridge.close(1);
            }else  {
                webBridge.close();
            }
        },
        reload: function () {
            webBridge.openUrl(util.getCurrentURL(),'self');
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }


        m_hotFilms = hotFilms(nodeList.hotFilms, opts);
        m_hotFilms.init();

        m_movieSummary = movieSummary(nodeList.movieSummary, opts);
        m_movieSummary.init();

        m_timeSwiper = timeSwiper(nodeList.timeSwiper, opts);
        m_timeSwiper.init();

        m_flexBoxRefresh = flexBoxRefresh(nodeList.pbd,{'atTheTop':custFuncs.atTheTop,'leaveTheTop':custFuncs.leaveTheTop});
        m_flexBoxRefresh.init();

        virtualLink('data-url');

       /* movieVirtualLink('data-url',"[node-name='moviesContainer']",opts["url"]);*/
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        m_hotFilms.bind("change", evtFuncs.hotFilmsChange);
        storageMessager.bind("userChanged", evtFuncs.reload);//登录刷新页面

        if(!nodeList.header) {
            webBridge.onBackPressed = function () {
                evtFuncs.back();
                var isIPhone = navigator.appVersion.match(/iphone/gi);
                if (isIPhone) {
                    return "turnBackSucceed";
                }
            }
        }
    }

    //-----------------自定义函数-------------
    var custFuncs = {
        loadFilesData: function (param) {
            /*a)cinemaNo:影院编号
             b)filmNo:影片编号*/
            //console.log((new Date()).getTime());
            ajax({
                "url": opts["filmsShowUrl"]+"&cinemaNo="+opts["cinemaNo"]+"&filmNo="+param["filmNo"],
                "onSuccess": function(res) {
                    //console.log((new Date()).getTime());
                    if (res["status"] == 0) {
                        console.error( res["msg"]);
                        showMessage(res["msg"]);
                        return;
                    }
                    /*影片详情*/
                    var para = {
                        "score": param["averageDegree"],
                        "name": param["cName"],
                        "url": res["data"]["filmUrl"]
                    };
                    m_movieSummary.updateView(para);
                    /*修改排期*/
                    m_timeSwiper.showFilms(res["data"],param["filmNo"]);//res["data"]["weekList"]
                },
                "onError": function(req) {
                    console.error("网络连接失败:" + req.status);
                }
            });
        },
        userTip: function () {
            if (opts.filmStatus == 0) {/*该影院没有排期*/
                var myControl = {
                    "OK": function() {
                        webBridge.close();
                    }
                };
                var dialog = alert("该影院没有排期,请重新选择!", myControl);
                dialog.init();
                dialog.show();
            }
        },
        atTheTop: function () {
            webBridge.flexBoxRefresh({atTheTop:'1'});
            m_flexBoxRefresh.work();
        },
        leaveTheTop: function () {
            webBridge.flexBoxRefresh({atTheTop:'0'});
            m_flexBoxRefresh.work();
        }
    }

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts;
        opts.url = queryToJson(URL.parse(location.href)["query"]);
        nodeList = {
            pbd : queryNode('#m_pbd'),
            header : queryNode('#m_header'),
            hotFilms: queryNode("#m_hotFilms"),
            movieSummary: queryNode("#m_movieSummary"),
            timeSwiper: queryNode("#m_timeSwiper")
        };
        modInit();
        bindEvents();
        custFuncs.userTip();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});