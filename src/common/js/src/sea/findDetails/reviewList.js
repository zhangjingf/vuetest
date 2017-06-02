/**
 * 评论
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var closest = require("lib/dom/closest");
    var each = require("lib/util/each");
    var touch = require("touch");
    var lazyload = require("lib/dom/lazyload");
    var ajax = require("lib/io/ajax");
    var confirm = require("sea/dialog/confirm");
    var notice = require("sea/dialog/notice");
    var showMessage = require("sea/showMessage");
    var webBridge = require("sea/webBridge");

    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_deleteReviewTip = null;
        var m_lazyLoad = null;

        var mark = true;
        /*下拉加载文章标记*/
        var pageIndex = 1;

        //---------------事件定义----------------
        var evtFuncs = {
            //删除评论
            deleteReview: function (ev) {
                var item = closest(ev.target, "[data-cid]", node);
                var cid = item.getAttribute("data-cid");
                m_deleteReviewTip = confirm("是否删除这条评论？", {
                    "OK": function () {
                        custFuncs.deleteReview(cid, item);
                    }
                });
                m_deleteReviewTip.init();
                m_deleteReviewTip.show();
            },
            selectLike: function (ev) {
                var cid = closest(ev.target, "[data-cid]", node).getAttribute("data-cid");
                var parentNode = closest(ev.target, "[node-name='likeReview']", node);
                var _type = 1;
                if(!parentNode.classList.contains("like-viewA")) {
                  /*  var showNotice = notice('已经点过赞了');
                    showNotice.init();
                    showNotice.show({'afterAnimate': function () {
                        setTimeout(showNotice.hide,500);}
                    });
                    return*/
                    _type = 0;
                }
                custFuncs.selectLike(cid,parentNode,_type);
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_lazyLoad = lazyload(document.querySelector("#m_pbd"), {'lazyload': custFuncs.loadReview, "height": '5rem'});
            m_lazyLoad.init();
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(node, 'tap', "[node-name='deleteReview']", evtFuncs.deleteReview);
            touch.on(node, 'tap', "[node-name='likeReview']", evtFuncs.selectLike);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            //删除评论
            deleteReview: function (cid, itemNode) {
                var param = {
                    'id': opts["articleID"],
                    'cid': cid
                }
                ajax({
                    "url": opts["deleteReview"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        if (res["status"] != '1') {
                            console.log(res.msg);
                            return;
                        }
                        itemNode.remove();
                        var num = parseInt(nodeList.num.innerHTML);
                        nodeList.num.innerHTML = num - 1;
                        var showNotice = notice(res.msg);
                        showNotice.init();
                        showNotice.show({'afterAnimate': function () {
                            setTimeout(showNotice.hide,500);}
                        });
                    },
                    "onError": function (req) {
                        console.log("网络连接失败: " + req.status);
                    }
                });
            },
            setReview: function (data) {
                var html = '';
                html = '<div class="item" data-cid="' + data["cid"] + '">\
				<div class="info">\
				<div class="face">\
				<img src="'+ (data["UserImgUrl"] == ""  ? './images/face/2x/' + data["imageNo"] + '.jpg' : data["UserImgUrl"]) +'" alt=""></div>\
				<div class="user-info">\
				<div class="name">' + data["username"] + '</div>\
				<div class="time">刚刚</div>\
				</div><div class="userActiion"><div class="delete-review" node-name="deleteReview">删除</div> <div class="like-review like-viewA" node-name="likeReview"><div class="icon-filminfo-likeA" node-name="like"></div><span></span> </div></div>\
				</div><div class="reviewContent" id="m_content">' + data["content"] + '</div></div>';
                nodeList.list.insertAdjacentHTML('AfterBegin', html);
                var num = parseInt(nodeList.num.innerHTML);
                if (num == 0) {
                    nodeList.noReview.style.display = 'none';
                }
                nodeList.num.innerHTML = num + 1;
            },
            loadReview: function () {
                if (!mark) {
                    return;
                }
                var param = {
                    'id': opts["articleID"],
                    'page': ++pageIndex,
                    'row': '6',
                    'isCount': '1'
                };
                ajax({
                    "url": opts["reviewList"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        if (res["status"] != '1') {
                            console.log(res.msg);
                            return;
                        }
                        var contentHtml = '';
                        if (res["data"]["comments"].length < 1) {
                            mark = false;
                            nodeList.more.innerHTML = '已经到底了';
                            return;
                        }
                        each(res["data"]["comments"], function (item) {
                            var likeNum = item["likeNum"].split(',')[0] == '0' ? '' : item["likeNum"].split(',')[0];
                            var haveLike = item["likeNum"].split(',')[1]=='0' ? 'icon-filminfo-likeA': 'icon-filminfo-unLike' ;
                            var haveLike2 = item["likeNum"].split(',')[1]=='0' ? 'like-viewA': '' ;
                            contentHtml += '<div class="item" data-cid="' + item["cid"] + '">\
										<div class="info">\
										<div class="face">\
										<img onerror="this.src=\'./images/face/2x/208.jpg\'" src="'+ (item["userImgUrl"] == ""  ? './images/face/2x/' + item["imageNo"] + '.jpg' : item["userImgUrl"]) +'" alt=""></div>\
										<div class="user-info">\
										<div class="name">' + item["username"] + '&nbsp</div>\
										<div class="time">' + item["timeMsg"] + '</div>\
										</div><div class="userActiion">';
                            if (item["isdel"] == '1') {
                                contentHtml += '<div class="delete-review" node-name="deleteReview">删除</div>';
                            }
                            contentHtml += '<div class="like-review ' + haveLike2 +'" node-name="likeReview"><div class="icon-film '+ haveLike +'" node-name="like"></div><span>'+likeNum+'</span></div></div></div><div class="reviewContent">' + item["content"] + '</div></div>';
                        });
                        nodeList.list.innerHTML += contentHtml;
                        m_lazyLoad.work();
                    },
                    "onError": function (req) {
                        console.log("网络连接失败: " + req.status);
                    }
                });
            },
            selectLike : function (cid,parentNode,type) {
                if(opts["isLogin"] !="1") {
                    var dialog = confirm("未登录,去登录吗？",{
                        "OK": function() {
                            webBridge.openUrl(opts["loginUrl"]);
                        }
                    });
                    dialog.init();
                    dialog.show();
                } else {
                  /*  if (hasLiked) {
                        showMessage('您已经点击过了');
                        return;
                    }*/
                    if(that.isLock()) {
                        return;
                    }
                    that.lock();
                    ajax({
                        "url": opts["reviewLike"]+"&filmNo="+cid+"&actionType=4&status=" +type,
                        "onSuccess": function(res) {
                            that.unLock();
                            if (res["status"] != "1") {
                                showMessage(res["msg"]);
                                return;
                            }
                            if(type==1) {
                                parentNode.firstElementChild.classList.remove("icon-filminfo-likeA");
                                parentNode.firstElementChild.classList.add("icon-filminfo-unLike");
                                parentNode.classList.remove("like-viewA");
                                var _number = parentNode.lastElementChild.innerHTML == ''? 0 : parseInt(parentNode.lastElementChild.innerHTML);
                                parentNode.lastElementChild.innerHTML = _number+1;
                            } else if(type==0) {
                                parentNode.firstElementChild.classList.remove("icon-filminfo-unLike");
                                parentNode.firstElementChild.classList.add("icon-filminfo-likeA");
                                parentNode.classList.add("like-viewA");
                                var _number = parseInt(parentNode.lastElementChild.innerHTML)-1==0? '': (parseInt(parentNode.lastElementChild.innerHTML)-1);
                                parentNode.lastElementChild.innerHTML = _number;
                            }
                        },
                        "onError": function (req) {
                            that.unLock();
                            console.log("网络连接失败: " + req.status);
                        }
                    });
                }
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
        that.setReview = custFuncs.setReview;
        return that;
    }
});