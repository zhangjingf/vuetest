/**
 * 修改昵称
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var modal = require("lib/layer/modal");
    var trim = require("lib/str/trim");
    var clone = require("lib/json/clone");
    //var storageMessager = require("lib/evt/storageMessager");
    var ajax = require("lib/io/ajax");
    var touch = require("touch");
    var showMessage = require("sea/showMessage");
    //---------- require end -------------
    var TMPL = '<div class="title">更改手机</div>\
                <div class="body-input">\
                    <input type="text" node-name="mobile" placeholder="请输入新的手机号码">\
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

                var mobile = trim(nodeList.mobile.value);

                if (!/^1\d{10}$/.test(mobile)) {
                    that.hide();

                    showMessage("请输入正确的手机号", function () {
                        that.show();
                    })
                    return;
                }

                that.lock();
                var param = {
                    "mobile": mobile
                };

                ajax({
                    "url": opts["binding"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res["status"] == 0) {
                            showMessage(res["msg"], function () {
                                that.show();
                            });
                            nodeList.mobile.value= "";
                            return;
                        }

                        that.hide("finish", {
                            "mobile": mobile
                        });

                        showMessage(res["msg"]);

                        that.fire("modifyMobile", {
                            "mobile": mobile
                        })
                    },
                    "onError": function(req) {
                        that.unLock();
                        console.error("操作失败，状态码：" + req["status"]);
                    }
                });

                //webBridge.binding({
                //    "userId": opts["userId"],
                //    "mobile": mobile
                //}, function (res) {
                //    that.unLock();
                //
                //    if (res["code"] != "0") {
                //        that.hide();
                //
                //        showMessage(res["msg"], function () {
                //            that.show();
                //        });
                //
                //        return;
                //    }
                //
                //    if (res["data"]["head"]["errCode"] != "0") {
                //        that.hide();
                //
                //        showMessage(res["head"]["errMsg"], function () {
                //            that.show();
                //        });
                //
                //        return;
                //    }
                //
                //    var newUser = clone(opts);
                //    newUser["mobile"] = mobile;
                //    that.hide("finish", {
                //        "mobile": mobile
                //    });
                //
                //    storageMessager.send("userModify", newUser);
                //});
            },
            cancel: function () {
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
        var custFuncs = {}

//-----------------初始化----------------
        var init = function (_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-mode-one";

            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
        }

//-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
})
;