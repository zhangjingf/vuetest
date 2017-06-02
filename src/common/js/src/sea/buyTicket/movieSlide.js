/**
 *  影片列表
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var swiper = require("swiper");
    var scrollMonitor = require("lib/dom/scrollMonitor");
    var touch = require("touch");
    var closest = require("lib/dom/closest");
    var confirm = require("sea/dialog/confirm");
    var ajax = require("lib/io/ajax");
    var showMessage = require("sea/showMessage");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_movieMonitor = null;
        var m_futureMonitor = null;
        var movieSwiper = null;

        //---------------事件定义----------------
        var evtFuncs = {
            monitorChange: function(list, monitor) {
                for (var i = 0; i < list.length; i++) {
                    list[i].src = list[i].getAttribute("data-src");
                    list[i].removeAttribute("data-src");
                }

                if (list.length == 0) {
                    monitor.disable();
                }
            },
            like: function (ev) {
                console.log("1111")
                ev.stopPropagation();
                var likeNode = closest(ev.target, "[node-name]", node);
                var filmNo = likeNode.getAttribute("data-filmNo");
                    if(opts["isLogin"] !="1") {
                        var dialog = confirm("未登录,去登录吗？",{
                            "OK": function() {
                                webBridge.openUrl(opts["loginUrl"]);
                            }
                        });
                        dialog.init();
                        dialog.show();
                    } else {
                        if (likeNode.firstChild.classList.contains("icon-film-heart-full2")) {
                            showMessage('您已经点击过了');
                            return;
                        }
                        if(that.isLock()) {
                            return;
                        }
                        that.lock();
                        ajax({
                            "url": opts["supportUrl"]+"&filmNo="+filmNo+"&actionType=3&status=0",
                            "onSuccess": function(res) {
                                that.unLock();
                                if (res["status"] != "1") {
                                    showMessage(res["msg"]);
                                    return;
                                }
                                likeNode.firstChild.classList.remove("icon-film-heart2");
                                likeNode.firstChild.classList.add("icon-film-heart-full2");
                            },
                            "onError": function (req) {
                                that.unLock();
                                console.log("网络连接失败: " + req.status);
                            }
                        });
                    }
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
            m_movieMonitor = scrollMonitor(nodeList.movieList, {
                "selector": "[data-src]",
                "change": evtFuncs.monitorChange
            });

            m_futureMonitor = scrollMonitor(nodeList.futureList, {
                "selector": "[data-src]",
                "change": evtFuncs.monitorChange
            });
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            if(!!nodeList.like){
                touch.on(nodeList.like,"tap",evtFuncs.like);
            }
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            initView: function() {
                m_movieMonitor.init();
                m_futureMonitor.init();
                movieSwiper = swiper(".m-movie-list", {
                    "speed": 400,
                    "touchMoveStopPropagation": false,
                    "autoHeight":true,
                    "onSlideChangeStart": function () {
                        that.fire("slideChange", {
                            "index": movieSwiper.activeIndex
                        });
                    }
                });
            },
            movieSlideTo: function (index) {
                movieSwiper.slideTo(index);
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
            custFuncs.initView();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.movieSlideTo = custFuncs.movieSlideTo;

        return that;
    }
});