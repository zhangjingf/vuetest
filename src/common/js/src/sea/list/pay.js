/**
 * 支付方式
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var loading = require("sea/dialog/loading");
    var webBridge = require("sea/webBridge");
    var className = require("lib/dom/className");
    var showMessage = require('sea/showMessage');
    var ajax = require("lib/io/ajax");
    var toast = require("sea/toast");
    var touch = require("touch");

    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_loading = null;
        var payData = {"data":{}};
        var orderNo = null;
        var flag = false;
        var index = 0;
        var node = null;
        //---------------事件定义----------------
        var evtFuncs = {}

        //---------------子模块定义---------------
        var modInit = function () {
            m_loading = loading();
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.payOrder, "tap", custFuncs.payOrder);
            webBridge.checkOrderInfo = custFuncs.orderStatus;
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            payOrder: function () {
                if (payData.type == null) {
                    toast("请先选择支付方式");
                    return;
                }
                switch (payData.type.payType) {
                    case 1:
                        custFuncs.payForBank("ALIPAY4", "ALIPAY");
                        break;
                    case 2:
                        custFuncs.payForBank("WEIXIN7_AP", "WEIXIN7_AP");
                        break;
                    case 3:
                        custFuncs.payForBank("ICBC", "ICBC_05");
                        break;
                    case 4:
                        custFuncs.payForBank("SPDB", "SPDB_05");
                        break;
                    case 5:
                        custFuncs.payForBank("CCB7", "CCB7_05");
                        break;
                    case 6:
                        toast("暂不支持移动话费支付");
                        break;
                    case 7:
                        custFuncs.payForApplePay("ICBC_IOS|I_IOS_V2", "ICBC_IOS|I_IOS_V2");
                        break;
                    default:
                        return;
                }
            },
            payForApplePay: function (channelType, bankNo) {
                webBridge.launchAppPay({
                    "data": {
                        "payment": parseFloat(payData.data.buyPrice),
                        "bankNo": bankNo
                    }
                }, function (res) {
                    if (that.isLock()) {
                        return;
                    }
                    that.lock();
                    m_loading.show();
                    ajax({
                        "url": opts["order"],
                        "method": "POST",
                        "data": {
                            "packageId": payData.data.packageId,
                            "buyPrice": parseFloat(payData.data.buyPrice),
                            "channelType": channelType,
                            "channelNo": bankNo,
                            "extendInfo": JSON.stringify(res)
                        },
                        "onSuccess": function (res) {
                            that.unLock();
                            m_loading.hide();

                            if (res["status"] != '1') {
                                m_loading.hide();
                                showMessage(res["msg"]);
                                return;
                            }
                            orderNo = res["data"]["jfPayOrderNo"];
                            webBridge.tellAppAppleSuccess({"result": res}, function (res) {
                                custFuncs.orderStatus();
                            });
                        },
                        "onError": function (req) {
                            that.unLock();
                            m_loading.hide();
                            console.error("网络连接失败:" + req.msg);
                        }
                    })
                })
            },
            payForBank: function (channelType, bankNo) {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                ajax({
                    "url": opts["order"],
                    "method": 'POST',
                    "data": {
                        "packageId": payData.data.packageId,
                        "buyPrice": parseFloat(payData.data.buyPrice),
                        "channelType": channelType,
                        "channelNo": bankNo,
                    },
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res.status != '1') {
                            showMessage(res.msg);
                            return;
                        }
                        orderNo = res["data"]["jfPayOrderNo"];
                        webBridge.launchAppPay(res, function (res) {
                            custFuncs.orderStatus();
                        }); 
                    },
                    "onError": function (req) {
                        that.unLock();
                        toast("网络连接失败: " + req.status);
                    }
                })
            },
            orderStatus: function () {
                var num = payData.data.buyCredit;
                m_loading.show();
                ajax({
                    "url": opts["orderstatus"],
                    "method": 'POST',
                    "data": {
                        "orderNo": orderNo
                    },
                    "onSuccess": function (res) {     
                        if (res["status"] != 1) {
                            showMessage(res["msg"]);
                            return;
                        }

                        if (res["data"]["payStatus"] != 1) {
                            num = '';
                        }

                        if( (res["data"]["payStatus"]==1) && (res["data"]["orderStatus"]==1)) {
                            flag = true;
                        }

                        if((index ==2) || (flag == true)) {
                            m_loading.hide();
                            if( res["data"]["payStatus"] == 0) {
                                index = 0;
                                return res["data"]["payStatus"];
                            }
                            webBridge.openUrl(res["data"]["url"] + '&num=' + num, "blank");
                            return res["data"]["payStatus"];
                        } else {
                            index++;
                            setTimeout(function(){
                                custFuncs.orderStatus(); 
                            }, 300);
                        }
                    },
                    "onError": function (req) {
                        toast("网络连接失败: " + req.status);
                    }
                });
            },
            payNum: function (tag) {
                payData.data.packageId = tag.dataset["packageid"];
                payData.data.buyPrice = tag.dataset["buyprice"];
                payData.data.buyCredit = tag.innerHTML;
                payData.data.ordermoney = tag.dataset["ordermoney"];
                nodeList.payMoney.innerHTML = parseFloat(payData.data.buyPrice);
                nodeList.saveMoney.innerHTML = (parseFloat(payData.data.ordermoney) == 0) ? '' : '原价'+'¥'+parseFloat(payData.data.ordermoney)+'<div class="line"></div>';
            },
            payType: function (data) {
                payData.type = data;
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            data = _data;
            payData.data.packageId = opts["packageId"];
            payData.data.buyPrice = opts["buyPrice"];
            payData.data.buyCredit = opts["buyCredit"];

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.payType = custFuncs.payType;
        that.payNum = custFuncs.payNum;
        return that;
    }
});