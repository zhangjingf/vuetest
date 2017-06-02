/**
 * 修改昵称
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var modal = require("lib/layer/modal");
    var isEmpty = require("lib/str/isEmpty");
    var trim = require("lib/str/trim");
    var clone = require("lib/json/clone");
    //var storageMessager = require("lib/evt/storageMessager");
    var ajax = require("lib/io/ajax");
    var touch = require("touch");
    var storageMessager = require("lib/evt/storageMessager");
    var showMessage = require("sea/showMessage");

    //---------- require end -------------
    var TMPL = '<div class="title">修改昵称</div>\
                <div class="body-input">\
                    <input type="text" node-name="nickname" placeholder="请输入你的新昵称">\
                    <div node-name="clear"><span>x</span></div>\
                </div>\
                <div class="footer">\
                    <div class="borderright" node-name="cancel">取消</div>\
                    <div node-name="ok">确认</div>\
                </div>';

    return function(opts) {
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
            ok: function() {
                if (that.isLock()) {
                    return;
                }

                var nickname = trim(nodeList.nickname.value);

                if (isEmpty(nickname)) {
                    return;
                }

                that.lock();

                that.hide();
                that.fire("modifyNickname", {
                    "nickname": nickname
                });

                var param = {
                    "nickName": nickname
                };

                ajax({
                    "url": opts["modify"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res["status"] == 0) {
                            that.fire("modifyNickname", {
                                "nickname": null
                            });

                            showMessage(res["msg"], function () {
                                that.show();
                            });

                            nodeList.nickname.value = "";
                            return;
                        }

                        storageMessager.send("myDataChange");
                        showMessage(res["msg"]);
                    },
                    "onError": function(req) {
                        that.unLock();
                        console.error("操作失败，状态码：" + req["status"]);
                    }
                });
            },
            cancel: function() {
                that.hide("cancel");
            },
            clear: function () {
                nodeList.nickname.value ='';
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.ok, "tap", evtFuncs.ok);
            touch.on(nodeList.cancel, "tap", evtFuncs.cancel);
            touch.on(nodeList.clear, "tap", evtFuncs.clear);
        }

        //-----------------自定义函数-------------
        var custFuncs = {}

        //-----------------初始化----------------
        var init = function(_data) {
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
});