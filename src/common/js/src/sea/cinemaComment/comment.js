define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var lazyload = require("lib/dom/lazyload");
    var className = require("lib/dom/className");
    var confirm = require("sea/dialog/confirm");
    var webBridge = require("sea/webBridge");
    var each = require("lib/util/each");
    var ajax = require("lib/io/ajax");
    var toast = require("sea/toast");
    var touch = require("touch");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var param = null;
        var m_lazyLoad = null;
        var mask = true;
        var pageIndex = 1;
        var status = '';
        //---------------事件定义----------------
        var evtFuncs = {
        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_lazyLoad = lazyload(node, { 
                'lazyload': custFuncs.childReview, 
                "height": '3rem' 
            });
            m_lazyLoad.init();
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(node, "tap", "[node-name=like]", custFuncs.selectLike);
            touch.on(node, "tap", "[node-name=reviewlike]", custFuncs.selectLike);
        }
        //-----------------自定义函数-------------
        var custFuncs = {
            childReview: function() {
                if (!mask) {
                    return;
                }
                var param = {
                    "filmNo": opts["filmNo"],
                    "pageIdx" : pageIndex,
                    "receiPage" : 10,
                    "cId": opts["id"]
                }
                ajax({
                    "url": opts["getfilmreviews"],
                    "method": "get",
                    "data": param,
                    "onSuccess": function(res) {
                        var reviewHtml = '';
                        if (res["status"] == 0) {
                            console.log(res.msg);
                            return;
                        }
                        if(res["data"]["countRow"] != 0) {
                            nodeList.num_comment.innerHTML = res["data"]["countRow"];
                        }
                        if(res["data"]["reviews"][0]["isLike"] == 1) {
                            className.remove(nodeList.like.children[0], "icon-filminfo-likeA");
                            className.add(nodeList.like.children[0], "icon-filminfo-like");
                        }
                        if (res["data"]["reviews"][0]["receis"] != null) {
                            each(res["data"]["reviews"][0]["receis"], function(item) {
                                var time = item["timeMsg"].split("/").join("-");
                                reviewHtml +='<li class="commentReview">\
                                            <div class="row">\
                                                <div class="profile">\
                                                    <img onerror="this.src=\'./images/face/2x/208.jpg\'" src="' + (item["userImgUrl"] == ""  ? './images/face/2x/' + item["imageNo"] + '.jpg' : item["userImgUrl"] )+ '" alt="face" node-name="face">\
                                                </div>\
                                                <div class="item">\
                                                    <div class="name">' + (item["userName"] == "" ? '过客' : item["userName"]) + '</div>\
                                                    <div class="time">' + time + '</div>\
                                                </div>\
                                                <div class="like" node-name="reviewlike" data-cId="' + item["id"] + '">\
                                                    <div class="sprite icon-filminfo-like' + ( item["isLike"] == 1 ? '' : 'A' ) + '"></div>\
                                                    <span class="num_like" node-name="num_like">' + ( item["likeAmount"] ==0 ? '' : item["likeAmount"] ) + '</span>\
                                                </div>\
                                            </div>\
                                            <div class="words">' + item["memo"] + '</div>\
                                        </li>';   
                            })
                        }
                        if (res["data"]["pageCount"] <= pageIndex) {
                            reviewHtml += "<li style='text-align: center;line-height: 4rem;color: #909090;'>没有更多评论了~</li>";
                            mask = false;
                        } else {
                            m_lazyLoad.work();
                        } 
                        if(res["data"]["pageCount"] <= 0) {
                            reviewHtml = "<li style='text-align: center;line-height: 4rem;color: #909090;'>暂无回复</li>";
                        }
                        pageIndex++;
                        nodeList.replyreview.innerHTML += reviewHtml;
                    },
                    "onError": function(req) {
                        console.log("网络连接失败: " + req.status);
                    }
                })
            },
            isLike: function(nodeArr) {
                var classNames = nodeArr[0].className.split(/\s+/);
                var numLike = parseInt(nodeArr[1].innerHTML);
                if (classNames[classNames.length - 1] == "icon-filminfo-likeA") {
                    nodeArr[0].classList.remove("icon-filminfo-likeA");
                    nodeArr[0].classList.add("icon-filminfo-like");
                    if (numLike > 0) {
                        nodeArr[1].innerHTML = numLike + 1;
                    } else {
                        nodeArr[1].innerHTML = 1;
                    }
                } else {
                    nodeArr[0].classList.remove("icon-filminfo-like");
                    nodeArr[0].classList.add("icon-filminfo-likeA");
                    if (numLike > 1) {
                        nodeArr[1].innerHTML = numLike - 1;
                    } else {
                        nodeArr[1].innerHTML = '';
                    }
                }
            },
            selectLike : function (ev) {
                var id = null;
                var parNode;
                if (ev.target.parentElement.getAttribute("class") == "like") {
                    id = ev.target.parentNode.dataset.cid;
                    parNode = ev.target.parentNode;
                } else if (ev.target.parentElement.getAttribute("class") == "pictrue")  {
                    id = ev.target.parentNode.children[1].dataset.cid;
                    parNode = ev.target.parentNode.children[1];
                } else if(ev.target.className == "like") {
                    id = ev.target.dataset.cid;
                    parNode = ev.target;
                }
                var nodeArr= parNode.children;
                if (parNode.getAttribute("node-name") == "like") {
                    var choise = 6;
                } else if (parNode.getAttribute("node-name") == "reviewlike") {
                    var choise = 7;
                }
                if(className.has(nodeArr[0], "icon-filminfo-like")) {
                    status = 1;
                } else {
                    status = 0;
                }
                ajax({
                    "url": opts["supportUrl"] + "&filmNo=" + opts["filmNo"] + "&actionType=" + choise + "&status=" + status + "&id=" + id,
                    "onSuccess": function(res) {
                        if (res["status"] != "1") {
                         if(res["msg"] == "未登录") {
                                var dialog = confirm("未登录,去登录吗？",{
                                    "OK": function() {
                                        webBridge.openUrl(opts["loginUrl"]);
                                    }
                                });
                                dialog.init();
                                dialog.show();
                                //webBridge.openUrl(opts["loginUrl"]);
                            } else {
                                toast(res["msg"])
                            }
                            return;
                        }
                        custFuncs.isLike(nodeArr);
                    },
                    "onError": function (req) {
                        console.log("网络连接失败: " + req.status);
                    }
                });
            },
            ownReview: function(html) {                
                if(nodeList.replyreview.children.length == 0) {
                    nodeList.replyreview.innerHTML = html;
                } else if(nodeList.replyreview.children.length == 1){
                    html += "<li style='text-align: center;line-height: 4rem;'>没有更多评论了~</li>";
                    nodeList.replyreview.innerHTML = html;
                } else {
                    nodeList.replyreview.children[0].insertAdjacentHTML("beforeBegin", html);
                }
                if(parseInt(nodeList.num_comment.innerHTML) > 0) {
                    nodeList.num_comment.innerHTML = parseInt(nodeList.num_comment.innerHTML) + 1;
                } else {
                    nodeList.num_comment.innerHTML = 1;
                }
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
            custFuncs.childReview();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.ownReview = custFuncs.ownReview;
        return that;
    }
});