define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var showMessage = require("sea/showMessage");
    var className = require("lib/dom/className");
    var countdown = require("mopon/countdown"); 
    var toast = require("sea/toast");
    var webBridge = require("sea/webBridge");
    var when = require("lib/util/when");
    var trim = require("lib/str/trim"); 
    var ajax = require("lib/io/ajax");
    var touch = require("touch");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_countdown = null;
        var param = null;
        //---------------事件定义----------------
        var evtFuncs = {
            close: function() {
                webBridge.close();
            },
            sendVCode: function() { 
                if ( m_countdown.isReady() != true ) {
                    return;
                }
                custFuncs.sendVCodeToUser();
            },
            updateImg: function (ev) {
                custFuncs.updateImg();
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
            m_countdown = countdown(nodeList.sendVCode, {times:59});
            m_countdown.init();

        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.close, "tap", evtFuncs.close);
            touch.on(nodeList.sendVCode, "tap", evtFuncs.sendVCode);
            touch.on(nodeList.submit, "tap", custFuncs.submitVcode);
            touch.on(nodeList.updateImg, "tap", custFuncs.updateImg);
        }
        //-----------------自定义函数-------------
        var custFuncs = {
            sendVCodeToUser: function () {
                        custFuncs.sendVCode();
            },
            sendVCode: function() {
                var defer = when.defer();
                if (that.isLock() || !m_countdown.isReady()) {
                    return;
                }
                var xcode = trim(nodeList.xcode.value);

                var param = {
                    "businessType": "22",
                    "xcode": xcode
                };
                ajax({
                    "url": opts["sendverifycode"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        if( res["status"] == 0) {
                            toast(res["msg"]);
                            return ;
                        }
                        className.add(nodeList.sendVCode, "action");
                        m_countdown.start( function () {
                            className.remove(nodeList.sendVCode, "action");
                        });
                        defer.resolve();
                    },
                    "onError": function (res) {
                        console.error("网络连接失败(" + res.status + ")");
                        defer.reject("网络连接失败(" + res.status + ")");
                        that.unLock();
                    }
                });
            },
            submitVcode: function () {
                var defer =  when.defer();
                if (that.isLock()) {
                    defer.reject();
                    return defer.promise;
                }
                var vcode = trim(nodeList.vcode.value);

                if (vcode.length == 0) {
                    toast("请输入验证码", 1000);
                    defer.reject();
                    return defer.promise;
                }

                that.lock();
                param = {
                    "verifyCode": vcode
                };
                ajax({
                    "url": opts["activated"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        console.log(res);
                        if (res["status"] != 1) {
                            toast(res["msg"], 1000);
                            defer.reject();
                        } else {
                            toast(res["msg"], 3000, function() {
                                  webBridge.close();
                                  window.location.reload();  
                            });
                            defer.resolve();
                        }
                    },
                    "onError": function (req) {
                        console.log("网络连接失败(" + req.status + ")");
                        that.unLock();
                        defer.reject("网络连接失败:" + req.status);
                    }
                });
                return defer.promise;
            },
            updateImg: function () {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                ajax({
                    "url": opts["updateImg"],
                    "onSuccess": function (r) {
                        nodeList.updateImg.src = r.url;
                        that.unLock();
                    },
                    "onError": function (req) {
                        console.log("网络连接错误" + req.status);
                        that.unLock();
                    }
                });
            }
        }


        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        return that;
    }
});