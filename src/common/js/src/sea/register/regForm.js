/**
 * 注册表单
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var ajax = require("lib/io/ajax");
    var trim = require("lib/str/trim");
    var showMessage = require("sea/showMessage");
    var tipMessage = require("sea/tipMessage");
    var countdown = require("mopon/countdown");
    var touch = require("touch");
    var modalImg = require('sea/register/modalImg');
    var storageMessager = require("lib/evt/storageMessager");
    var loading = require("sea/dialog/loading");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_countdown = null;
        var m_modalImg = null;
        var m_loading = null;

        //---------------事件定义----------------
        var evtFuncs = {
            sendVCode: function() {
                custFuncs.sendVCode();
            },
            submit: function() {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                var mobile = trim(nodeList.mobile.value);
                var xcode = trim(nodeList.xcode.value);
                var vcode = trim(nodeList.vcode.value);
                var passwd = trim(nodeList.passwd.value);
                var passwd1 = trim(nodeList.passwd1.value);
                //var recommend = trim(nodeList.recommend.value);
                if (!(/^1[3|4|5|7|8]\d{9}$/.test(mobile))) {
                    tipMessage("请输入正确的手机号");
                    return;
                }
                if (xcode.length < 4 || xcode.length > 6) {
                    tipMessage("你输入的验证码不正确");
                    return;
                }
                if (vcode.length == 0) {
                    tipMessage("请输入手机验证码");
                    return;
                }

                if (passwd.length == 0) {
                    tipMessage("请输入密码");
                    return;
                }

                if (passwd != passwd1) {
                    tipMessage("两次输入的密码不一致，请重新输入");
                    return;
                }

                /*if(recommend.length > 0 && !(/^1[3|4|5|7|8]\d{9}$/.test(recommend))) {
                    tipMessage("请输入正确的推荐人手机号");
                    return;
                }
                if(recommend.length > 0 && recommend== mobile) {
                    tipMessage("推荐人手机号不能与注册手机号相同");
                    return;
                }*/

                if (!nodeList.agreement.checked) {
                    tipMessage("请阅读并同意注册协议");
                    return;
                }

                var param = {
                    "mobile": mobile,
                    "password": passwd,
                    "verifyCode": vcode/*,
                    "referrer": recommend*/
                };

                ajax({
                    "url": opts["register"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        m_loading.hide();

                        if (res["status"] != 1) {
                            tipMessage(res["msg"]);
                            return;
                        }

                        storageMessager.send("userChanged");
                        window.localStorage.setItem("fromRegister", "1");
                        webBridge.popToSelectedController("mine");
                        // custFuncs.getLuckBagAct();
                    },
                    "onError": function (res) {
                        that.unLock();
                        m_loading.hide();
                        tipMessage("网络连接失败(" + res.status + ")");
                    }
                });

                /*var param = {
                    "mobile": mobile,
                    "verifyCode": vcode
                };

                m_loading.show();

                ajax({
                    "url": opts["checkverifycode"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res["status"] != 1) {
                            m_loading.hide();
                            tipMessage(res["msg"]);
                            return;
                        }
                        var param = {
                            "mobile": mobile,
                            "password": passwd,
                            "verifyCode": vcode
                            //"referrer": recommend
                        };

                        ajax({
                            "url": opts["register"],
                            "method": "post",
                            "data": param,
                            "onSuccess": function (res) {
                                that.unLock();
                                m_loading.hide();

                                if (res["status"] != 1) {
                                    tipMessage(res["msg"]);
                                    return;
                                }

                                storageMessager.send("userChanged");
                                window.localStorage.setItem("fromRegister", "1");
                                webBridge.popToSelectedController("mine");
                                // custFuncs.getLuckBagAct();
                            },
                            "onError": function (res) {
                                that.unLock();
                                m_loading.hide();
                                tipMessage("网络连接失败(" + res.status + ")");
                            }
                        });
                    },
                    "onError": function (res) {
                        that.unLock();
                        m_loading.hide();
                        tipMessage("网络连接失败(" + res.status + ")");
                    }
                });*/


            },
            mobileInput: function () {
                if((/^1[3|4|5|7|8]\d{9}$/.test(trim(nodeList.mobile.value)))) {
                    nodeList.sendVCode.style.backgroundColor ="#ff9600";
                } else {
                    nodeList.sendVCode.style.backgroundColor ="rgba(255,255,255,0.5)";
                }
            },
            clickUpdateImg: function () {
                custFuncs.clickUpdateImg();
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
            m_countdown = countdown(nodeList.sendVCode,{ format: "重新发送({count})", times: 59});
            m_countdown.init();

            m_loading = loading();
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.sendVCode, "tap", evtFuncs.sendVCode);
            touch.on(nodeList.submit, "tap", evtFuncs.submit);
            nodeList.mobile.addEventListener("input",evtFuncs.mobileInput);
            touch.on(nodeList.updateImg, "tap", evtFuncs.clickUpdateImg);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            sendVCode :function() {
                if (that.isLock() || !m_countdown.isReady()) {
                    return;
                }

                var mobile = trim(nodeList.mobile.value);
                var xcode = trim(nodeList.xcode.value);

                if (!(/^1[3|4|5|7|8]\d{9}$/.test(mobile))) {
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
                    "businessType": "1",
                    "xcode": xcode
                };
                ajax({
                    "url": opts["sendverifycode"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();

                    if (res["status"] != 1) {
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
                        return;
                    }

                        /*if (res["status"] != 1) {
                            // tipMessage(res["msg"]);
                            // return;
                            if (!!res["data"].status) {
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
                            } else {
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
                            }
                            return;
                        }*/

                        m_countdown.start(function () {
                            ajax({
                                "url": opts["updateCode"],
                                "method": "get",
                                "onSuccess": function (res) {
                                    nodeList.updateImg.src = res.url;
                                },
                                "onError": function (res) {
                                    tipMessage("网络连接失败(" + res.status + ")");
                                }
                            })
                        });
                    },
                    "onError": function (res) {
                        that.unLock();
                        tipMessage("网络连接失败(" + res.status + ")");
                    }
                });
            },
            getLuckBagAct: function() {
                ajax({
                    url: opts.luckyBag,
                    onSuccess: function(res) {
                        if (res.status != 1 || res.data.status != 1) {
                            webBridge.popToSelectedController('mine');
                            return;
                        }

                        var luckyBagUrl = res.data.url;

                        m_modalImg = modalImg({
                            OK: function() {
                                webBridge.popToSelectedController('mine');
                                webBridge.openUrl(luckyBagUrl, 'blank', 1);
                            },
                            CLOSE: function() {
                                webBridge.popToSelectedController('mine');
                            }
                        });
                        m_modalImg.init();
                        m_modalImg.show();
                        m_modalImg.setPosition('0', '11.1rem');
                    }
                })

            },
            clickUpdateImg: function () {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                ajax({
                    "url": opts["updateCode"],
                    "method": "get",
                    "onSuccess": function (res) {
                        nodeList.updateImg.src = res.url;
                        that.unLock();
                    },
                    "onError": function (res) {
                        tipMessage("网络连接失败(" + res.status + ")");
                        that.unLock();
                    }
                })
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