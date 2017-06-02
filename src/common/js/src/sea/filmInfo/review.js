/**
 *评论模块
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var className = require("lib/dom/className");
    var lazyload = require("lib/dom/lazyload");
    var confirm = require("sea/dialog/confirm");
    var webBridge = require("sea/webBridge");
    var ajax = require("lib/io/ajax");
    var toast = require("sea/toast");
    var each = require("lib/util/each");
    var touch = require("touch");


    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var mask = true;  //下拉加载标识
        var pageIndex = 1;//页码标识
        var m_lazyLoad = null;

        //---------------事件定义----------------
        var evtFuncs = {}

        //---------------子模块定义---------------
        var modInit = function () {
            m_lazyLoad = lazyload(document.querySelector("#m_pbd"), {
                'lazyload': custFuncs.loadReview,
                "height": '0.5rem'
            });
            m_lazyLoad.init();
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(node, "tap", "[node-name=like]", custFuncs.selectLike);
            touch.on(node, "tap", "[node-name=reviewlike]", custFuncs.selectLike);
        };

        //-----------------自定义函数-------------
        var custFuncs = {
            selectLike: function (ev) {
                ev.stopPropagation();
                var id = -1;
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
                ajax({
                    "url": opts["supportUrl"] + "&filmNo=" + opts["filmNo"] + "&actionType=" + choise + "&status=" + opts["filmStatus"] + "&id=" + id,
                    "onSuccess": function (res) {
                        if (res["status"] != "1") {
                            if (res["msg"] == "未登录") {
                                var dialog = confirm("未登录,去登录吗？", {
                                    "OK": function () {
                                        webBridge.openUrl(opts["loginUrl"]);
                                    }
                                });
                                dialog.init();
                                dialog.show();
                                //webBridge.openUrl(opts["loginUrl"]);
                            } else {
                                toast(res["msg"]);
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
            isLike: function (nodeArr) {
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
            loadReview: function () {
                if (!mask) {
                    return;
                }
                ajax({
                    "url": opts["getfilmreviews"],
                    "data": {
                        "filmNo": opts["filmNo"],
                        "filmName": opts["filmName"],
                        "pageIdx": pageIndex,
                        "receiPage": 1
                    },
                    "onSuccess": function (res) {
                        if (res["status"] == 0) {
                            console.log(res.msg);
                            return;
                        }
                        var reviewHtml = '';
                        if (res["data"]["pageCount"] <= 0) {
                            reviewHtml = "<li style='text-align: center;line-height: 4rem;color: #909090;'>暂无评论</li>";
                            mask = false;
                            //return;
                        }
                        if(!!nodeList.count){
                            nodeList.count.parentElement.removeChild(nodeList.count);
                        }
                        if (res["data"]["reviews"].length > 0) {
                            each(res["data"]["reviews"], function (item) {
                                var starArr = [];
                                var start = item.score ? item.score / 2 : 0;
                                var childReviewHtml = '';
                                for (var i = 0; i < 5; i++) {
                                    if (i < parseInt(start)) {
                                        starArr.unshift('<i class="sprite icon-star-full"></i>');
                                    } else if (i == parseInt(start) && parseInt(start) < start) {
                                        starArr.push('<i class="sprite icon-star-half"></i>');
                                    } else {
                                        starArr.push('<i class="sprite icon-star"></i>');
                                    }
                                }
                                reviewHtml += '<li data-url="' + item["commentUrl"] + '">\
                                                        <div class="row" >\
                                                            <div class="profile">\
                                                                <img onerror="this.src=\'./images/face/2x/208.jpg\'" src="' + (item["userImgUrl"] == "" ? './images/face/2x/' + item["imageNo"] + '.jpg' : item["userImgUrl"]) + '" alt="face" node-name="face">\
                                                            </div>\
                                                            <div class="item">\
                                                                <div class="name">' + (item["username"] == "" ? "过客" : item["username"]) + '</div>\
                                                                <div class="range">\
                                                                    <div class="star">' + starArr.join('') + '</div>\
                                                                    <div class="time">' + (item["timeMsg"].split("/").join("-")) + '</div>\
                                                                </div>\
                                                            </div>' + (item["isCanEdit"] == 1 ? '<div class="sprite icon-edit" data-url="' + item["editUrl"] + '"></div>' : '') + '\
                                                        </div>\
                                                        <div class="words">' + item["content"] + '</div>\
                                                        <div class="pictrue">\
                                                            <div class="location">' + (item["cinemaName"] == "" ? '' : '<div class="sprite icon-location"></div><span class="address">' + item["cinemaName"] + '</span>') + '</div>\
                                                            <div class="like" node-name="like" data-cId="' + item["cId"] + '">\
                                                                <div class="sprite ' + (item["isLike"] == 1 ? "icon-filminfo-like" : "icon-filminfo-likeA") + '"></div>\
                                                                <div class="num_like" node-name="num_like">' + (item["likeAmount"] == 0 ? '' : item["likeAmount"]) + '</div>\
                                                            </div>\
                                                            <div class="comment">\
                                                                <div class="sprite icon-comment" node-name="comment" data-url="' + item["commentUrl"] + '"></div>\
                                                                <span class="num_comment" node-name="num_comment" >' + (item["childAmount"] == 0 ? '' : item["childAmount"]) + '</span>\
                                                            </div>\
                                                        </div>\
    									        </li>';
                                if(item["receis"] != null) {
                                    each(item["receis"], function (item) {
                                        childReviewHtml += '<li class="commentReview">\
                                                            <div class="row">\
                                                                <div class="item">\
                                                                    <div class="name">' + (item["userName"] == "" ? "过客" : item["userName"]) + '</div>\
                                                                    <div class="time">' + (item["timeMsg"].split("/").join("-")) + '</div>\
                                                                </div>\
                                                                <div class="like" node-name="reviewlike" data-cId="' + item["id"] + '">\
                                                                  <div class="sprite ' + (item["isLike"] == 1 ? "icon-filminfo-like" : "icon-filminfo-likeA") + '"></div>\
                                                                  <div class="num_like" node-name="num_like">' + (item["likeAmount"] == 0 ? '' : item["likeAmount"]) + '</div>\
                                                                </div>\
                                                            </div>\
                                                            <div class="words">' + item["memo"] + '</div>\
                                                    </li>';
                                    });

                                    reviewHtml += childReviewHtml;
                                }
                            });
                            if(res["data"]["pageCount"] == res["data"]["pageIdx"]) {
                                mask = false;
                                reviewHtml += "<li style='text-align: center;line-height: 4rem;color: #909090;'>共" + res["data"]["countRow"] + "条评论，已全部加载完毕</li>";
                            } else {
                                reviewHtml += "<li style='text-align: center;line-height: 4rem; padding-bottom: 2rem; color: #909090;' node-name='count'>共" + res["data"]["countRow"] + "条评论，下拉加载更多</li>";
                            }
                            m_lazyLoad.work();
                        }
                        pageIndex++;
                        nodeList.reviewContent.innerHTML += reviewHtml;
                        nodeList = parseNode(node);
                    },
                    "onError": function (req) {
                        console.log("网络连接失败: " + req.status);
                    }
                });
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
            custFuncs.loadReview();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});