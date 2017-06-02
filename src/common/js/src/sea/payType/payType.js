/**
 * 从url传入参数
 *  "Gui": true,                //是否尊享卡支付
 *  "orderNo": ,                //订单编号
 *  "orderPrice": ,             //订单价格
 *  "payment": payment          //支付真实金额
 *  "orderTime": "20160129135950"  //订单生成时间
 *  webBridge.openUrl(appendQuery("payType.html", {
 *  "Gui": true,
 *  "userId": opts["userId"],
 *  "mobile": opts["mobile"],
 *  "orderNo": opts["orderNo"],
 *  "orderPrice": orderRequireDate["orderPrice"],
 *  "payment": payment,
 *  "orderTime": orderRequireDate["orderTime"],
 *  "cardNo": cardNo
}), "blank");
 *改签流程确认改签也使用这个页面，确认是判断pageInt的changOrderInfo是否为空判断走改签还是购票流程
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var util = require("sea/utils");
    var ajax = require("lib/io/ajax");
    var merge = require("lib/json/merge");
    var showMessage = require("sea/showMessage");
    var modifyGuiPsd = require("sea/dialog/modifyGuiPsd");
    var closest = require("lib/dom/closest");
    var appendQuery = require("lib/str/appendQuery");
    var queryToJson = require("lib/json/queryToJson");
    var webBridge = require("sea/webBridge");
    var each = require("lib/util/each");
    var URL = require("lib/util/URL");
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
        var url = null;
        var m_modifyGuiPsd = null;
        var cardNo = null;        //尊享卡卡号
        var cardPwd = null;        //尊享卡密码
        var payMobileUrl = null;
        var m_loading = null;
        var changeOrderStatus  = null;

        //---------------事件定义----------------
        var evtFuncs = {
             payType: function (ev) {
                var typeNode = closest(ev.target, "[data-type]", nodeList.payType);
                    payType = parseInt(typeNode.getAttribute("data-type"), 10);
                var iconNode = nodeList.icon;
                 //console.log(iconNode);
                 each(iconNode, function (item) {
                     var iconNodeNumber = item.getAttribute("data-icon");
                     if(iconNodeNumber == payType) {
                         if(className.has(item,"select-icon")) {

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
                if (that.isLock()) {
                    return;
                }

                if (payType == null) {
                    showMessage("请先选择支付方式");
                    return;
                }
                if (opts["gui"] == '1') {
                    var opt = {
                        "title": "尊享卡支付",
                        "OKText": "确定",
                        "cancelText": "取消",
                        "OK": function () {
                            cardPwd = m_modifyGuiPsd.getInputMsg();
                            cardNo = url["guicardNo"];
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
                                case 6:
                                    webBridge.openUrl(appendQuery(payMobileUrl, {"gui": 1, "cardNo": url["cradNo"], "nowPage":"mobile"}));
                                    break;
                                case 7:
                                    //apple pay
                                    custFuncs.payForBank("ICBC_IOS|I_IOS_V2", "ICBC_IOS|I_IOS_V2");
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
                    return;
                }
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
                        webBridge.openUrl(payMobileUrl+"&nowPage=mobile");
                        break;
                    case 7:
                        //apple pay
                        custFuncs.payForBank("ICBC_IOS|I_IOS_V2", "ICBC_IOS|I_IOS_V2");
                        break;
                    default:
                        return;
                }
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
            initView: function () {
                util.countDown(nodeList.count, opts["orderTime"], 15 * 60);
            },
            /*订单网银支付*/ //改签使用这个方法
            /*
             *ALIPAY4	            ALIPAY		支付宝
             *CCB7		CCB7_05	建设银行
             *ICBC		ICBC_05		工商银行H5
             *SPDB		SPDB_05	浦发银行
             *CMCC_C	CMCC_C03	移动支付
             *WEIXIN7_AP	WEIXIN7_AP	微信支付
             * ICBC_IOS|I_IOS_V2   ICBC_IOS|I_IOS_V2         苹果支付
             */

            payForBank: function (channelType, bankNo) {
                if (that.isLock()) {
                    return;
                }
                var price = opts["orderPrice"];
                var payment = null;
                var param = null;
                if(opts["changOrderInfo"]) {
                //    改签请求接口参数
                    var _changOrderInfo = JSON.parse(opts["pageInt"]["changOrderInfo"]);
                    console.log(opts);
                    param= {
                        "bankNo": bankNo,
                        "channelType": channelType,
                        "orderNo": url["orderNo"],
                        "orderNoBack": opts["pageInt"]["orderNoBack"],
                        "payPrice": opts["pageInt"]["payPrice"],
                        "backPrice": opts["pageInt"]["backPrice"],
                        "orderNoBackPrice": opts["pageInt"]["orderNoBackPrice"],
                        "integralNum": opts["pageInt"]["integralNum"],
                        "fillPriceSing": _changOrderInfo["fillPriceSing"],
                        "isGuiCard": opts["gui"] == "1" ? 1 : 0,
                        "userRemark": '就是要改签'
                    }
                    if (opts["gui"] == "1") {
                        /* var cardActId = '';
                         if(opts["discountAmount"]) {
                         if(parseInt(opts["discountAmount"]) > 0) {
                         cardActId = opts["cardActId"];
                         }
                         }*/
                        //尊享卡请求追加参数
                        param["cardNo"] = _changOrderInfo["cardNo"];
                        param["cardPwd"] = cardPwd;
                    }
                } else {
                    //购票请求接口参数
                   payment = url.payment ? url.payment : opts.payment;
                   param = {
                        "bankNo": bankNo,
                        "channelType": channelType,
                        "orderNo": opts["orderNo"],
                        "orderPrice": price,
                        "payment": payment,
                        "cardActId": ""//opts["cardActId"]
                    };
                    if (opts["gui"] == "1") {
                        /* var cardActId = '';
                         if(opts["discountAmount"]) {
                         if(parseInt(opts["discountAmount"]) > 0) {
                         cardActId = opts["cardActId"];
                         }
                         }*/
                        //尊享卡请求追加参数
                        param["cardNo"] =cardNo;
                        param["cardPwd"] =cardPwd;
                        param["cardActId"] = opts["cardActId"]? opts["cardActId"]: '';
                    }
                }
                if(channelType== 'ICBC_IOS|I_IOS_V2') {/*apple pay 追加附加参数*/
                    webBridge.launchAppPay({
                            "data":{
                                "payment":payment,
                                "payName": "",
                                "bankNo": bankNo,
                                "payOrderNo":"",
                                "bank":"",
                                "cmccResult":"",
                                "sign":"",
                                "tradeId":"",
                                "mobile":"",
                                "url":"",
                                "payDone":""
                            }
                        },
                        function (res) {
                            param.extendInfo= JSON.stringify(res);
                            custFuncs.createApplePayOrder(param);
                        }
                    );
                } else {                              /* 非apple pay的情况 */
                    that.lock();
                    m_loading.show();
                    webBridge.backButtonEnabled({"enabled": 0});
                    ajax({
                        "url": opts["pageInt"]["changOrderInfo"] ? opts["pageInt"]["changOrderUrl"] : opts["pageInt"]["payOrder"],//通过changeOrderInfo修改请求接口地址
                        "method": "post",
                        "data": param,
                        "onSuccess": function (res) {
                            that.unLock();
                            if (res["status"] != '1') {
                                m_loading.hide();
                                webBridge.backButtonEnabled({"enabled": 1});
                                showMessage(res["msg"]);
                                return;
                            }
                            if (res["data"]["payDone"] == 1 || res["data"]["payDone"] == "1") {
                                m_loading.hide();
                                webBridge.backButtonEnabled({"enabled": 1});
                                //webBridge.openUrl(res["data"]["url"]);
                                return;
                            }
                            if(opts["pageInt"]["changOrderInfo"]) {
                                //改签订单保存参数，查询订单状态使用
                                changeOrderStatus = res["data"]["result"];
                                if(opts["pageInt"]["payPrice"]== '0') {
                                    webBridge.openUrl(res["data"]["url"]);
                                    return;
                                }
                            }
                            m_loading.hide();
                            webBridge.backButtonEnabled({"enabled": 1});
                            console.log(res.data.bank[0].responseStr)
                           decodeURI(res.data.bank[0].responseStr);
                            webBridge.launchAppPay(res,
                                function (res) {
                                    if (res["payResult"] == "0" || res["payResult"] == "9000") {//微信和支付宝有返回值payResult=0（微信成功）9000（支付宝成功）
                                        var _url = opts.pageInt['payResult'] + '&orderno=' + opts["orderNo"];
                                        if(url["statusAct"]=='1') {
                                            custFuncs.addOrderNum(_url,opts["orderNo"]);
                                        } else {
                                            if(opts["pageInt"]["changOrderInfo"]) {//改签跳转结果页面加参数
                                                webBridge.openUrl(opts.pageInt['payResult']+'&changeStatus='+changeOrderStatus +'&orderNo='+opts["orderNo"]+'&orderNoBack='+opts["pageInt"]["orderNoBack"]);
                                            } else {
                                                webBridge.openUrl(_url);
                                            }
                                        }
                                    } else {
                                        custFuncs.checkOrderStatus({});//此时没没有解锁app的返回（在此调用的函数内部解锁app返回）
                                    }
                                }
                            )

                        },
                        "onError": function (req) {
                            that.unLock();
                            m_loading.hide();
                            webBridge.backButtonEnabled({"enabled": 1});
                            console.error("网络连接失败:" + req.msg);
                        }
                    })
                }
            },
            /*检测订单状态*/
            checkOrderStatus: function (obj) {
                var param = {
                    "orderNo": url["orderNo"],
                    "statusAct": url["statusAct"],
                    "seatNum":url["seatNum"],
                    "actNo":url["actNo"]
                };
                //退改签请求接口追加参数
                if(opts["changOrderInfo"]) {
                    param["changeStatus"] = changeOrderStatus;
                    param["orderNoBack"] = opts["pageInt"]["orderNoBack"];
                }
                m_loading.show();
                webBridge.backButtonEnabled({"enabled": 0});
                //webBridge.backButtonEnabled({"enabled": 0});
                ajax({
                    "url": opts["pageInt"]["checkOrderStatus"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        m_loading.hide();
                        webBridge.backButtonEnabled({"enabled": 1});
                        //webBridge.backButtonEnabled({"enabled": 1});
                        if (res["status"] != 1) {
                            showMessage(res["msg"]);
                            return;
                        }
                        if(res["data"]["status"] == 3) {
                            if(obj["applePay"]) {
                                webBridge.openUrl(res["data"]["url"]+'&from=applePay&applePayPayment='+obj["payment"]);
                            } else {
                                webBridge.openUrl(res["data"]["url"]);
                            }

                        }
                    },
                    "onError": function (req) {
                        m_loading.hide();
                        webBridge.backButtonEnabled({"enabled": 1});
                        console.error("网络连接失败:" + req.status);
                    }
                })
            },
            /* 生成apple支付单号 */
            createApplePayOrder: function (param) {
                that.lock();
                m_loading.show();
                ajax({
                    "url": opts["pageInt"]["changOrderInfo"] ? opts["pageInt"]["changOrderUrl"] : opts["pageInt"]["payOrder"],//判断改签还是正常流程支付
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        m_loading.hide();
                        webBridge.tellAppAppleSuccess({"result": res},function(res){
                            res['payment'] = res['payment']?res['payment']:res['data']['payment'];
                            if (res["payResult"] == "1") {
                                webBridge.openUrl(opts.pageInt['payResult'] + '&orderno=' + opts["orderNo"]+'&from=applePay&applePayPayment='+res["payment"]);
                            } else {
                                custFuncs.checkOrderStatus({"applePay":true,"payment":res["payment"]});
                            }
                        });
                    },
                    "onError": function (req) {
                        that.unLock();
                        m_loading.hide();
                        console.error("网络连接失败:" + req.msg);
                    }
                })
            },
            //活动返回php订单支付成功
            addOrderNum: function (_url,orderNo) {
                if(that.isLock()) {
                    return;
                }
                that.lock();
                ajax({
                    "url": opts["pageInt"]["addordernum"],
                    "method": "post",
                    "data": {
                        'orderNo':orderNo,
                        'seatNum':url["seatNum"],
                        "actNo":url["actNo"]
                    },
                    "onSuccess": function (res) {
                        that.unLock();
                        if(res["status"] !=1) {
                            showMessage(res["msg"]);
                            return;
                        }
                        webBridge.openUrl(_url);
                    },
                    "onError": function (req) {
                        that.unLock();
                        console.error("网络连接失败:" + req.msg);
                    }
                })
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            url = queryToJson(URL.parse(location.href)["query"]);
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.initView = custFuncs.initView;

        return that;
    }
});