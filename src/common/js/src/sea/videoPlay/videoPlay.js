/**
 * 视屏播放模块
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var header = require("sea/videoPlay/header");
    var webBridge = require("sea/webBridge");
    var className = require("lib/dom/className");
    var alert = require("sea/dialog/alert");
    var confirm = require("sea/dialog/confirm");
    var showMessage = require("sea/showMessage");
    var loading = require("sea/dialog/loading");
    var touch = require("touch");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_header = null;
        var setTimeControl = null;
        var progressFlag = null;
        var tipConfirm = 1;/*1 要弹提示框, 0 不要弹提示框*/
        var repeatflag = null;
        var m_loading = null;

        //var androidLoadinglag = false;
        var outTime = null;

        //---------------事件定义----------------
        var evtFuncs = {
            showConsoleTitle: function () {
                nodeList.video.controls = false;
                if (!!nodeList.header) {
                    nodeList.header.style.display = "block";
                }
                nodeList.console.style.display = "block";
                clearTimeout(setTimeControl);
                webBridge.videoPlayTitleShow({"timing": 5000});
                setTimeControl = setTimeout(function(){
                    nodeList.video.controls = false;
                    nodeList.console.style.display = "none";
                    if (!!nodeList.header) {
                        nodeList.header.style.display = "none";
                    }
                }, 5000);
            },
            play: function () {
                /*前面的提示点成了"取消"，这里又点击播放了。肯定还要检测一下网络*/
                /*console.log(sessionStorage.getItem("tipConfirm") == null ? tipConfirm : sessionStorage.getItem("tipConfirm"));
                if (sessionStorage.getItem("tipConfirm") == null ? tipConfirm : sessionStorage.getItem("tipConfirm")) {
                    showMessage(2222222);
                    webBridge.networkStatusChanged("", function (res){
                        custFuncs.networkStatus(res);
                    })
                }*/
                custFuncs.play();
            },
            videoSeek: function (e) {
                custFuncs.videoSeek(e.detail.originEvent.changedTouches[0].pageX);
            }

        };

        //---------------子模块定义---------------
        var modInit = function() {
            if (!!nodeList.header) {
                m_header = header(nodeList.header, opts);
                m_header.init();
            }
            m_loading = loading();
            m_loading.init();
            m_loading.keepMiddle();
        };

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.video, "tap", evtFuncs.showConsoleTitle);
            touch.on(nodeList.controlPlay, "tap", evtFuncs.play);
            touch.on(nodeList.bigStar, "tap", evtFuncs.play);
            touch.on(nodeList.itemProgress, "tap", evtFuncs.videoSeek);
            webBridge.tellPageNetworkStatus = function (res) {
                res = JSON.parse(res);
                if (sessionStorage.getItem("tipConfirm") != null) {
                    tipConfirm = sessionStorage.getItem("tipConfirm");  /*第二次怎么会让视频变得很卡？？？*/
                }
                custFuncs.networkStatus(res);
            };
            webBridge.androidVideoPlay = function (res) {
                /*res = JSON.parse(res);
                androidLoadinglag = res["flag"];*/
                if (!( nodeList.video.paused || nodeList.video.ended )) {
                    custFuncs.play();
                }
            };

        };

        //-----------------自定义函数-------------
        var custFuncs = {
            /*初始化视频的状态*/
            init: function () {
                //初始化控制台
                m_loading.show();
                custFuncs.setConsoleStatus();
                //检测视频及网络 主要是检测影片地址和影片格式
                try{
                    //if(isNaN(nodeList.video.duration) || nodeList.video.duration <= 0){/*资源路劲或资源格式不对????*/}
                    var videoType = nodeList.source.src.split(/\./)[nodeList.source.src.split(/\./).length -1];
                    var mediaError = nodeList.video.error;
                    if ((mediaError != null && mediaError.code != 1) || nodeList.video.networkState == 3 || nodeList.video.canPlayType("video/"+videoType) == "") {
                    /*Media.networkState; //0.此元素未初始化 1.正常但没有使用网络 2.正在下载数据 3.没有找到资源   MediaError {code: 2}*/
                    /*Media.error.code; //1.用户终止 2.网络错误 3.解码错误 4.URL无效*/
                    /*canPlayType() 判断资源格式是否可以播放*/
                        var m_alert = alert("亲!系统获取不到视频,请稍后重试...",{
                            "title": "温馨提示",
                            "OKText": "我知道了",
                            "OK": function() {
                                webBridge.close();
                            }
                        });
                        m_alert.init();
                        m_alert.show();
                        /*switch (mediaError.code){
                         case (1):
                         //用户终止
                         break;
                         case (2):
                         //网络错误
                         break;
                         case (3):
                         //解码错误
                         break;
                         case (4):
                         //URL无效
                         break;
                         }*/
                        return ;
                    }
                }catch(e){
                    console.log(e.message);
                }
                //检测网络
                webBridge.networkStatusChanged("", function (res){
                    if (sessionStorage.getItem("tipConfirm") != null) {
                        tipConfirm = sessionStorage.getItem("tipConfirm");
                    }
                    custFuncs.networkStatus(res);
                });

            },
            /* 初始化控制台 */
            setConsoleStatus: function () {
                if (isNaN(nodeList.video.duration)) {//等待资源过来
                    setTimeout(custFuncs.setConsoleStatus, 50);
                    return;
                }
                nodeList.video.controls = false;
                nodeList.console.style.display = "block";
                webBridge.videoPlayTitleShow({"timing": 5000});
                setTimeout(function () {
                    nodeList.video.controls = false;
                    nodeList.console.style.display = "none";
                    if (nodeList.header) {
                        nodeList.header.style.display = "none";
                    }
                }, 5000);
                //显示播放时间
                nodeList.currentTime.innerHTML = "00:00";
                var minute = parseInt(parseInt(nodeList.video.duration) / 60);
                var second = parseInt(nodeList.video.duration) % 60 ;
                if (minute <= 9) {
                    minute = "0"+minute;
                }
                if (second <= 9) {
                    second = "0"+second;
                }
                nodeList.endTime.innerHTML = minute+":"+second;
                m_loading.hide();
                className.remove(nodeList.bigStar, "hidden");
                if (className.has(nodeList.controlPlay, "stop")) {
                    className.add(nodeList.bigStar, "hidden");
                }
            },

            // 控制video的播放
            play: function (){
                if ( nodeList.video.paused || nodeList.video.ended ){
                    if ( nodeList.video.ended ){
                        nodeList.video.currentTime = 0;
                    }
                    nodeList.video.play();

                    //playBtn.innerHTML = "暂停";
                    if (className.has(nodeList.controlPlay, "star")) {
                        className.remove(nodeList.controlPlay, "star");
                        className.add(nodeList.controlPlay, "stop");
                        className.add(nodeList.bigStar, "hidden");
                    } else {
                        className.add(nodeList.controlPlay, "stop");
                        className.add(nodeList.bigStar, "hidden");
                    }

                    progressFlag = setInterval(custFuncs.getProgress, 60);

                    /*if (androidLoadinglag) {
                        m_loading.show();
                    }*/
                } else{
                    nodeList.video.pause();
                    //保存停止的时间
                    outTime = nodeList.video.currentTime;
                    //playBtn.innerHTML = "播放";
                    if (className.has(nodeList.controlPlay, "stop")) {
                        className.remove(nodeList.controlPlay, "stop");
                        className.remove(nodeList.bigStar, "hidden");
                        className.add(nodeList.controlPlay, "star");
                    } else {
                        className.add(nodeList.controlPlay, "star");
                    }

                    clearInterval(progressFlag);
                }
            },
            //video的播放条
            getProgress: function (){
                var percent = nodeList.video.currentTime / nodeList.video.duration;
                nodeList.playProgress.style.width = percent * (nodeList.itemProgress.offsetWidth)  + "px";
                nodeList.roundness.style.position = "absolute";
                nodeList.roundness.style.left = percent * (nodeList.itemProgress.offsetWidth) + nodeList.currentTime.offsetWidth - 10 + "px";

                var minute = parseInt(parseInt(nodeList.video.currentTime) / 60);
                var second = parseInt(nodeList.video.currentTime) % 60 ;
                if (minute <= 9) {
                    minute = "0"+minute;
                }
                if (second <= 9) {
                    second = "0"+second;
                }
                nodeList.currentTime.innerHTML = minute+":"+second;

                /*if (androidLoadinglag && (nodeList.video.currentTime >= outTime + 0.1)) {
                    m_loading.hide();
                    androidLoadinglag = false;
                }*/
                //showProgress.innerHTML = (percent * 100).toFixed(1) + "%";

                //video的预加载进度
                var percentPre = nodeList.video.buffered.end(0) / nodeList.video.duration;
                nodeList.uploadProgress.style.width = percentPre * (nodeList.itemProgress.offsetWidth)  + "px";

                //如果播放结束 置初值
                if (nodeList.video.duration == nodeList.video.currentTime) {
                    nodeList.video.pause();
                    if (className.has(nodeList.controlPlay, "stop")) {
                        className.remove(nodeList.controlPlay, "stop");
                        className.remove(nodeList.bigStar, "hidden");
                        className.add(nodeList.controlPlay, "star");
                    } else {
                        className.add(nodeList.controlPlay, "star");
                    }
                    clearInterval(progressFlag);

                    nodeList.roundness.style.position = "absolute";
                    nodeList.roundness.style.left = nodeList.currentTime.offsetWidth - 10 + "px";
                    nodeList.playProgress.style.width = 0;
                }
            },
            // 鼠标在播放条上点击时进行捕获并进行处理
            videoSeek: function (y){
                if(nodeList.video.paused || nodeList.video.ended){
                    custFuncs.play();
                    custFuncs.enhanceVideoSeek(y);
                }
                else{
                    custFuncs.enhanceVideoSeek(y);
                }

            },
            enhanceVideoSeek: function (y){
                clearInterval(progressFlag);
                var length = y - nodeList.currentTime.offsetWidth - nodeList.barProgress.offsetLeft;
                var percent = length / nodeList.barProgress.offsetWidth;
                nodeList.playProgress.style.width = percent * (nodeList.barProgress.offsetWidth) + "px";
                nodeList.video.currentTime = percent * nodeList.video.duration;

                progressFlag = setInterval(custFuncs.getProgress, 60);
            },

            /*网络状态的响应处理*/
            networkStatus: function (res) {
                /*-1:无网络,
                 0:TYPE_MOBILE,
                 1:TYPE_WIFI,
                 2:TYPE_MOBILE->TYPE_WIFI
                 3:TYPE_WIFI->TYPE_MOBILE*/
                //排除app 短时间重复调用
                if (repeatflag == res["data"]["netStatus"]) return;
                repeatflag = res["data"]["netStatus"];
                //showMessage(res);
                switch (parseInt(res["data"]["netStatus"])) {
                    case (-1):/*无网络状态*/
                        showMessage("你的网络连接已经断开了。");
                        break;
                    case (0):/*移动网络状态*/
                        if (tipConfirm == 0) return;
                        if (!(nodeList.video.paused || nodeList.video.ended)) {/*没有停止也没有结束*/
                            if (navigator.appVersion.match(/iphone/gi)) {
                                return;
                            }
                            custFuncs.play();/*停止播放*/
                        }
                        if (tipConfirm) {
                            var m_confirm = confirm("您正在使用非wifi网络，播放将产生流量费用!", {
                                "title": "温馨提示",
                                "OKText": "确定播放",
                                "cancelText": "取消",
                                "OK": function() {
                                    sessionStorage.setItem("tipConfirm", 0);
                                    /*if (navigator.appVersion.match(/iphone/gi)) {
                                        return;
                                    }*/
                                    custFuncs.play();
                                },
                                "cancel": function() {}
                            });
                            m_confirm.init();
                            m_confirm.show();
                        } else {
                            custFuncs.play();
                        }
                        break;
                    case (1):/*wifi网络状态*/
                            if (navigator.appVersion.match(/iphone/gi)) {
                                return;
                            }
                            evtFuncs.play();
                            className.add(nodeList.bigStar, "hidden");
                        break;
                    case (2):/*移动网络 --> wifi网络*/
                        if ( nodeList.video.paused || nodeList.video.ended ){
                            if (navigator.appVersion.match(/iphone/gi)) {
                                return;
                            }
                            custFuncs.play();
                        }
                        break;
                    case (3):/*wifi网络 --> 移动网络*/
                        if (tipConfirm == 0) return;
                        if (!(nodeList.video.paused || nodeList.video.ended)) {/*没有停止也没有结束*/
                            custFuncs.play();/*停止播放*/
                        }
                        var m_confirmMTW = confirm("您正在使用非wifi网络，播放将产生流量费用!", {
                            "title": "温馨提示",
                            "OKText": "确定播放",
                            "cancelText": "取消",
                            "OK": function() {
                                sessionStorage.setItem("tipConfirm", 0);
                                /*if (navigator.appVersion.match(/iphone/gi)) {
                                    return;
                                }*/
                                custFuncs.play();
                            },
                            "cancel": function() {}
                        });
                        m_confirmMTW.init();
                        m_confirmMTW.show();
                        break;
                }
            }
        };

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
            custFuncs.init();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});