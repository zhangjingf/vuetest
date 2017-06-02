/**
 * webBridge模块
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var geoLocation = require("lib/util/geoLocation");
    var that = require("mopon/webBridge");
    var appendQuery = require("lib/str/appendQuery");
    var config = require("sea/config");

    var openingWebview = false;
    /*************js调用app的方法*************/
    //传递给app在线充值虚拟会员账号，返回参数
    that.launchAppPay = function (data, handler) {
        that.callApp("launchAppPay",handler, {
            payResponse: data
        });
    };

    //重写openUrl
    that.openUrl = function(url, target, param) {
        if (openingWebview) {
            return;
        }

        target = target == "self" ? "self" : "blank";

        // 转成完整路径
        var link = document.createElement("A");
        link.href = url;
        url = decodeURIComponent(url);
        var arrs = url.split(/\&|\?/);
        var len = url.split(/\&|\?/).length;
        var arr = "";

        if (len <= 1) {
            param = {
                "title": "",
                "style": "0"
            }
        } else {
            arr = arrs[1];
        }

        if (!!config[arr]) {
            param = config[arr];
        } else {
            param = {
                /*"title":"",
                "style":"5"*/
                "title": "loading...",
                "style":"0"
            };
        }

        //return;

        if (that.isReady()) {
            openingWebview = true;
            that.callApp("openUrl", null, {
                "url": link.href,
                "target": target,
                "param": param || {}
            });
            setTimeout(function() {
                    openingWebview = false;
                }
                , 1500);
        } else {
            console.error("webBridge: 环境不支持App调用(openUrl)");
            location.href = appendQuery(url, {
                "_target": target
            });
        }
    };
    that.openOtherUrl = function(url) {
        if (openingWebview) {
            return;
        }
        // 转成完整路径
        var link = document.createElement("A");
        link.href = url;
        var param = {
            "title": "loading...",
            "style":"0"
        };
        if (that.isReady()) {
            openingWebview = true;
            that.callApp("openUrl", null, {
                "url": link.href,
                "target": 'blank',
                "param": param
            });
            setTimeout(function() {
                    openingWebview = false;
                }
                , 1500);
        } else {
            console.error("webBridge: 环境不支持App调用(openUrl)");
            location.href = appendQuery(url, {
                "_target": 'blank'
            });
        }
    }

    //获得用户的位置信息
    that.showCinemaMap = function (data, handler) {
        /*cinemaName:"影院名称",
         cinemaAddress:"影院地址",
         lagitude:"维度",
         longitude:"经度"*/
        that.callApp("showCinemaMap", handler, data);
    };

    that.clearCache = function () {
        that.callApp("clearCache");
    };

    //切换购票页面影院影片
    that.changeBuyTicketType = function (data, handler) {
        that.callApp("changeBuyTicketType",handler, {
            index: data
        });
    };

    /**
     * 分享到微信朋友圈
     * @param  {object} data [要分享的内容], 需包含的字段如下
     * data = {
     *      url: 链接,
     *      type: 分享类型,包括wechat(微信), friends(朋友圈), message(短信)
     *      title: 标题,
     *      content: 内容,
     *      imgUrl: 分享图标
     *  }
     *  @param {Function} 回调函数
     */
    that.share = function(data, handler) {
        if (!data) {
            console.error("webBridge: 没有传入分享内容");
            return;
        }
        webBridge.callApp('shareToWeixinFriendsWithData', handler, data);
    };


    //topBar颜色变深
    that.colorGradDepth = function (data, handler) {
        that.callApp("colorGradDepth", handler, data);
    };
    //topBar背景透明
    that.colorGradLight = function (data, handler) {
        that.callApp("colorGradLight", handler, data);
    };
    //隐藏topBar
    that.hideTopBar = function (data, handler) {
        that.callApp("hideTopBar", handler, data);
    };
    //显示topBar
    that.showTopBar = function (data, handler) {
        that.callApp("showTopBar", handler, data);
    };
    //变成色
    that.colorGrad = function (data, handler) {
        that.callApp("colorGrad", handler, data);
    };

    //显示和影藏导航栏
    that.topBarVisible = function (data, handler) {
        that.callApp("topBarVisible", handler, data);
    };

    //选中电子券和优惠券 导航字体变色方法
    that.changeRightButColor = function (data, handler) {
        that.callApp("changeRightButColor", handler, data);
    };
    //传递用户信息
    that.setUserInfo = function (data, handler) {
        that.callApp("setUserInfo", handler, data);
    };
    //通知APP支付成功信息
    that.tellAppAppleSuccess = function (data, handler) {
        that.callApp("tellAppAppleSuccess", handler, data);
    };
    // 通知app取消移动话费
    that.isCancelMobilePay = function (data, handler) {
        that.callApp("isCancelMobilePay", handler, data);
    };
    //通知app处理返回按钮
    that.backButtonEnabled = function (data, handler) {
        that.callApp("backButtonEnabled", handler, data);
    };
    //调用app判断当前处于什么网络
    that.networkStatusChanged = function (data, handler) {
        that.callApp("networkStatusChanged", handler, data);
    };
    //app返回版本号
    that.getCurrentVersion = function (data, handler) {
        that.callApp("getCurrentVersion", handler, data);
    };

    //调用app然他们显示 预告片播放的标题
    that.videoPlayTitleShow = function (data, handler) {
        that.callApp("videoPlayTitleShow", handler, data);
    };
    //FlexBox下拉刷新
    that.flexBoxRefresh = function (data, handler) {
        that.callApp("flexBoxRefresh", handler, data);
    };
    //通知app，js正常
    that.updateBuyTicketInterfaceIfNecessary = function (data, handler) {
        that.callApp("updateBuyTicketInterfaceIfNecessary", handler, data);
    };
    //保存base64图片到手机相册
    /*
    * base64String    base64格式图片
    * */
    that.saveImageToPhotos = function (data, handler) {
        that.callApp("saveImageToPhotos", handler, data);
    };

    that.shareBigImageToWeiXin = function (data, handler) {
        that.callApp("shareBigImageToWeiXin", handler, data);
    };

    that.replaceHead = function (data, handler) {
        that.callApp("replaceHead", handler, data);
    };

    /* 约影提示我的产生红点 */
    that.showRedDot = function (data, handler) {
        that.callApp("showRedDot", handler, data);
    }
    /***************app调用js的******************/
    //android上的返回键调用的方法
    that.onBackPressed = function() {
        that.close();
        var isIPhone = navigator.appVersion.match(/iphone/gi);
        if (isIPhone) {
            return "turnBackSucceed";
        }
    };
    //iso applePay支付后调用我们的方法
    //that.applePayStatue = function () {};

    //app 告知 h5页面当前网络状态
    that.tellPageNetworkStatus = function() {};

    // android home键 退出调用暂停视频  或  android 进入app 播放视频
    that.androidVideoPlay = function () {};

    //切换购票页面影院影片
    that.switchFilmCinema = function() {};

    //选择电子券和优惠券
    that.clickRightEnsure = function () {};

    that.selectedBank = function () {};

    //单独卖品后退按钮取消订单调用h5方法
    //that.refreshMyMealOrder = function () {};

    //安卓键盘弹起
    that.showKeyboard = function () {};
    //安卓键盘隐藏
    that.hiddenKeyboard = function () {};
    
    that.checkOrderInfo = function() {};
    return that;

});