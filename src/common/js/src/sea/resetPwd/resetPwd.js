define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var toast = require("sea/toast");
    var webBridge = require("sea/webBridge");
    var storageMessager = require("lib/evt/storageMessager");
    var when = require("lib/util/when");
    var trim = require("lib/str/trim");
    var ajax = require("lib/io/ajax");
    var touch = require("touch");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_countdown = null;
        var param = null;
        //---------------事件定义----------------
        var evtFuncs = {
            checkpwd: function () {
                custFuncs.setPwd();
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {

        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.submit, 'tap', custFuncs.setPwd);
        }
        //-----------------自定义函数-------------
        var custFuncs = {
            setPwd: function () {
                var newPwd = nodeList.newpassword.value;
                var pwd = nodeList.password.value;

                if (newPwd.length < 6) {
                    toast("密码长度不能少于6位", 1000);
                }
                else if (newPwd.length > 16) {
                    toast("密码长度不能大于16位", 1000);
                }
                else {
                    if (newPwd != pwd) {
                        toast("两次密码输入不一致,请重新输入", 1000);
                    }
                    else {
                        var param = {
                            "mode": "2",
                            "mobile": opts.url["mobile"],
                            "code": opts.url["code"],
                            "newPwd": newPwd
                        };
                        ajax({
                            "url": opts["updatepwd"],
                            "method": "post",
                            "data": param,
                            "onSuccess": function (res) {
                                that.unLock();
                                if (res["status"] != 1) {
                                    toast(res["msg"], 1000);
                                    return;
                                }
                                toast("重设密码成功", 1000);
                                setTimeout(function () {
                                    storageMessager.send("userResetPsd", {mobile: opts.url["mobile"]});
                                },1000)


                            },
                            "onError": function (req) {
                                console.log("网络连接失败（" + req.status + ")");
                                that.unLock();
                            }
                        });
                    }
                }
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
            //webBridge.close(2);
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        return that;
    }
});