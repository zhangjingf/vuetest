/**
 * 修改昵称
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var modal = require("lib/layer/modal");
    var isEmpty = require("lib/str/isEmpty");
    var trim = require("lib/str/trim");
    var base64Encoder = require("lib/util/base64Encoder")
    var storageMessager = require("lib/evt/storageMessager");
    var ajax = require("lib/io/ajax");
    var touch = require("touch");
    var showMessage = require("sea/showMessage");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------
    var TMPL = '<div class="title">修改密码</div>\
                <div class="body-input">\
                    <input type="password" placeholder="请输入你的旧密码" node-name="oldPwd">\
                </div>\
                <div class="body-input">\
                    <input type="password" placeholder="请输入你的新密码" node-name="newPwd">\
                </div>\
                <div class="body-input">\
                    <input type="password" placeholder="再次输入新密码" node-name="newPwd1">\
                </div>\
                <div class="footer">\
                    <div class="borderright" node-name="cancel">取消</div>\
                    <div node-name="ok">确认</div>\
                </div>';

    return function (opts) {
        var that = modal();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var node = null;
        var superMethod = {
            init: that.init
        };

        //---------------事件定义----------------
        var evtFuncs = {
            ok: function () {
                if (that.isLock()) {
                    return;
                }

                var oldPwd = trim(nodeList.oldPwd.value);
                var newPwd = trim(nodeList.newPwd.value);
                var newPwd1 = trim(nodeList.newPwd1.value);

                if (isEmpty(oldPwd)) {
                    that.hide();
                    showMessage("请输入您的旧密码", function () {
                        that.show();
                    });

                    return;
                }

                if (isEmpty(newPwd)) {
                    that.hide();
                    showMessage("请输入您的新密码", function () {
                        that.show();
                    });

                    return;
                }

                if (newPwd != newPwd1) {
                    that.hide();
                    showMessage("两次输入的密码不一致", function () {
                        that.show();
                    });

                    return;
                }

                that.lock();
                var param = {
                    "mode" : 1,
                    "oldPwd" :oldPwd,
                    "newPwd" : newPwd
                };
                ajax({
                    "url": opts["updatepwd"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res["status"] == 0) {
                            showMessage(res["msg"], function () {
                                that.show();
                            });

                            nodeList.oldPwd.value = "";
                            nodeList.newPwd.value = "";
                            nodeList.newPwd1.value = "";
                            return;
                        }

                        that.hide("finish", {
                            "newPwd": newPwd
                        });

                        showMessage(res["msg"] + ",请重新登陆", function () {
                            that.fire("logout");
                        });
                    },
                    "onError": function(req) {
                        that.unLock();
                    }
                });
                // webBridge.updatePwd({
                //    "mode": 1,
                //    "mobile": "",
                //    "code": "",
                //    "oldPwd": oldPwd,
                //    "newPwd": newPwd,
                //    "userId": opts["userId"]
                // }, function(res) {
                //    that.unLock();
                //    that.hide();
                
                //    if (res["code"] != "0") {
                //        showMessage(res["msg"], function() {
                //            that.show();
                //        });
                
                //        return;
                //    }
                
                //    if (res["data"]["head"]["errCode"] != "0") {
                //        showMessage(res["head"]["errMsg"], function() {
                //            that.show();
                //        });
                
                //        return;
                //    }
                
                //    showMessage("密码修改成功，请重新登录", function() {
                //        webBridge.logout();
                //        storageMessager.send("userChanged");
                //        webBridge.popToSelectedController("mine");
                //    });
                // });
            },
            cancel: function () {
             /*  var _input = [].slice.call(node.querySelectorAll('input'));
                _input.forEach(function (item) {
                    item.blur();
                })*/
                that.hide("cancel");
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.ok, "tap", evtFuncs.ok);
            touch.on(nodeList.cancel, "tap", evtFuncs.cancel);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            logout: function () {
                ajax({
                    "url": opts["logout"],
                    "method": "post",
                    //"data": "",
                    "onSuccess": function (res) {
                        console.log(res);
                    }
                });
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-mode-one m-modify-passwd";

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