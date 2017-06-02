/**
 *订单详情
 *
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var ajax = require("lib/io/ajax");
    var webBridge = require("sea/webBridge");
    var each = require("lib/util/each");
    var loading = require("sea/dialog/loading");
    var showMessage = require("sea/showMessage");
    var dialogRemind = require("sea/orderDetails/dialogRemind");
    var jsonToQuery = require("lib/json/jsonToQuery");

    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_loading = null;

        //---------------事件定义----------------
        var evtFuncs = {
            endorse: function (ev) {
                //	改签
                custFuncs.backChangeRule("1");
               /* var dialog = dialogRemind({
                    "OK": function () {
                        custFuncs.backChangeRule("1");
                    }
                });
                dialog.init();
                dialog.show();*/

            },
            refund: function (ev) {
                //	退票
                custFuncs.backChangeRule("0");
            },
            refundSchedule: function () {
                webBridge.openUrl(nodeList.refundSchedule.getAttribute("data-url"),'blank');
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_loading = loading('加载中，请稍后');
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            if (!!nodeList.endorse) {
                touch.on(nodeList.endorse, "tap", evtFuncs.endorse);
            }
            if (!!nodeList.refund) {
                touch.on(nodeList.refund, "tap", evtFuncs.refund);
            }
            if(!!nodeList.refundSchedule) {
                touch.on(nodeList.refundSchedule, "tap", evtFuncs.refundSchedule);
            }
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            backChangeRule: function (actionType) {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                m_loading.show();
                var param = {
                    "actionType":actionType,
                    "orderNo": opts["orderNo"],
                    "cinemaNo":  opts["cinemaNo"],
                    "orderPrice": opts["orderPrice"],
                    "curPayChannel" : opts["curPayChannel"]
                }
                ajax({
                    "url": opts["backChangeRule"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        m_loading.hide();
                        if (res["status"] != 1) {
                            showMessage(res.msg);
                            return;
                        }
                        if(actionType=='0') {
                            webBridge.openUrl(res["data"]["url"]);
                        } else if(actionType=='1') {
                            var _html= '';
                            var _IntegralNum= res["data"]["integralNum"];//改签修改扣除的积分
                            var curPayChannel = [['USERCARD','ACCOUNTPAY','USERCARD_COMMON','USER_MEMBER'],['影城会员卡','海洋会员','尊享卡','普通现金支付']];//USERCARD 影城会员卡，ACCOUNTPAY 虚拟会员卡，USERCARD_COMMON 尊享卡， USER_MEMBER 普通现金支付
                            each(res["data"]["dataRuleArr"]["payChannels"], function (item) {
                                _html += curPayChannel[1][curPayChannel[0].indexOf(item["payChannel"])]+'每月可改签'+item["monthNum"]+'次,';
                            });
                            _html += '每次改签需扣除100积分作为手续费';
                            var dialog = dialogRemind(_html,{
                                "OK": function () {
                                    var _json = {
                                        'orderNo':opts['orderNo'],
                                        'cinemaNo':opts['cinemaNo'],
                                        'changeInfo':opts['changeInfo'],
                                        'seatNum':opts['seatNum'],
                                        'goods':opts['goods'],
                                        'orderNoBackPrice':opts['orderPrice'],
                                        'integralNum':_IntegralNum
                                    }
                                    var _query = jsonToQuery(_json, true);
                                    webBridge.openUrl(res["data"]["url"]+'&'+_query);

                                }
                            });
                            dialog.init();
                            dialog.show();
                        }

                    },
                    "onError": function (req) {
                        that.unLock();
                        m_loading.hide();
                        console.error("网络连接失败:" + req.msg);
                    }
                });
            },
            changeticketText: function (txt) {
                nodeList.ticketText.innerHTML = txt;
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
        that.changeticketText = custFuncs.changeticketText;

        return that;
    }
});