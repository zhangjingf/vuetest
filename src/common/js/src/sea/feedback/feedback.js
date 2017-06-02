/**
 *
 * 意见反馈
 *
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var ajax = require("lib/io/ajax");
    var webBridge = require("sea/webBridge");
    var showMessage = require("sea/showMessage");
    var touch = require("touch");
    var alert = require("sea/dialog/alert");

    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var filmNo = opts["filmNo"];

        //---------------事件定义----------------
        var evtFuncs = {
            submit: function() {
                var txt = nodeList.textarea.value;
                if (txt.length < 5) {
                    showMessage("评论字数不少于5个字哦~");
                    return;
                } else if(txt.length > 140) {
                    showMessage("评论字数不多于140个字哦~");
                    return;
                }
                custFuncs.setReview(txt);
            },
            textNum: function() {
                var txt = nodeList.textarea.value;
                var num = txt.length;
                if (num > 0) {
                    nodeList.clear_x.style.background = "#ff9600";
                    nodeList.word_num.innerHTML = num + "/140字";
                } else {
                    nodeList.clear_x.style.background = "";
                }
            },
            clear: function() {
                if (nodeList.textarea.value) {
                    nodeList.textarea.value = '';
                }
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {

        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.submit, "tap", evtFuncs.submit);
            touch.on(nodeList.clear, "tap", evtFuncs.clear);
            touch.on(nodeList.textarea, "input", evtFuncs.textNum);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            setReview: function(txt) {
                if (that.isLock()) {
                    return;
                }
                var param = {
                    "content": txt
                };
                that.lock();
                ajax({
                    "url": opts["viewFeedbackUrl"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function(res) {
                        that.unLock();

                        console.log(res);

                        if (res["status"] != 1) {
                            showMessage(res["msg"]);
                            return;
                        }
                        var dialog = alert("反馈成功", {
                            "OK": function () {
                                webBridge.close();
                            }
                        });
                        dialog.init();
                        dialog.show();
                    },
                    "onError": function(req) {
                        console.error("网络连接失败:" + req.status);
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
