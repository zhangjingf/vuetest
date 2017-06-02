/**
 *订单详情
 *
 *
 */
define(function(require, exports, module) {
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
    var dialogRemind = require("sea/payMealOrder/dialogRemind");

    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_loading = null;

        //---------------事件定义----------------
        var evtFuncs = {
            refund: function(ev) {
                //	退票
                if (opts["isSnacksBack"] != '1') {
                    return;
                }
                custFuncs.backChangeRule("3");
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
            m_loading = loading('加载中，请稍后');
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.refund, "tap", evtFuncs.refund);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            backChangeRule: function(actionType) {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                m_loading.show();
                var param = {
                    "isSeller": '1',
                    "actionType": actionType,
                    "orderNo": opts["orderNo"],
                    "cinemaNo": opts["cinemaNo"],
                    "orderPrice": opts["pageInt"]["orderPrice"],
                    "curPayChannel": 'USER_MEMBER'
                }
                ajax({
                    "url": opts["pageInt"]["backChangeRule"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function(res) {
                        that.unLock();
                        m_loading.hide();
                        if (res["status"] != 1) {
                            showMessage(res.msg);
                            return;
                        }
                        if(res["data"]["dataRuleArr"]["payChannels"].length > 0) {
                            var _html = '';
                            var curPayChannel = [
                                ['USERCARD', 'ACCOUNTPAY', 'USERCARD_COMMON', 'USER_MEMBER'],
                                ['影城会员卡', '海洋会员', '尊享卡', '普通现金支付']
                            ]; //USERCARD 影城会员卡，ACCOUNTPAY 虚拟会员卡，USERCARD_COMMON 尊享卡， USER_MEMBER 普通现金支付
                            each(res["data"]["dataRuleArr"]["payChannels"], function(item) {
                                _html += curPayChannel[1][curPayChannel[0].indexOf(item["payChannel"])] + '每月可退款' + item["monthNum"] + '次,每次退款需消耗' + item["integralNum"] + '积分<br/>';
                            });
                            var dialog = dialogRemind(_html);
                            dialog.init();
                            dialog.show();
                        }
                    },
                    "onError": function(req) {
                        that.unLock();
                        m_loading.hide();
                        console.error("网络连接失败:" + req.msg);
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