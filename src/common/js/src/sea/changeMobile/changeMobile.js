/**
 * 注册表单
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var trim = require("lib/str/trim");
    var ajax = require("lib/io/ajax");
    //var showMessage = require("sea/showMessage");
    var tipMessage = require("sea/tipMessage");
    var countdown = require("mopon/countdown");
    var when = require("lib/util/when");
    var touch = require("touch");
    var webBridge = require("sea/webBridge");
    var storageMessager = require("lib/evt/storageMessager");
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
                custFuncs.sendVCodeToUser();
                //custFuncs.sendVCode();
            },
            submit: function() {
                custFuncs.submitVcode();
            },
            updateImg: function (ev) {
                custFuncs.updateImg();
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
            m_countdown = countdown(nodeList.sendVCode);
            m_countdown.init();
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.sendVCode, "tap", evtFuncs.sendVCode);
            touch.on(nodeList.submit, "tap", evtFuncs.submit);
            touch.on(nodeList.updateImg, "tap", evtFuncs.updateImg);//updateCode
        }
        //-----------------自定义函数-------------
        var custFuncs = {
            sendVCodeToUser: function () {
                custFuncs.sendVCode()
            },
            sendVCode: function() {
                var defer = when.defer();
                if (that.isLock() || !m_countdown.isReady()) {
                    return;
                }

                var mobile = trim(nodeList.mobile.value);
                var xcode = trim(nodeList.xcode.value);

                if (!/^1\d{10}$/.test(mobile)) {
                    tipMessage("请输入正确的手机号");
                    return;
                }

                if (xcode.length < 4 || xcode.length > 6) {
                    tipMessage("你输入的验证码不正确");
                    return;
                }

                that.lock();
                var param = {
                    "mobile": mobile,
                    "xcode": xcode,
                    "businessType": "3"
                };
                ajax({
                    "url": opts["sendverifycode"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res["status"] != 1) {
                            //if (!!res["data"].status) {
                            tipMessage(res["msg"],function () {
                                ajax({
                                    "url": opts["updateCode"],
                                    "onSuccess": function (r) {
                                        nodeList.updateImg.src = r.url;
                                    },
                                    "onError": function (req) {
                                        console.log("网络连接错误"+req.status);
                                    }
                                });
                            });
                            defer.reject();
                            return ;
                        }
                        
                        nodeList.sendVCode.className = "vcode out-time";
                        m_countdown.start(function () {
                            nodeList.sendVCode.className = "vcode";
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
                        custFuncs.getNewMobile();
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
                    tipMessage("请输入正确的手机号");
                    defer.reject();
                    return defer.promise;
                }

                if (vcode.length == 0) {
                    tipMessage("请输入手机验证码");
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
                            console.log(res["msg"]);
                            tipMessage(res["msg"]);
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
            },
            getNewMobile: function () {
                if (that.isLock()) {
                    return;
                }
                var mobile = trim(nodeList.mobile.value);
                that.lock();
                var defer = when.defer();
                var param = {
                    "mobile": mobile
                };
                ajax({
                    "url": opts["binding"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res["status"] != 1) {
                            tipMessage(res["msg"]);
                            return;
                        }
                        storageMessager.send("changeMobile",{"mobile":mobile});
                        webBridge.close();
                        tipMessage(res["msg"]);
                        console.log(res);
                    },
                    "onError": function(req) {
                        that.unLock();
                        console.error("操作失败，状态码：" + req["status"]);
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
                    "url": opts["updateCode"],
                    "onSuccess": function (r) {
                        nodeList.updateImg.src = r.url;
                        that.unLock();
                    },
                    "onError": function (req) {
                        console.log("网络连接错误"+req.status);
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