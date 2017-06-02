/**
 * 影片点赞
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var className = require("lib/dom/className");
    var closest = require("lib/dom/closest");
    var contains = require("lib/dom/contains");
    var ajax = require("lib/io/ajax");
    var webBridge = require("sea/webBridge");
    var confirm = require("sea/dialog/confirm");
    var toast = require("sea/toast");
    var touch = require("touch");
    
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            iLike: function (ev) {
                var target = closest(ev.target, '.like-btn', nodeList.label_like);
                custFuncs.selectLike(1, target);
            },
            iUnlike: function (ev) {
                var target = closest(ev.target, '.like-btn', nodeList.label_like);
                custFuncs.selectLike(2, target);
            },
            wantSee: function (ev) {
                var target = closest(ev.target, '.like-btn', nodeList.label_want);
                custFuncs.selectLike(3, target);
            },
            videoPlay: function (ev) {
                var target = closest(ev.target, '[node-name=img]', node);
                console.log(target.getAttribute("data-href"));
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(node, "tap", "[node-name=like]", evtFuncs.iLike);
            touch.on(node, "tap", "[node-name=unlike]", evtFuncs.iUnlike);
            touch.on(node, "tap", "[node-name=want_see]", evtFuncs.wantSee);
        };

        //-----------------自定义函数-------------
        var custFuncs = {
            selectLike : function (choise, dom) {
                ajax({
                    "url": opts["supportUrl"]+"&filmNo="+opts["filmNo"]+"&actionType="+choise+"&status="+opts["filmStatus"],
                    "onSuccess": function(res) {
                        console.log(res);
                        if (res["status"] != "1") {
                            if(res["msg"] == "未登录") {
                                var dialog = confirm("未登录,去登录吗？",{
                                    "OK": function() {
                                        webBridge.openUrl(opts["loginUrl"]);
                                    }
                                });
                                dialog.init();
                                dialog.show();
                               // webBridge.openUrl(opts["loginUrl"]);
                            } else if(res["msg"] == "你已点击过，不能再次点击！") {
                                toast(res["msg"])
                            }
                            return;
                        }
                        custFuncs.updateView(dom);
                    },
                    "onError": function (req) {
                        console.log("网络连接失败: " + req.status);
                    }
                });
            },

            updateView: function(dom) {
                if (nodeList.num) {
                    var count = parseInt(nodeList.num.innerHTML);
                    if (className.has(nodeList.heartIcon, 'icon-heart')) {
                        count++;
                    }
                    if (className.has(nodeList.heartIcon, 'icon-heart-full')) {
                        count--;
                    }
                    nodeList.num.innerHTML = count;
                }
                if (nodeList.likeIcon && contains(dom, nodeList.likeIcon)) {
                    if (className.has(nodeList.hateIcon, 'icon-heart3')) {
                        toast('您已选择了不喜欢该影片');
                        return;
                    }
                    className.toggle(nodeList.likeIcon, 'icon-heart', 'icon-heart-full');
                }
                if (nodeList.hateIcon && contains(dom, nodeList.hateIcon)) {
                    if (className.has(nodeList.likeIcon, 'icon-heart-full')) {
                        toast('您已选择了喜欢该影片');
                        return;
                    }
                    className.toggle(nodeList.hateIcon, 'icon-heart', 'icon-heart3');
                }
                if (nodeList.heartIcon && contains(dom, nodeList.heartIcon)) {
                    className.toggle(nodeList.heartIcon, 'icon-heart', 'icon-heart-full');
                }
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