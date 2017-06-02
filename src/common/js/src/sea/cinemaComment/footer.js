define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var webBridge = require("sea/webBridge");
    var toast = require("sea/toast");
    var ajax = require("lib/io/ajax");
    var touch = require("touch");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var param = null;
        var dpr = document.documentElement.getAttribute("data-dpr");
        //---------------事件定义----------------
        var evtFuncs = {
            "submit": function (ev) {
                if(nodeList.textarea.value != "") {
                    var txt = nodeList.textarea.value;
                    if (txt.length < 5) {
                        toast("评论字数不少于5个字哦~");
                        return;
                    } else if(txt.length > 140) {
                        toast("评论字数不多于140个字哦~");
                        return;
                    }
                    custFuncs.review(txt);
                } else {
                    toast("请输入内容");
                }
            },
            "textNum": function(ev) {
                var txt = nodeList.textarea.value;
                var num = txt.length;
                if (num >= 0) {
                    nodeList.word_num.innerHTML = num + "/140字";
                }
            },
            "firstTap": function (ev) {
                var bodyNode = document.querySelector("body");
                    setTimeout(function () {
                        bodyNode.scrollTop =  800;
                    }, 500);
            },
            "clear": function(ev) {
                if(nodeList.textarea.value) {
                    nodeList.textarea.value = " ";
                    nodeList.word_num.innerHTML = 0 + "/140字";
                }
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            webBridge.showKeyboard = custFuncs.showKeyboard;
            webBridge.hiddenKeyboard = custFuncs.hiddenKeyboard;
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.submit, 'tap', evtFuncs.submit);
            touch.on(nodeList.textarea, "input", evtFuncs.textNum);
            touch.on(nodeList.textarea, "tap", evtFuncs.firstTap);
            touch.on(nodeList.clear, "tap", evtFuncs.clear);
        }
        //-----------------自定义函数-------------
        var custFuncs = {
            showKeyboard: function (data) {
                node.style.marginBottom = parseInt(data)*dpr+'px';
            },
            hiddenKeyboard:function(){
                node.style.marginBottom ='0';
            },
            review: function(txt) {
                var childReviewHtml = '';
                var param = {
                    "reviewType": "4",
                    "filmNo": opts["filmNo"],
                    "id": opts["id"],
                    "content": txt
                }
                ajax({
                    "url": opts["commentFeedbackUrl"],
                    "method": "get",
                    "data": param,
                    "onSuccess": function (res) {
                        if( res["status"] == 0) {
                            toast(res["msg"]);
                            return ;
                        }
                        childReviewHtml = '<li class="commentReview">\
                                        <div class="row">\
                                            <div class="profile">\
                                                <img onerror="this.src=\'./images/face/2x/208.jpg\'" src="' + (res["data"]["UserImgUrl"] == ""  ? './images/face/2x/' + res["data"]["imageNo"] + '.jpg' : res["data"]["UserImgUrl"] )+ '" alt="face" node-name="face">\
                                            </div>\
                                            <div class="item">\
                                                <div class="name">' + res["data"]["username"] + '</div>\
                                                <div class="time">' + res["data"]["timeMsg"] + '</div>\
                                            </div>\
                                            <div class="like" node-name="like" data-cId="' + res["data"]["cid"] + '">\
                                                <div class="sprite icon-filminfo-likeA"></div>\
                                                <span class="num_like" node-name="num_like"></span>\
                                            </div>\
                                        </div>\
                                        <div class="words">' + res["data"]["content"] + '</div>\
                                    </li>';
                        toast(res["msg"], 1000, function() {
                            that.fire("ownReview", childReviewHtml);
                            evtFuncs.clear();
                        });
                    },
                    "onError": function (res) {
                        console.error("网络连接失败(" + res.status + ")");
                        that.unLock();
                    }
                })
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
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