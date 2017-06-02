/**
 * 登录表单
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var trim = require("lib/str/trim");
    var className = require("lib/dom/className");
    //var isEmpty = require("lib/str/isEmpty");
    //var showMessage = require("sea/showMessage");
    var tipMessage = require("sea/tipMessage");
    var storageMessager = require("lib/evt/storageMessager");
    var webBridge = require("sea/webBridge");
    var loading = require("sea/dialog/loading");
    var touch = require("touch");
    var ajax = require("lib/io/ajax");
    var countdown = require("mopon/countdown");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_loading = null;
        var mode = 3;
        var m_countdown = null;
        var flagVcode = true;

        //---------------事件定义----------------
        var evtFuncs = {
            submit: function(ev) {
                nodeList.passwd.blur();
                if (that.isLock()) {
                    return;
                }

                if (mode == 3) {
                    var passwd = trim(nodeList.passwd.value);
                    var xcode = trim(nodeList.xcode.value);
                    var mobile = trim(nodeList.mobile.value);

                    if (!/^1\d{10}$/.test(mobile)) {
                        tipMessage("请输入正确的手机号");
                        return;
                    }

                    if (passwd.length == 0) {
                        tipMessage("请输入您的密码");
                        return;
                    }

                    if (xcode.length < 4 || xcode.length > 6) {
                        tipMessage("你输入的验证码不正确");
                        return;
                    }

                    
                    var param = {
                        "mobile": mobile,
                        "mode": mode,
                        "password": passwd,
                        "xcode": xcode,
                    };
                }

                if (mode == 5) {
                    var mobile = trim(nodeList.vmobile.value);
                    var vxcode = trim(nodeList.vxcode.value);
                    if (!/^1\d{10}$/.test(mobile)) {
                        tipMessage("请输入正确的手机号");
                        return;
                    }

                    var verifyCode = trim(nodeList.verifyCode.value);
                    if (verifyCode.length != 6) {
                        tipMessage("你输入的动态码不正确");
                        return;
                    }

                    var param = {
                        "mobile": mobile,
                        "mode": mode,
                        "verifyCode": verifyCode,
                        "xcode": vxcode
                    };
                }

                

                that.lock();
                m_loading.show();
                ajax({
                    "url": opts["login"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function(res) {
                        that.unLock();
                        m_loading.hide();
                        if (res["status"] != '1') {
                            if (!!res["data"].status) {
                                tipMessage(res["msg"],function () {
                                    ajax({
                                        "url": opts["imgCheck"],
                                        "onSuccess": function (r) {
                                            nodeList.updateImg.src = r.url;
                                        },
                                        "onError": function (req) {
                                            console.log("网络连接错误"+req.status);
                                        }
                                    });
                                });
                            } else {
                                tipMessage(res["msg"]);
                            }
                            return;
                        }
                        webBridge.setUserInfo(res["data"]);
                        storageMessager.send("userChanged");
                        window.frames[0].postMessage(localStorage.getItem("lib/evt/storageMessager"),location.protocol+'//jf.omnijoi.cn/');
                        //window.frames[0].postMessage(localStorage.getItem("lib/evt/storageMessager"),location.protocol+'http://172.16.10.18/shop/frontend/web/');
                        webBridge.close();
                    },
                    "onError": function(res) {
                        that.unLock();
                        m_loading.hide();
                        tipMessage("网络连接失败(" + res.status + ")");
                    }
                });
            },
            "accountLogin": function (ev) {
                mode = 3;
                className.remove(nodeList.vcodeLogin, "active-way");
                className.add(nodeList.accountLogin, "active-way");
                className.remove(nodeList.formBox, "hidden");
                className.add(nodeList.dtmFormBox, "hidden");

                className.remove(nodeList.links, "hidden");
                className.add(nodeList.linkTip, "hidden");
            },
            "vcodeLogin": function (ev) {
                mode = 5;
                className.remove(nodeList.accountLogin, "active-way");
                className.add(nodeList.vcodeLogin, "active-way");
                className.remove(nodeList.dtmFormBox, "hidden");
                className.add(nodeList.formBox, "hidden");
                className.add(nodeList.links, "hidden");
                className.remove(nodeList.linkTip, "hidden");
            },
            "getDynamic": function (ev) {
                if (!flagVcode) {
                    return ;
                }
                var vxcode = trim(nodeList.vxcode.value);
                var mobile = trim(nodeList.vmobile.value);

                if (!/^1\d{10}$/.test(mobile)) {
                    tipMessage("请输入正确的手机号");
                    return;
                }

                if (vxcode.length < 4 || vxcode.length > 6) {
                    tipMessage("你输入的验证码不正确");
                    return;
                }

                var vparamCheck = {
                    "mobile": mobile,
                    "xcode": vxcode,
                    "businessType": 9
                }
                if (that.isLock()) {
                    return;
                }
                that.lock();
                flagVcode = false;
                if ( m_countdown.isReady()!=true ) {
                    return;
                }
                ajax({
                    "url": opts["sendverifycode"],
                    "method": "post",
                    "data": vparamCheck,
                    "onSuccess": function (res) {
                        //console.log(res);
                        //失败
                        if (res.status != 1) {
                            that.unLock();
                            flagVcode = true;
                            if (!!res["data"].status) {
                                tipMessage(res["msg"],function () {
                                    ajax({
                                        "url": opts["imgCheck2"],
                                        "onSuccess": function (r) {
                                            nodeList.vupdateImg.src = r.url;
                                        },
                                        "onError": function (req) {
                                            console.log("网络连接错误"+req.status);
                                        }
                                    });
                                });
                            } else {
                                tipMessage(res["msg"]);
                            }
                            return;
                        }
                        //成功
                        that.unLock();
                        m_countdown.start(function () {
                            nodeList.phoneVcode.className = "phone-vcode";
                            flagVcode = true;
                            /*ajax({
                                "url": opts["imgCheck"],
                                "onSuccess": function (r) {
                                    nodeList.updateImg.src = r.url;
                                },
                                "onError": function (req) {
                                    console.log("网络连接错误"+req.status);
                                }
                            });*/
                        });
                        className.add(nodeList.phoneVcode, "out-time");

                    },
                    "onError": function (req) {
                        console.log("网络连接失败错误码"+req.status);
                        that.unLock();
                    }
                });


            },
            clickUpdateImg: function (ev) {
                custFuncs.clickUpdateImg()
            },
            clickVupdateImg: function (ev) {
                custFuncs.clickVupdateImg()
            }

        }

        //---------------子模块定义---------------
        var modInit = function() {
            m_loading = loading();
            m_loading.init();
            m_loading.keepMiddle();

            m_countdown = countdown(nodeList.phoneVcode, {times:59});
            m_countdown.init();
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.submit, "tap", evtFuncs.submit);

            touch.on(nodeList.accountLogin, "tap", evtFuncs.accountLogin);
            touch.on(nodeList.vcodeLogin, "tap", evtFuncs.vcodeLogin);

            touch.on(nodeList.phoneVcode, "tap", evtFuncs.getDynamic);

            touch.on(nodeList.updateImg, "tap", evtFuncs.clickUpdateImg);
            touch.on(nodeList.vupdateImg, "tap", evtFuncs.clickVupdateImg);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            setMobile: function (mobile) {
                nodeList.mobile.value = mobile;
            },
            clickUpdateImg: function () {
                if (that.isLock()) {
                    return;
                };
                that.lock();
                ajax({
                    "url": opts["imgCheck"],
                    "onSuccess": function (r) {
                        nodeList.updateImg.src = r.url;
                        that.unLock();
                    },
                    "onError": function (req) {
                        console.log("网络连接错误"+req.status);
                        that.unLock();
                    }
                });
            },
            clickVupdateImg: function () {
                if (that.isLock()) {
                    return;
                };
                that.lock();
                ajax({
                    "url": opts["imgCheck2"],
                    "onSuccess": function (r) {
                        nodeList.vupdateImg.src = r.url;
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
            //custFuncs.clickVupdateImg();
            custFuncs.clickUpdateImg();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.setMobile = custFuncs.setMobile;

        return that;
    }
});