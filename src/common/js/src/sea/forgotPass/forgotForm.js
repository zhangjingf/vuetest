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
    var showMessage = require("sea/showMessage");
    var countdown = require("mopon/countdown");
    var when = require("lib/util/when");
    var touch = require("touch");
    var webBridge = require("sea/webBridge");
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
                //console.log(12345);
                custFuncs.sendVCodeToUser();
                //custFuncs.sendVCode();
            },
            submit: function() {
                custFuncs.submitVcode();
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
            m_countdown = countdown(nodeList.sendVCode, {times: 59});
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
                        custFuncs.sendVCode()
                    });
            },
            checkPhoneNo: function () {
                var defer = when.defer();
                if (that.isLock()) {
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
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        if(res["status"] != 1) {
                            console.log(res["msg"]);
                            showMessage(res["msg"]);
                            defer.reject();
                            return;
                        }
                        /*console.log(res);//不需要的只是打出看看
                        showMessage(res["msg"]);*/
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
                var xcode = trim(nodeList.xcode.value);

                if (!/^1\d{10}$/.test(mobile)) {
                    showMessage("请输入正确的手机号");
                    return;
                }

                if (xcode.length < 4 || xcode.length > 6) {
                    showMessage("你输入的验证码不正确");
                    return;
                }

                that.lock();
                var param = {
                    "mobile": mobile,
                    "businessType": "3",
                    "xcode": xcode
                };
                ajax({
                    "url": opts["sendverifycode"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res["status"] == 0) {
                            console.log(res["msg"]);
                            showMessage(res["msg"]);
                            defer.reject();
                            return;
                        }
                        m_countdown.start(function () {
                            ajax({
                                "url": opts["updateCode"],
                                "method": "get",
                                "onSuccess": function (res) {
                                    nodeList.updateImg.src = res.url;
                                },
                                "onError": function (res) {
                                    that.unLock();
                                    showMessage("网络连接失败(" + res.status + ")");
                                }
                            })
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
                        custFuncs.getNewPwd();
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
                    showMessage("请输入正确的手机号");
                    defer.reject();
                    return defer.promise;
                }

                if (vcode.length == 0) {
                    showMessage("请输入手机验证码");
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
                            showMessage(res["msg"]);
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
            getNewPwd: function () {
                var defer = when.defer();
                ajax({
                    "url": opts["resetuserpwd"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        //that.unLock();
                        if (res["status"] == 0) {
                            console.log(res["msg"]);
                            defer.resolve();
                            return defer.promise;
                        }
                        //console.log(res["msg"]);
                        showMessage("重置密码成功", function() {
                            webBridge.close();
                        });
                        defer.resolve();
                    },
                    "onError": function (res) {
                        console.error("网络连接失败(" + res.status + ")");
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