/**
 * 首页签到提示框
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var insertNode = require("lib/dom/insertNode");
    var modal = require("lib/layer/modal");
    var merge = require("lib/json/merge");
    var touch = require("touch");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------
    var TMPL = '<div class="active-dialog" id="dialog">\
                     <span class="sprite icon-active-close" node-name="closeBtn"></span>\
                     <div class="active-box" node-name = "activePic"><!--<img src="" alt="activeTell" node-name="imgPic"/>--></div>\
                </div>';
    return function (content, opts) {
        var that = modal({showAnimate: function(layer, handler){
            handler();
            // console.log("奔溃");
            // console.log(node);//m-mode-active
            // console.log(node.offsetHeight);
            
        }});
        opts = merge({
            "time": null,
            "url": null
        }, opts || {});
        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var node = null;
        var superMethod = {
            init: that.init
        };

        //---------------事件定义----------------
        var evtFuncs = {
            "closeDialog" : function (ev) {
                document.querySelector('body').style.cssText = "overflow: scroll;";
                that.hide();
                //window.localStorage.setItem("sign", (custFuncs.dateCur())+"1");
            },
            "activeDetail": function (ev) {
                document.querySelector('body').style.cssText = "overflow: scroll;";
                console.log(data.jumpUrl);
                if (data.jumpUrl != "") {
                    webBridge.openUrl(data.jumpUrl, "blank");
                }
                that.hide();
            }
            // ,
            // "ok": function () {
            //     document.querySelector('body').style.cssText = "overflow: scroll;";
            //     that.hide();
            //     window.localStorage.setItem("sign", (custFuncs.dateCur())+"1");
            //     webBridge.openUrl(opts["goSign"], "blank");//"/xfk/web/index.php?r=signin/index"
            //     //webBridge.openUrl(data["zqFestivalApi"], "blank");
            //     ///xfk/web/index.php?r=signin/index&_target=blank
            // },
            // cancel: function () {
            //     document.querySelector('body').style.cssText = "overflow: scroll;";
            //     that.hide();
            //     window.localStorage.setItem("sign", '1000');
            //     //webBridge.openUrl(data["zqFestivalApi"], "blank");
            //     ///xfk/web/index.php?r=signin/index&_target=blank
            // }

        }

        //---------------子模块定义---------------
        var modInit = function () {}

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.closeBtn, "tap", evtFuncs.closeDialog);
            touch.on(nodeList.activePic, "tap", evtFuncs.activeDetail);
            touch.on(that.getMask().getOuter(), "tap", evtFuncs.closeDialog);
            //touch.on(nodeList.ok, "tap", evtFuncs.ok);
            //touch.on(nodeList.cancel, "tap", evtFuncs.cancel);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            "dateCur": function () {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth()+1;
                var day = date.getDate();
                return ""+year+month+day;
            },
            /**
             * 获得图片的大小
             * @return {[type]} [description]
             */
            "imgSize": function (src) {
                var Img = new Image();
                // Img.src = 'http://yx.mopon.cn:8654/Upload/FilmPic/220-172.jpg';
                Img.src = src;
                Img.setAttribute("node-name", "imgPic");
                Img.onload = function () {
                    console.log(Img.complete);
                    if (Img.complete) {
                        //console.log(Img.width);
                        //console.log(Img.height);
                        var constW = 500;
                        var constH = 840;
                        if (navigator.appVersion.match(/android/gi)) {
                            constW = 250;
                            constH = 420;
                        }

                        if (Img.width >= constW) {
                            nodeList.activePic.style.width = constW+"px";
                            console.log(Img.width);
                        } else if (Img.height >= constH) {
                            nodeList.activePic.style.width = constH+"px";
                        }
                        //document.body.appendChild(Img);
                        insertNode(nodeList.activePic, Img, "afterbegin");
                    }
                    that.fire("showCommerceDialog");
                }
            }
        }

//-----------------初始化----------------
        var init = function (_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-mode-active";
            nodeList = parseNode(node);
            data = _data;
//debugger;
            custFuncs.imgSize(data.imgUrl);
            //nodeList.imgPic.src = data.imgUrl;

            modInit();
            bindEvents();
        }

//-----------------暴露各种方法-----------
        that.init = init;
        //that.show = custFuncs.show;

        return that;
    }
});