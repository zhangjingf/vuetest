/**
 * 我的钱包--会员卡
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var encodeHTML = require("lib/str/encodeHTML");
    //var webBridge = require("sea/webBridge");
    var confirm = require("sea/dialog/confirm");
    var closest = require("lib/dom/closest");
    var prompt = require("sea/dialog/prompt");
    var queryToJson = require("lib/json/queryToJson");
    var URL = require("lib/util/URL");
    var ajax = require("lib/io/ajax");
    var touch = require("touch");
    var webBridge = require("sea/webBridge");
    var showMessage = require("sea/showMessage");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        var m_confirm = null;
        var m_prompt = null;
        var url = null;

        var pNode = null;
        //---------------事件定义----------------
        var evtFuncs = {
            querySum : function (e) {
                var target = e.target;
                pNode = closest(target, "[node-name=querySum]", node);/*开始元素,含有的属性,终点元素*/
                if (pNode == null) {
                    return;
                }
                var currCardNo = pNode.getAttribute('data-card-no');
                var currLinkNo = pNode.getAttribute('data-link-no');
                var currCinemaNo = pNode.getAttribute('data-cinema-no');

                var opt = {
                    "title": "请输入会员卡密码",
                    "OKText": "确定",
                    "cancelText": "取消",
                    "OK": function() {
                        var currCardPwd = m_prompt.getInputMsg();
                        m_prompt.hide();

                        if (currCardPwd.length >16 || currCardPwd.length < 6) {
                            showMessage("会员卡的长度必须在6~16位,请重新输入");
                        } else {
                            var param = {"currCardNo": currCardNo, "currLinkNo": currLinkNo, "currCinemaNo": currCinemaNo, "currCardPwd": currCardPwd};
                            custFuncs.showSum(param);
                        }
                    },
                    "cancel": function() {}
                };
                m_prompt = prompt(opt);
                m_prompt.init();
                m_prompt.show();
            },
            unbindCard : function (e) {
                var target = e.target;
                pNode = closest(target, "[node-name=unbindCard]", node);/*开始元素,含有的属性,终点元素*/
                if (pNode == null) {
                    return;
                }
                var currCardNo = pNode.getAttribute('data-card-no');
                var content = "你确定要解除该会员卡的绑定？";
                var opt = {
                    "title": "温馨提示",
                    "OKText": "确定",
                    "cancelText": "取消",
                    "OK": function() {
                        var param = {
                            "cardNo": currCardNo
                        };
                        ajax({
                            "url": opts['unbindCardUrl'],
                            "method": "post",
                            "data": param,
                            "onSuccess": function(res) {
                                if (res["status"] == 0) {
                                    showMessage(res["msg"]);
                                    return;
                                }
                                var ycNode = closest(pNode, "[node-name=cinemaCityCard]", node);
                                ycNode.style.display = "none";
                            },
                            "onError": function(res) {
                                console.error("网络连接失败:" + res.status);
                            }
                        });
                        /*webBridge.userCardUnbind({"userId": userId, "cardNo": currCardNo}, function (res) {
                            var ycNode = closest(pNode, "[node-name=cinemaCityCard]", node);
                            ycNode.style.display = "none";
                        });*/
                    },
                    "cancel": function() {}
                };
                m_confirm = confirm(content, opt);
                m_confirm.init();
                m_confirm.show();
            },
            unbindLuxury: function (e)　{
                var target = e.target;
                pNode = closest(target, "[node-name=unbind]", node);/*开始元素,含有的属性,终点元素*/
                if (pNode == null) {
                    return;
                }

                var currCardNo = pNode.getAttribute('data-card-no');
                var content = "你确定要解除该尊享卡的绑定？";
                var opt = {
                    "title": "温馨提示",
                    "OKText": "确定",
                    "cancelText": "取消",
                    "OK": function() {
                        var param = {
                            "cardNo": currCardNo
                        };
                        ajax({
                            "url": opts['unbindCardUrl'],
                            "method": "post",
                            "data": param,
                            "onSuccess": function(res) {
                                if (res["status"] == 0) {
                                    showMessage(res["msg"]);
                                    return;
                                }
                                var ycNode = closest(pNode, "[node-name=luxuryCard]", node);
                                ycNode.style.display = "none";
                            },
                            "onError": function(res) {
                                console.error("网络连接失败:" + res.status);
                            }
                        });
                    },
                    "cancel": function() {}
                };
                m_confirm = confirm(content, opt);
                m_confirm.init();
                m_confirm.show();
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(node, 'tap', '[node-name=querySum]', evtFuncs.querySum);
            touch.on(node, 'tap', '[node-name=unbindCard]', evtFuncs.unbindCard);
            touch.on(node, 'tap', '[node-name=unbind]', evtFuncs.unbindLuxury);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            /*查询卡的余额*/
            showSum : function (params) {
                var param = {
                    "cinemaNo": params.currCinemaNo,
                    "linkNo": params.currLinkNo,
                    "cardNo": params.currCardNo,
                    "cardPwd": params.currCardPwd
                };

                ajax({
                    "url": opts['queryBalanceUrl'],
                    "method": "post",
                    "data": param,
                    "onSuccess": function(res) {

                        if (res["status"] == 0) {
                            //showMessage("查询会员卡失败,请稍后再试");
                            showMessage(res["msg"]);
                            return;
                        }
                        var ycNode = closest(pNode, "[node-name=cinemaCityCard]", node);
                        var ycNodeList = parseNode(ycNode);
                        ycNodeList.queryBalance.innerHTML = encodeHTML("¥" + res["data"]["cardBalance"]);
                    },
                    "onError": function(res) {
                        console.error("网络连接失败:" + res.status);
                    }
                });
            },
            fromActPayResult: function () {
                if (url['form'] == "payResult") {
                    webBridge.close(2);
                }
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;

            url = queryToJson(URL.parse(location.href)['query']);
            custFuncs.fromActPayResult();

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});