/**
 * 从url传入参数
 *  "Gui": 1,                //是否尊享卡支付
 *  "orderNo": ,                //订单编号
 *  "orderPrice": ,             //订单价格
 *  "payment": payment          //支付真实金额
 *  "orderTime": "20160129135950"  //订单生成时间
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var util = require("sea/utils");
    var ajax = require("lib/io/ajax");
    var showMessage = require("sea/showMessage");
    var modifyGuiPsd = require("sea/dialog/modifyGuiPsd");
    var closest = require("lib/dom/closest");
    var appendQuery = require("lib/str/appendQuery");
    var webBridge = require("sea/webBridge");
    var each = require("lib/util/each");
    var className = require("lib/dom/className");
    var touch = require("touch");
    var loading = require("sea/dialog/loading");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var payType = null;
        var m_modifyGuiPsd = null;
        var cardPwd = null;        //尊享卡密码
        var m_loading = null;
        var orderNo = null;

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
            },

            payOrder: function () {
                if (that.isLock()) {
                    return;
                }
                if (payType == null) {
                    showMessage("请先选择支付方式");
                    return;
                }
                var opt = {
                    "title": "尊享卡支付",
                    "OKText": "确定",
                    "cancelText": "取消",
                    "OK": function () {
                        cardPwd = m_modifyGuiPsd.getInputMsg();
                        if (cardPwd.length <= 0) {
                            showMessage("卡密码不能为空，请重新输入");
                            return;
                        }
                        m_modifyGuiPsd.hide();
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
                            default:
                                return;
                        }
                    },
                    "cancel": function () {
                    }
                };
                m_modifyGuiPsd = modifyGuiPsd(opt);
                m_modifyGuiPsd.init();
                m_modifyGuiPsd.show();
                that.unLock();
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_loading = loading();
            m_loading.init();
            m_loading.keepMiddle();
        };

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.payType, "tap", "[data-type]", evtFuncs.payType);
            touch.on(nodeList.payOrder, "tap", evtFuncs.payOrder);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            /*订单网银支付*/
            payForBank: function (channelType, bankNo) {
                if (that.isLock()) {
                    return;
                }
                /*
                 *ALIPAY4	            ALIPAY		支付宝
                 *CCB7		CCB7_05	建设银行
                 *ICBC		ICBC_05		工商银行H5
                 *SPDB		SPDB_05	浦发银行
                 *CMCC_C	CMCC_C03	移动支付
                 *WEIXIN7_AP	WEIXIN7_AP	微信支付
                 */
                var param = {
                    "bankNo": bankNo,
                    "channelType": channelType,
                    "actId":opts["actId"],
                    "cardType":'3',
                    "buyNumber":opts["couponNum"],
                    "buyMoney":parseFloat(opts.pageInt["payMoney"]).toFixed(2),
                    "cardNo": opts.pageInt.cardNo,
                    "exCinemaNo":opts.pageInt.exCinemaNo,
                    "linkNo":opts.pageInt.linkNo,
                    "cardPwd": cardPwd
                };
                that.lock();
                m_loading.show();
                ajax({
                    "url": opts["pageInt"]["payOrder"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        console.log(res);
                        that.unLock();
                        if (res["status"] != 1) {
                            m_loading.hide();
                            showMessage(res["msg"],function(){
                                if(res["status"]=="-1104") {
                                    webBridge.close();
                                }
                            });
                            return;
                        }
                      /*  if (res["data"]["payDone"] == 1 || res["data"]["payDone"] == "1") {
                            m_loading.hide();
                            webBridge.openUrl(res["data"]["url"]);
                            return;
                        }*/
                        m_loading.hide();
                        orderNo = res["data"]["orderNo"];
                        webBridge.launchAppPay(res,
                            function (res) {
                                if(res["payResult"]=="0" || res["payResult"]=="9000") {
                                    webBridge.openUrl(opts.pageInt['payResult']+'&orderno='+ orderNo);
                                } else {
                                    custFuncs.checkOrderStatus();
                                }
                            }
                        )
                    },
                    "onError": function (req) {
                        that.unLock();
                        m_loading.hide();
                        console.error("网络连接失败:" + req.msg);
                    }
                })
            },
            /*检测订单状态*/
            checkOrderStatus: function () {
                var param = {
                    "orderNo": orderNo,//orderNo,
                    "actId": opts["actId"]
                };
                ajax({
                    "url": opts["pageInt"]["checkOrderStatus"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        m_loading.hide();
                        if (res["status"] != 1) {
                            showMessage(res["msg"]);
                            return;
                        }
                        if (res["data"]["payStatus"] == "1") {
                            webBridge.openUrl(opts["pageInt"]["toResult"] + '&orderno='+ orderNo+"&actId="+ opts["actId"]);
                        }
                    },
                    "onError": function (req) {
                        console.error("网络连接失败:" + req.status);
                    }
                })
            }

        }

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});