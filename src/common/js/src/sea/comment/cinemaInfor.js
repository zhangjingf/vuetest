/**
 * 修改影院
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var getPosition = require("lib/dom/getPosition"); 
    var className = require("lib/dom/className");
    var modal = require("sea/dialog/modals");
    var merge = require("lib/json/merge");
    var each = require("lib/util/each");
    var ajax = require("lib/io/ajax");
    var toast = require("sea/toast");
    var touch = require("touch");
    var swiper = require("swiper");
    //---------- require end -------------
    var TMPL = '<div class="layout1">\
                    <div class="cancel" node-name="cancel">取消</div>\
                    <div class="confrim" node-name="confrim">确定</div>\
                </div>\
                <div class="layout2">\
                    <div class="swiper-container" node-name="cinemaInfor"><ul class="swiper-wrapper" node-name="cinemalist">\
                    </ul></div>\
                </div>';
                
    return function(opts) {
        var that = modal();

        opts = merge({
            "cancel": function() {}
        }, opts || {});

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var node = null;
        var m_swiper = null;
        var chooseTxt = null;
        var superMethod = {
            init: that.init
        };

        //---------------事件定义----------------
        var evtFuncs = {
            "cancel": function(ev) {
                opts["cancel"]();
                that.hide("cancel");
                that.fire("cinemaMsg", "请选择");
            },
            "confrim": function() {
                that.hide();
                custFuncs.initView();
                that.fire("cinemaMsg", chooseTxt);
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
            m_swiper = new swiper(nodeList.cinemaInfor,{
                    direction: "vertical",
                    slidesPerView: 7,
                    spaceBetween: 0,
                    centeredSlides: true,
                    slideToClickedSlide: true,
                    slideActiveClass: 'centerslide',
                    loopAdditionalSlides: 7,
                    observer: true,
                    observeParents: true,
                    onSlideChangeStart: function(ev) {
                        custFuncs.clearStyle();
                        custFuncs.initView();
                    }
                })
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.cancel, "tap", evtFuncs.cancel);
            touch.on(nodeList.confrim, "tap", evtFuncs.confrim);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            cinemaInfor :function() {
                ajax({
                    "url": opts["getcinemas"],
                    "method": "post",
                    "onSuccess": function (res) {
                        that.unLock();
                        if( res["status"] == 0) {
                            toast(res["msg"]);
                            return ;
                        }
                        each(res["data"], function(item){
                            var area =  item["areaAllName"].split("-")[1].split("");
                            nodeList.cinemalist.innerHTML += '<li class="swiper-slide" ><div>' + area[0] + area[1] + '</div><div data-cinemaNo="' + item["cinemaNo"] + '">' + item["cinemaName"] + '</div></li>';
                        });
                    },
                    "onError": function (res) {
                        console.error("网络连接失败(" + res.status + ")");
                        that.unLock();
                    }
                })
            },
            clearStyle: function() {
                each(nodeList.cinemalist.children, function(item) {
                    className.remove(item, "action1");
                    className.remove(item, "action2");
                });
            },
            initView: function() {
                each(nodeList.cinemalist.children, function(item) {
                    if(className.has(item, "swiper-slide-prev")) {
                        if(item.previousElementSibling) {
                           className.add(item.previousElementSibling, "action1");
                           if(item.previousElementSibling.previousElementSibling) {
                               className.add(item.previousElementSibling.previousElementSibling, "action2");
                            }
                        }  
                    }
                    if(className.has(item, "swiper-slide-next")) {
                        if(item.nextElementSibling) {
                           className.add(item.nextElementSibling, "action1");
                           if(item.nextElementSibling.nextElementSibling) {
                                className.add(item.nextElementSibling.nextElementSibling, "action2");
                            }
                       }
                    }
                    if(className.has(item, "centerslide")) {
                        chooseTxt = item.children[1];
                    }
                });
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-mode-cinema";
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
            custFuncs.cinemaInfor();
            custFuncs.initView();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        return that;
    }
});