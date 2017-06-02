/**
 *
 *改签
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var each = require("lib/util/each");
    var showMessage = require("sea/showMessage");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    var ajax = require('lib/io/ajax');
    var loading = require("sea/dialog/loading");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_loading = null;
        var countTime = '0分0秒';/*倒计时时间*/

        //---------------事件定义----------------
        var evtFuncs = {
            payOrder: function () {
              custFuncs.payOrder();
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_loading = loading();
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.payOrder, "tap", evtFuncs.payOrder);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            payOrder: function (data) {
                /*去支付链接由这个函数置换，*/
                that.fire("getCountTime",{});
                if(countTime=='0分0秒') {
                    showMessage("订单改签超时!");
                    return;
                }
                if(!!opts["payUrl"]) {
                    webBridge.openUrl(opts["payUrl"]);
                    return;
                }
                if (that.isLock()) {
                    return;
                }
                that.lock();
                m_loading.show();
                var _bankNo = '';
                switch (opts["payChannelNoBack"]) {
                    case 'ACCOUNTPAY':
                        _bankNo = 'ACCOUNTPAY';
                        break;
                    case 'ALIPAY4':
                        _bankNo = 'ALIPAY';
                        break;
                    case 'WEIXIN7_AP':
                        _bankNo = 'WEIXIN7_AP';
                        break;
                    case 'ICBC':
                        _bankNo = 'ICBC_05';
                        break;
                    case 'SPDB':
                        _bankNo = 'SPDB_05';
                        break;
                    case 'CCB7':
                        _bankNo = 'CCB7_05';
                        break;
                    case 'ICBC_IOS|I_IOS_V2':
                        _bankNo = 'ICBC_IOS|I_IOS_V2';
                        break;
                }
                var param = {
                    "orderNo": opts["url"]["orderNo"],
                    "orderNoBack": opts["orderNoBack"],
                    "bankNo": _bankNo,
                    "channelType": opts["payChannelNoBack"],
                    "payPrice": opts["payPrice"],
                    "isGuiCard": opts["isGuiCard"],
                    "fillPriceSing": opts["fillPriceSing"],
                    "integralNum": opts["integralNum"],
                    "orderNoBackPrice": opts["orderNoBackPrice"],
                    "backPrice": opts["backPrice"],
                    "userRemark": '就是要改签'  //用户改签理由
                };
                ajax({
                    "url": opts["changeOrderUrl"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function(res) {
                        that.unLock();
                        m_loading.hide();
                        if(res["status"] == '0') {
                            showMessage(res["msg"], function () {
                                webBridge.close(3,3);
                            });
                            return;
                        }
                        if (res["status"] != '1') {
                            showMessage(res["msg"]);
                            return;
                        }
                        webBridge.openUrl(res['data']['url']);
                    },
                    "onError": function(req) {
                        that.unLock();
                        m_loading.hide();
                        console.error("网络连接失败:" + req.msg);
                    }
                });
            },
            timeChange: function (count) {
                /*获取倒计时时间*/
                countTime = count;
                //console.log(countTime)
            }
        };

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
        }
        //-----------------暴露各种方法-----------
        that.init = init;
        that.payOrder = custFuncs.payOrder;
        that.timeChange = custFuncs.timeChange;
        return that;
    }
});
