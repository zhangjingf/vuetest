/**
 *
 *开通海洋会员卡支付方式
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var webBridge = require("sea/webBridge");
    var closest = require("lib/dom/closest");
    var className = require("lib/dom/className");
    var each = require("lib/util/each");
    var touch = require("touch");
    var ajax = require("lib/io/ajax");
    var toast = require("sea/toast");
    var loading = require("sea/dialog/loading");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var payType = null;
        var data = null;
        var payMobileUrl = null;
        var m_loading = null;

        //---------------事件定义----------------
        var evtFuncs = {
            payType: function (ev) {
                var typeNode = closest(ev.target, "[data-type]", nodeList.payType);
                payType = parseInt(typeNode.getAttribute("data-type"), 10);
                var iconNode = nodeList.icon;

                each(iconNode, function (item) {
                    var iconNodeNumber = item.getAttribute("data-icon");
                    if (iconNodeNumber == payType) {
                        if (className.has(item, "select-icon")) {

                            className.remove(item, "select-icon");
                            className.add(item, "selected-icon");
                        }
                    } else {
                        className.remove(item, "selected-icon");
                        className.add(item, "select-icon");
                    }
                });
                payMobileUrl = typeNode.getAttribute("data-href");
            },
            payOrder: function () {
                if (payType == null) {
                    toast("请先选择支付方式");
                    return;
                }
                custFuncs.payOrder();
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_loading = loading('结果查询中，请稍后');
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.payType, "tap", "[data-type]", evtFuncs.payType);
            touch.on(nodeList.payOrder, "tap", evtFuncs.payOrder);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            payOrder: function () {
                switch (payType) {
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
                        webBridge.openUrl(payMobileUrl);
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
                        "payment": opts["url"]["payment"],
                        "bankNo": bankNo
                    }
                }, function (res) {
                    if (that.isLock()) {
                        return;
                    }
                    that.lock();
                    var param = {
                        'channelType': channelType,
                        'channelNo': bankNo,
                        "fillMoney": opts["url"]["payment"],
                        "mobile": opts["mobile"],
                        "extendInfo": JSON.stringify(res)
                    };
                    if('type' in opts.url) {
                        param.type = opts.url.type
                    }
                    m_loading.show();
                    ajax({
                        "url": opts["bank"],
                        "method": "post",
                        "data": param,
                        "onSuccess": function (res) {
                            that.unLock();
                            m_loading.hide();
                            if (res["status"] != '1') {
                                m_loading.hide();
                                toast(res["msg"]);
                                return;
                            }
                            webBridge.tellAppAppleSuccess({"result": res}, function (res) {
                                custFuncs.checkFillOrderInfo();
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
                var param = {
                    "fillMoney": parseFloat(opts["url"]["payment"]).toFixed(2),
                    "mobile": opts["mobile"],
                    "channelType": channelType,
                    "channelNo": bankNo
                }
                if('type' in opts.url) {
                    param.type = opts.url.type
                }
                ajax({
                    "url": opts["bank"],
                    "method": 'POST',
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res.status != '1') {
                            toast(res.msg);
                            return;
                        }
                        webBridge.launchAppPay(res, function (res) {
                            //其他情况查询接口数据
                            custFuncs.checkFillOrderInfo();
                        });
                    },
                    "onError": function (req) {
                        that.unLock();
                        toast("网络连接失败: " + req.status);
                    }
                })
            },
            checkFillOrderInfo: function () {
                var _flg = 0; //递归调用标志
                custFuncs.checkFillOrder(_flg);
            },
            checkFillOrder: function (_flg) {
                m_loading.show();
                ajax({
                    "url": opts["queryMemberfillOrder"],
                    "method": 'POST',
                    "data": {},
                    "onSuccess": function (res) {
                        if (res.status != '1') {
                            toast(res.msg);
                            return;
                        }
                        if (res["data"][""])
                        var _payStatus = res["data"]["items"]["0"]["payStatus"];
                        if (_payStatus == '2') {
                            m_loading.hide();
                            //webBridge.openUrl(opts["seaCardResult"] + '&packageFlag=' + res["data"]["items"]["0"]["packageFlag"] + '&from=' +opts["url"]["from"]);

                        } else if (_payStatus == '1') {
                            if (_flg <= 2) {
                                _flg++;
                                setTimeout(function () {
                                    custFuncs.checkFillOrder();
                                }, 1000)
                            } else {
                                m_loading.hide();
                            }
                        } else {
                            m_loading.hide();
                        }
                    },
                    "onError": function (req) {
                        m_loading.hide();
                        toast("网络连接失败: " + req.status);
                    }
                })
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