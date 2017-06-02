/**
 * 会员卡支付单独卖品
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var ajax = require("lib/io/ajax");
    var showMessage = require("sea/showMessage");
    var webBridge = require("sea/webBridge");
    var showCards = require("sea/dialog/showCards");
    var loading = require("sea/dialog/loading");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        var selectedCardInfo = {};
        var m_loading = null;

        //---------------事件定义----------------
        var evtFuncs = {
            payMemberCard: function () {
                custFuncs.payMemberCard();
            },

            showCardList: function () {
                var cards = nodeList.card.innerHTML;
                var dialog = showCards(cards, {
                    "OKText": "确定",
                    "cancelText": "取消",
                    "OK": function () {
                        selectedCardInfo = dialog.getSelectedCard();
                        if (selectedCardInfo != null) {
                            nodeList.member_card.innerHTML = selectedCardInfo["cinemaname"] + "&nbsp&nbsp" + selectedCardInfo["card"];
                        }
                    },
                    "cancel": function () {
                    }
                });
                dialog.init();
                dialog.show();
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_loading = loading('支付中，请稍后');
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.payNow, "tap", evtFuncs.payMemberCard);
            touch.on(nodeList.cardList, "tap", evtFuncs.showCardList);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            payMemberCard: function () {
                if (that.isLock()) {
                    return;
                }
                var cardPsd = nodeList.psd.value;
                if (cardPsd.length <= 0) {
                    showMessage("会员卡密码不能为空，请重新输入");
                    return;
                }

                var param = {
                    "actId":opts["actId"],
                    "cardType":"2",
                    "cardPwd": nodeList.psd.value,
                    "buyNumber":opts["couponNum"],
                    "buyMoney":parseFloat(opts.pageInt["payMoney"]).toFixed(2),
                    "cardNo": selectedCardInfo["card"] || opts.pageInt["cardNo"],
                    "linkNo": selectedCardInfo["linkno"] || opts.pageInt["linkNo"],
                    "exCinemaNo": selectedCardInfo["excinemano"] || opts.pageInt["exCinemaNo"]
                };

                that.lock();
                m_loading.show();
                ajax({
                    "url": opts["pageInt"]["payMember"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        m_loading.hide();
                        if (res["status"] != 1) {
                            showMessage(res["msg"],function(){
                                if(res["status"]=="-1104" || res["status"]=="-1200") {
                                    webBridge.close();
                                }
                            });
                            return;
                        }
                        webBridge.openUrl(opts.pageInt["toResult"]+"&orderno="+res["data"]["orderNo"]+"&actId="+opts["actId"]);
                    },
                    "onError": function (req) {
                        that.unLock();
                        m_loading.hide();
                        console.error("网络连接失败:" + req.msg);
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
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        return that;
    }
});