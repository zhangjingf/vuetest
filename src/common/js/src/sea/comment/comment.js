/**
 *
 * 发表评论
 *
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var className = require("lib/dom/className");
    var ajax = require("lib/io/ajax");
    var webBridge = require("sea/webBridge");
    var showMessage = require("sea/showMessage");
    var touch = require("touch");
    var cinameInfor = require("sea/comment/cinemaInfor");
    var toast = require("sea/toast");
    var storageMessager = require("lib/evt/storageMessager");

    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();
        var index = 0;
        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            submit: function() {
                var txt = nodeList.textarea.value;
                var grade = nodeList.grade.innerHTML.split("分")[0];
                if (txt.length < 5) {
                    toast("评论字数不少于5个字哦~");
                    return;
                } else if(txt.length > 140) {
                    toast("评论字数不多于140个字哦~");
                    return;
                }
                custFuncs.setReview(txt, grade);
            },
            textNum: function() {
                var txt = nodeList.textarea.value;
                var num = txt.length;
                if (num >= 0) {
                    nodeList.word_num.innerHTML = num + "/140字";
                }
            },
            clear: function() {
                if(nodeList.textarea.value) {
                    nodeList.textarea.value = " ";
                    nodeList.word_num.innerHTML = 0 + "/140字";
                }
            },
            score: function(ev) {
                className.remove(ev.target, "icon-star-comment-gray");
                if(ev.target.dataset.index >= index) {
                    if(className.has(ev.target, "icon-star-comment1")) {
                        className.remove(ev.target, "icon-star-comment3");
                        className.remove(ev.target, "icon-star-comment1");
                        className.add(ev.target, "icon-star-comment2");
                    } else  if(className.has(ev.target, "icon-star-comment2")){
                        className.remove(ev.target, "icon-star-comment1");
                        className.remove(ev.target, "icon-star-comment2");
                        className.add(ev.target, "icon-star-comment3");
                    } else {
                        className.remove(ev.target, "icon-star-comment3");
                        className.remove(ev.target, "icon-star-comment2");
                        className.add(ev.target, "icon-star-comment1");
                    }
                }
                index = ev.target.dataset.index;
                for( var i = 0; i < ev.target.dataset.index - 1; i++) {
                    className.remove(ev.target.parentNode.children[i], "icon-star-comment-gray");
                    if(className.has(ev.target.parentNode.children[i], "icon-star-comment2")) {
                        className.remove(ev.target.parentNode.children[i], "icon-star-comment3");
                        className.remove(ev.target.parentNode.children[i], "icon-star-comment2");
                        className.add(ev.target.parentNode.children[i], "icon-star-comment1");
                    }
                    else{
                        className.remove(ev.target.parentNode.children[i], "icon-star-comment3");
                        className.add(ev.target.parentNode.children[i], "icon-star-comment1");
                    }
                }
                for( var j = ev.target.dataset.index; j < ev.target.parentNode.children.length; j++) {
                    className.remove(ev.target.parentNode.children[j], "icon-star-comment-gray");
                    className.remove(ev.target.parentNode.children[j], "icon-star-comment2");
                    className.remove(ev.target.parentNode.children[j], "icon-star-comment1");
                    className.add(ev.target.parentNode.children[j], "icon-star-comment3");
                }
                switch(parseInt(ev.target.dataset.index)) {
                    case 1: 
                        if (className.has(ev.target, "icon-star-comment1")) {
                            nodeList.grade.innerHTML = '2分 | 很烂';
                        } else if(className.has(ev.target, "icon-star-comment2")) {
                            nodeList.grade.innerHTML = '1分 | 很烂';
                        } else {
                            nodeList.grade.innerHTML = '暂无评分';
                        }
                        break;
                    case 2: 
                        if (className.has(ev.target, "icon-star-comment1")) {
                            nodeList.grade.innerHTML = '4分 | 比较差';
                        }
                        else if(className.has(ev.target, "icon-star-comment2")) {
                            nodeList.grade.innerHTML = '3分 | 比较差';
                        } else {
                            nodeList.grade.innerHTML = '2分 | 很烂';
                        }
                        break;
                    case 3: 
                        if (className.has(ev.target, "icon-star-comment1")) {
                            nodeList.grade.innerHTML = '6分 | 一般般';
                        } else if (className.has(ev.target, "icon-star-comment2")) {
                            nodeList.grade.innerHTML = '5分 | 一般般';
                        } else {
                            nodeList.grade.innerHTML = '4分 | 比较差';
                        }
                        break;
                    case 4: 
                        if (className.has(ev.target, "icon-star-comment1")) {
                            nodeList.grade.innerHTML = '8分 | 比较好';
                        } else if(className.has(ev.target, "icon-star-comment2")) {
                            nodeList.grade.innerHTML = '7分 | 比较好';
                        } else {
                            nodeList.grade.innerHTML = '6分 | 一般般';
                        }
                        break;
                    case 5: 
                        if (className.has(ev.target, "icon-star-comment1")) {
                            nodeList.grade.innerHTML = '10分 | 很棒';
                        } else if(className.has(ev.target, "icon-star-comment2")) {
                            nodeList.grade.innerHTML = '9分 | 很棒';
                        } else {
                            nodeList.grade.innerHTML = '8分 | 比较好';
                        }
                        break;
                }
            },
            choose: function(ev) {
                if(ev.data.dataset) {
                    nodeList.more.innerHTML = '<div data-cinemaNo="' + ev.data.dataset.cinemano + '" node-name="cinema">' + ev.data.innerHTML + '</div><div class="more sprite icon-more" ></div>'; 
                } else {
                    nodeList.more.innerHTML = '<div node-name="cinema">' + ev.data + '</div><div class="more sprite icon-more" ></div>'; 

                }
        }

        }

        //---------------子模块定义---------------
        var modInit = function() {

        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.textarea, "input", evtFuncs.textNum);
            touch.on(nodeList.more, "tap", custFuncs.cinameInfor);
            touch.on(nodeList.submit, "tap", evtFuncs.submit);
            touch.on(nodeList.clear, "tap", evtFuncs.clear);
            touch.on(nodeList.score,  "tap", "i", evtFuncs.score);  
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            cinameInfor: function() {
                var m_dialog = cinameInfor(opts);
                m_dialog.init();
                m_dialog.bind("cinemaMsg", evtFuncs.choose);
                m_dialog.show();
            },
            setReview: function(txt, grade) {
                var cinemano = nodeList.more.children[0].dataset.cinemano;
                var param = {
                    "reviewType": "1",
                    "filmNo": opts["filmNo"],
                    "cinemaNo": cinemano,
                    "content": txt,
                    "score" : grade,
                    "cId": opts["id"]
                }
                ajax({
                    "url": opts["commentFeedbackUrl"],
                    "method": "get",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        if( res["status"] == 0) {
                            toast(res["msg"]);
                            return;
                        }
                        toast(res["msg"], 1000, function() {
                            storageMessager.send("commentLaunchDetail");
                            webBridge.close();
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
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
            evtFuncs.textNum();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        return that;
    }
});