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
            sendVCode: function() { 
                if ( m_countdown.isReady()!=true ) {
                    return;
                }
                custFuncs.sendVCodeToUser();
            },
            submit: function() {
                custFuncs.submitVcode();
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
            m_countdown = countdown(nodeList.sendVCode, {times:59});
            m_countdown.init();

        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.sendVCode, "tap", evtFuncs.sendVCode);
            touch.on(nodeList.submit, "tap", evtFuncs.submit);
        }
        //-----------------自定义函数-------------
        var custFuncs = {
            sendVCodeToUser: function () {
                custFuncs.checkPhoneNo()
                    .then(function () {
                        custFuncs.sendVCode();
                    });
            },
            checkPhoneNo: function () {
                var defer = when.defer();
                if (that.isLock() ) {
                    return;
                }
                that.lock();
                var mobile = trim(nodeList.mobile.value);
                var param = {
                    "mode": "2",
                    "mobile": mobile
                };
                ajax({
                    "url": opts["checkPhoneNoApi"],
                    "method": "post",
                    "data": {
                          "mode":"2",
                          "mobile":mobile
                    },
                    "onSuccess": function (res) {
                        that.unLock();
                        if(res["status"] != 1) {
                            toast(res["msg"] ,1000);
                            defer.reject();
                            return;
                        }
                        className.add(nodeList.sendVCode, "action");
                        defer.resolve();
                    },
                    "onError": function (req) {
                        console.log("网络连接失败（"+req.status+")");
                        that.unLock();
                        defer.reject();
                    }
                });

                return  defer.promise;
            
            },
            sendVCode: function() {
                var defer = when.defer();
                if (that.isLock() || !m_countdown.isReady()) {
                    return;
                }
                var mobile = trim(nodeList.mobile.value);

                if (!/^1\d{10}$/.test(mobile)) {
                    toast("请输入正确的手机号" ,1000);
                    return;
                }

                that.lock();
                var param = {
                    "mobile": mobile,
                    "businessType": "3",
                    "changePwd": "1"
                };
                ajax({
                    "url": opts["sendverifycode"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        m_countdown.start(function () {
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
            submitVcode: function() {
                custFuncs.checkVcode()
                 .then(function () {
                        webBridge.openUrl(opts["resetpwd"]+'&mobile='+param["mobile"]+'&code='+param["verifyCode"],"blank");
                    });
            },
            checkVcode: function () {
                var defer =  when.defer();
                if (that.isLock()) {
                    defer.reject();
                    return defer.promise;
                }
                var mobile = trim(nodeList.mobile.value);
                var vcode = trim(nodeList.vcode.value);

                if (!/^1\d{10}$/.test(mobile)) {
                    toast("请输入手机号", 1000);
                    defer.reject();
                    return defer.promise;
                }

                if (vcode.length == 0) {
                    toast("请输入验证码", 1000);
                    defer.reject();
                    return defer.promise;
                }

                that.lock();
                param = {
                    "mobile": mobile,
                    "verifyCode": vcode
                };
                ajax({
                    "url": opts["checkVcode"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        console.log(res);
                        if (res["status"] != 1) {
                            toast(res["msg"], 1000);
                            defer.reject();
                        } else {
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