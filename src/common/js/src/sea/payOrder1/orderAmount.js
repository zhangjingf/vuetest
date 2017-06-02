/**
 *还差会员特惠订单影城会员卡、尊享卡url追加参数
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var showMessage = require("sea/showMessage");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    var ajax = require('lib/io/ajax');
    var when = require("lib/util/when");
    var loading = require("sea/dialog/loading");
    var URL = require("lib/util/URL");
    var queryToJson = require("lib/json/queryToJson");
    var jsonToQuery = require("lib/json/jsonToQuery");
    var merge = require("lib/json/merge");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var payType = 0;    //支付方式
        var countDownTimeOver = true;//初始化为过期
        var hasbindCardAct = false;//记录是否绑定了会员特惠活动，在卡跟券之间切换使用
        var preBindCardActType = {payType: 100, ajaxRes: null}; //记录上次绑定会员特惠活动的支付方式
        var userCardAct = opts["isUserCardAct"] == '1' ? 1 : 0;    //是否选择会员特惠
        var trueCardAddQueryObj = {};   //会员特惠时，!!尊享卡!!影城会员卡url跳转增加参数
        var payOrderUseDataPackage = JSON.parse(opts["payOrderUseDataPackage"]);
        var m_loading = null;
        var payment = 0;//url传递的支付金额
        console.log(opts["payOrderUseDataPackage"]);
        //---------------事件定义----------------
        var evtFuncs = {
            payOrder: function () {
                //获取倒计时订单是否过期，
                // 倒计时显示过期再查询接口返回订单是否过期
                //countDownTimeOver----true,倒计时订单过期，false倒计时订单未过期

                //step
                //    1、检查订单状态
                //    2、获取会员特惠
                //    3、组织url跳转
                that.fire('payOrder');//获取倒计时，订单是否过期
                if (opts["statusNoPay"] == '1' && payType == '0') {
                    showMessage("该订单不支持现金支付");
                    return;
                }
                //console.log(countDownTimeOver);
                //倒计时返回超时处理
                custFuncs.checkOrderState()
                    .then(function (res) {
                        //处理会员特惠包装成一个函数
                        custFuncs.payOrderModifySave({"isJump": true});
                    })
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
            /*检测订单是否超时*/
            checkOrderState: function () {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                var defer = when.defer();
                ajax({
                    "url": opts["saveTime"],
                    "method": "post",
                    "data": {
                        "orderTime": opts["orderTime"]
                    },
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res["status"] != '1') {
                            showMessage(res['msg']);
                            defer.reject({"msg": res["msg"]});
                            return;
                        }
                        if (res["data"]["orderOverStatus"] == '1') {
                            showMessage(res['msg'], function () {
                                //webBridge.openUrl(opts["urlShowTime"] + '&from=payOrder', "self");
                            });
                            defer.reject({"msg": "订单超时"});
                            return;
                        }
                        defer.resolve({"msg": "订单状态OK"});
                    },
                    "onError": function (req) {
                        that.unLock();
                        defer.reject({"msg": "网络连接失败"});
                    }
                });
                return defer.promise;
            },

            //刷新是否选择会员特惠
            changeUserCardAct: function (data) {
                userCardAct = data;    //是否选择会员特惠
                
                custFuncs.changePayData()
                    .then(function (res) {
                        custFuncs.payOrderModifySave({"isJump": false});
                    })

            },
            //刷新支付方式
            changePayInfo: function (data) {
                payType = data;    //支付方式
                //if(payType != preBindCardActType.payType) {
                //    userCardAct = 1;
                //}
                custFuncs.changePayData()
                    .then(function (res) {
                        custFuncs.payOrderModifySave({"isJump": false});
                    })
            },
            //获取倒计时是否过期
            getCountDownState: function (data) {
                countDownTimeOver = data;
            },
            //绑定会员特惠
            bindCardAct: function () {
                if (that.isLock()) {
                    that.lock();
                }
                var defer = when.defer();
                if (preBindCardActType.payType == payType && hasbindCardAct) {     //这次绑定跟前一次绑定一样，不重复绑定
                    var ajaxRes = preBindCardActType.ajaxRes;
                    if (ajaxRes["data"]["discountFlag"] == '1') {
                        //有会员特惠购票
                        if (ajaxRes["data"]["discountAmount"] < opts["ticketCounts"]) {
                            //showMessage('您的订单中只有' + ajaxRes["data"]["discountAmount"] + '张票可享受特价优惠，超出部分将按正常价支付出票哦，具体请查看活动规则。');
                        }
                        //优惠票数大于等于订单座位数
                        if (payType == 1) {//虚拟会员
                            trueCardAddQueryObj = {};//清空会员特惠时，尊享卡影城会员卡url跳转增加参数
                            nodeList.payMoney.innerHTML = ajaxRes["data"]["accountInfo"][0]["orderPrice"];
                            nodeList.saveMoney.innerHTML = parseFloat(payOrderUseDataPackage['cinemaPayment']) - parseFloat(ajaxRes["data"]["accountInfo"][0]["orderPrice"]);
                            payment = parseFloat(ajaxRes["data"]["accountInfo"][0]["orderPrice"]).toFixed(2);

                        } else if (payType == 2) {//尊享卡-----影城会员卡
                            //保存跳转去支付页面往url追加参数数组
                            payment = parseFloat(ajaxRes["data"]["cards"][0]["realAllPrice"]).toFixed(2);
                            nodeList.payMoney.innerHTML = parseFloat(ajaxRes["data"]["cards"][0]["realAllPrice"]);
                            nodeList.saveMoney.innerHTML = parseFloat(payOrderUseDataPackage['cinemaPayment']) - parseFloat(ajaxRes["data"]["cards"][0]["realAllPrice"]);

                        } else if (payType == 3) {
                            trueCardAddQueryObj["payment"] = parseFloat(ajaxRes["data"]["cards"][0]["realAllPrice"]).toFixed(2);
                            trueCardAddQueryObj["memberPrice"] = ajaxRes["data"]["cards"][0].memberPrice.replace(/\|/g, '+');
                            trueCardAddQueryObj["realSinglePrice"] = ajaxRes["data"]["cards"][0].realSinglePrice.replace(/\|/g, '+');
                            trueCardAddQueryObj["realAllPrice"] = ajaxRes["data"]["cards"][0].realAllPrice.replace(/\|/g, '+');
                            trueCardAddQueryObj["discountAmount"] = ajaxRes.data.discountAmount;
                            nodeList.payMoney.innerHTML = parseFloat(ajaxRes["data"]["cards"][0]["realAllPrice"]);
                            nodeList.saveMoney.innerHTML = parseFloat(payOrderUseDataPackage['cinemaPayment']) - parseFloat(parseFloat(ajaxRes["data"]["cards"][0]["realAllPrice"]));
                        }
                        defer.resolve(ajaxRes["data"]);
                        hasbindCardAct = true;  //记录已经绑定了会员特惠
                        that.fire("cancelcardAct", hasbindCardAct);     //顶部返回按钮是否取消会员特惠
                    } else {
                        //showMessage('您的特价优惠次数已用完，<br/>当前订单将按正常价支付出票！');
                        console.log('查询会员活动价格失败discountFlag不为1');
                        defer.resolve(-100);
                    }
                    //defer.resolve();
                    return defer.promise;
                }
                preBindCardActType.payType = payType; //绑定会员特惠卡记录；
                var _payChannelNo = null;
                var _cardNo = null;
                switch (payType) {
                    case 1:
                        _payChannelNo = 'ACCOUNTPAY';
                        _cardNo = '';
                        break;
                    case 2://尊享卡
                        _payChannelNo = 'USERCARD_COMMON';
                        _cardNo = payOrderUseDataPackage["guiCardInfo"]["actCardNo"];
                        break;
                    case 3://影城会员卡
                        _payChannelNo = 'USERCARD';
                        _cardNo = payOrderUseDataPackage["memberCardInfo"]["actCardNo"];
                        break;
                    default:
                        break;
                }
                m_loading.show();
                ajax({
                    "url": opts["bindCardAct"],
                    "method": 'POST',
                    "data": {
                        orderNo: opts["url"]['orderNo'],
                        cardActId: opts["url"]["cardActId"],
                        cardNo: _cardNo,
                        payChannelNo: _payChannelNo
                    },
                    "onSuccess": function (res) {
                        m_loading.hide();
                        that.unLock();
                        if (res["status"] != '1') {
                            defer.reject('status,状态为0');
                            return;
                        }
                        preBindCardActType.ajaxRes = res;
                        //判断会员优惠票数是否足够当前订单座位数
                        if (res["data"]["discountFlag"] == '1') {
                            //有会员特惠购票
                            if (res["data"]["discountAmount"] < opts["ticketCounts"]) {
                                showMessage('您的订单中只有' + res["data"]["discountAmount"] + '张票可享受特价优惠，超出部分将按正常价支付出票哦，具体请查看活动规则。');
                            }
                            //优惠票数大于等于订单座位数
                            if (payType == 1) {//虚拟会员
                                trueCardAddQueryObj = {};//清空会员特惠时，尊享卡影城会员卡url跳转增加参数
                                nodeList.payMoney.innerHTML = parseFloat(res["data"]["accountInfo"][0]["orderPrice"]);
                                nodeList.saveMoney.innerHTML = parseFloat(payOrderUseDataPackage['cinemaPayment']) - parseFloat(res["data"]["accountInfo"][0]["orderPrice"]);
                                payment = parseFloat(res["data"]["accountInfo"][0]["orderPrice"]).toFixed(2);
                            } else if (payType == 2) {//尊享卡-----影城会员卡
                                //保存跳转去支付页面往url追加参数数组
                                payment = parseFloat(res["data"]["cards"][0]["realAllPrice"]).toFixed(2);
                                nodeList.payMoney.innerHTML = parseFloat(res["data"]["cards"][0]["realAllPrice"]);
                                nodeList.saveMoney.innerHTML = parseFloat(payOrderUseDataPackage['cinemaPayment']) - parseFloat(res["data"]["cards"][0]["realAllPrice"]);
                            } else if (payType == 3) {
                                trueCardAddQueryObj["payment"] = parseFloat(res["data"]["cards"][0]["realAllPrice"]).toFixed(2);
                                trueCardAddQueryObj["memberPrice"] = res["data"]["cards"][0].memberPrice.replace(/\|/g, '+');
                                trueCardAddQueryObj["realSinglePrice"] = res["data"]["cards"][0].realSinglePrice.replace(/\|/g, '+');
                                trueCardAddQueryObj["realAllPrice"] = res["data"]["cards"][0].realAllPrice.replace(/\|/g, '+');
                                trueCardAddQueryObj["discountAmount"] = res.data.discountAmount;
                                nodeList.payMoney.innerHTML = parseFloat(res["data"]["cards"][0]["realAllPrice"]);
                                nodeList.saveMoney.innerHTML = parseFloat(payOrderUseDataPackage['cinemaPayment']) - parseFloat(parseFloat(res["data"]["cards"][0]["realAllPrice"]));
                            }
                            defer.resolve(res["data"]);
                            hasbindCardAct = true;  //记录已经绑定了会员特惠
                            that.fire("cancelcardAct", hasbindCardAct);     //顶部返回按钮是否取消会员特惠
                        } else {
                            showMessage('您的特价优惠次数已用完，<br/>当前订单将按正常价支付出票！');
                            console.log('查询会员活动价格失败discountFlag不为1');
                            defer.resolve(-100);
                        }
                    },
                    "onError": function (req) {
                        that.unLock();
                        defer.reject();
                        m_loading.hide();
                        console.log("网络连接失败(" + req.status + ")");
                    }
                });
                return defer.promise;
            },
            //取消会员特惠
            unBindCardAct: function (cardActId) {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                var defer = when.defer();
                m_loading.show();
                ajax({
                    "url": opts["cancelBindCardAct"],
                    "method": "post",
                    "data": {
                        "orderNo": opts["url"]["orderNo"],
                        "cardActId": opts["url"]["cardActId"]
                    },
                    "onSuccess": function (res) {
                        m_loading.hide();
                        that.unLock();
                        if (res["status"] != '1') {
                            showMessage(res["msg"]);
                            defer.reject();
                            return;
                        }
                        trueCardAddQueryObj = {};   //置空真实卡支付选择会员特惠才需要追加参数数组
                        hasbindCardAct = false;  //取消记录绑定了会员特惠
                        that.fire("cancelcardAct", hasbindCardAct);     //顶部返回按钮是否取消会员特惠
                        defer.resolve();
                    },
                    "onError": function (req) {
                        that.unLock();
                        m_loading.hide();
                        console.error("网络连接失败(" + req.status + ")");
                        defer.reject("网络连接失败");
                    }
                });
                return defer.promise;
            },
            payOrder: function (object) {
                /* object {
                 *   isActCardPay        ----是否会员特惠购票（做标识判断）
                 *   isJump              ----是否跳转去下一个支付页面
                 *   hasActNumber          ------  -100时会员特惠次数用完
                 * }
                 * */
                //console.log(object);
                if (object.isJump) {
                    //跳转
                    switch (payType) {
                        case 0:
                            webBridge.openUrl(payOrderUseDataPackage["thirdPayInfo"]["url"]);
                            break;
                        case 1:
                            var parseUrlA = URL.parse(payOrderUseDataPackage["virtualCardInfo"]["url"]);
                            var jumpUrlToJsonA = queryToJson(parseUrlA["query"]);

                            if (userCardAct == 1 && payOrderUseDataPackage["virtualCardInfo"]["isAct"] == '1' && object.hasActNumber !=-100) {
                                jumpUrlToJsonA.cardActId = opts["url"]["cardActId"];
                            } else {
                                jumpUrlToJsonA.cardActId = '';
                            }
                            jumpUrlToJsonA.payment = payment;
                            webBridge.openUrl(parseUrlA["path"] + '?' + jsonToQuery(jumpUrlToJsonA, true));
                            break;
                        case 2:
                            var parseUrlB = URL.parse(payOrderUseDataPackage["guiCardInfo"]["url"]);
                            var jumpUrlToJsonB = queryToJson(parseUrlB["query"]);

                            if (userCardAct == 1 && payOrderUseDataPackage["guiCardInfo"]["isAct"] == '1' && object.hasActNumber !=-100) {
                                jumpUrlToJsonB.cardActId = opts["url"]["cardActId"];
                            } else {
                                jumpUrlToJsonB.cardActId = '';
                            }
                            jumpUrlToJsonB.payment = payment;
                            webBridge.openUrl(parseUrlB["path"] + '?' + jsonToQuery(jumpUrlToJsonB, true));
                            break;
                        case 3:
                            //兼容后边页面需要调整url追加参数
                            var parseUrlC = URL.parse(payOrderUseDataPackage["memberCardInfo"]["url"]);
                            var jumpUrlToJsonC = queryToJson(parseUrlC["query"]);
                            var addQueryJson = merge(trueCardAddQueryObj, jumpUrlToJsonC);

                            if (userCardAct == 1 && payOrderUseDataPackage["memberCardInfo"]["isAct"] == '1' && object.hasActNumber !=-100) {
                                addQueryJson.cardActId = opts["url"]["cardActId"];
                                jumpUrlToJsonC.cardActId = opts["url"]["cardActId"];
                            } else {
                                jumpUrlToJsonC.cardActId = '';
                            }
                            webBridge.openUrl(parseUrlC["path"] + '?' + jsonToQuery(addQueryJson, true));
                            break;
                        case 4:
                            webBridge.openUrl(payOrderUseDataPackage["ticketUrl"]);

                            break;
                        case 5:
                            webBridge.openUrl(payOrderUseDataPackage["couponUrl"]);
                            break;
                        default:
                            showMessage('非法支付方式');
                            break;
                    }
                }
            },
            changePayData: function (res) {
                var defer = when.defer();
                //选择会员特惠，并且选择的卡参加会员特惠，进入会员特惠
                if (
                    res != -100
                    &&
                    userCardAct == 1
                    &&
                    ((payType == 1 && payOrderUseDataPackage["virtualCardInfo"]["isAct"] == '1')
                    || (payType == 2 && payOrderUseDataPackage["guiCardInfo"]["isAct"] == '1')
                    || (payType == 3 && payOrderUseDataPackage["memberCardInfo"]["isAct"] == '1'))) {
                    //修改节省金额，支付金额从绑定会员特惠活动接口计算
                    defer.resolve();
                    switch (payType) {
                        case 1:
                            //nodeList.saveMoney.innerHTML = payOrderUseDataPackage["virtualCardInfo"]["actDiscount"];
                            break;
                        case 2:
                            //尊享卡
                            //nodeList.saveMoney.innerHTML = payOrderUseDataPackage["guiCardInfo"]["actDiscount"];
                            break;
                        case 3:
                            //影城会员卡
                            //nodeList.saveMoney.innerHTML = payOrderUseDataPackage["memberCardInfo"]["actDiscount"];
                            break;
                        default:
                            //0,4,5显示第三方支付金额
                            nodeList.payMoney.innerHTML = parseFloat(payOrderUseDataPackage["thirdPayInfo"]["payment"]);
                            payment = parseFloat(payOrderUseDataPackage["thirdPayInfo"]["payment"]).toFixed(2);
                            nodeList.saveMoney.innerHTML = parseFloat(payOrderUseDataPackage["thirdPayInfo"]["discount"]);
                            break;
                    }
                } else {
                    defer.resolve();
                    if (payOrderUseDataPackage["rushTicketNo"]) {//抢票活动，所有支付方式价格一样   payOrderUseDataPackage["rushTicketNo"]不为空
                        nodeList.payMoney.innerHTML = parseFloat(payOrderUseDataPackage["thirdPayInfo"]["payment"]);
                        payment = parseFloat(payOrderUseDataPackage["thirdPayInfo"]["payment"]).toFixed(2);
                        nodeList.saveMoney.innerHTML = parseFloat(payOrderUseDataPackage["thirdPayInfo"]["discount"]);
                    } else {
                        switch (payType) {
                            case 1:
                                nodeList.payMoney.innerHTML = parseFloat(payOrderUseDataPackage["virtualCardInfo"]["cardPayment"]);
                                nodeList.saveMoney.innerHTML = parseFloat(payOrderUseDataPackage["virtualCardInfo"]["discount"]);
                                payment = parseFloat(payOrderUseDataPackage["virtualCardInfo"]["cardPayment"]).toFixed(2);
                                break;
                            case 2:
                                nodeList.payMoney.innerHTML = parseFloat(payOrderUseDataPackage["guiCardInfo"]["cardPayment"]);
                                nodeList.saveMoney.innerHTML = parseFloat(payOrderUseDataPackage["guiCardInfo"]["discount"]);
                                payment = parseFloat(payOrderUseDataPackage["guiCardInfo"]["cardPayment"]).toFixed(2);
                                break;
                            case 3:
                                nodeList.payMoney.innerHTML = parseFloat(payOrderUseDataPackage["memberCardInfo"]["cardPayment"]);
                                nodeList.saveMoney.innerHTML = parseFloat(payOrderUseDataPackage["memberCardInfo"]["discount"]);
                                payment = parseFloat(payOrderUseDataPackage["memberCardInfo"]["cardPayment"]).toFixed(2);
                                break;
                            default:
                                //0,4,5显示第三方支付金额
                                nodeList.payMoney.innerHTML = parseFloat(payOrderUseDataPackage["thirdPayInfo"]["payment"]);
                                nodeList.saveMoney.innerHTML = parseFloat(payOrderUseDataPackage["thirdPayInfo"]["discount"]);
                                payment = parseFloat(payOrderUseDataPackage["thirdPayInfo"]["payment"]).toFixed(2);
                                break;
                        }
                    }
                }
                return defer.promise;
            },
            payOrderModifySave: function (object) {
                if (opts["url"]["cardActId"] && userCardAct == 1) {
                    //有会员特惠活动 并选择了会员特惠活动支付
                    if (payType >= 1 && payType <= 3) {
                        //选择了卡支付，-------绑定会员特惠
                        //特殊情况 payOrderUseDataPackage数据包里边对应    isAct为1时代表该卡支持会员特惠
                        if (
                            (payType == 1 && payOrderUseDataPackage["virtualCardInfo"]["isAct"] == '1')
                            || (payType == 2 && payOrderUseDataPackage["guiCardInfo"]["isAct"] == '1')
                            || (payType == 3 && payOrderUseDataPackage["memberCardInfo"]["isAct"] == '1')
                        ) {
                            //满足全部条件参加会员特惠了
                            custFuncs.bindCardAct()
                                .then(function (res) {
                                    //会员特惠购票操作
                                   // 绑定会员特惠返回状态码为-100是会与特惠用完，普通订单支付
                                   if(res == -100) {
                                       //userCardAct = 0;
                                       custFuncs.changePayData(res);
                                   }
                                    custFuncs.payOrder({
                                        "isActCardPay": true,
                                        'isJump': object.isJump,
                                        "hasActNumber":res
                                    });
                                })
                        } else {
                            //不满足条件,普通订单支付
                            //普通购票操作
                            custFuncs.payOrder({
                                "isActCardPay": false,
                                'isJump': object.isJump
                            });
                        }
                    } else if ((payType == 0 || payType > 3) && hasbindCardAct) {
                        //选择券支付，或者网银支付，但是选择过会员特惠 取消会员特惠
                        custFuncs.unBindCardAct()
                            .then(function (res) {
                                //普通购票操作
                                custFuncs.payOrder({
                                    "isActCardPay": false,
                                    'isJump': object.isJump
                                });
                            })
                    } else {
                        //有会员特惠活动，并开启会员特惠，选择网银、券支付，未绑定会员特惠   （使用普通支付流程）
                        //普通购票操作
                        custFuncs.payOrder({
                            "isActCardPay": false,
                            'isJump': object.isJump
                        });
                    }
                } else {
                    //先选参加会员特惠，选择了卡支付，再取消勾选会员特惠，要取消会员特惠
                    if (hasbindCardAct) {
                        custFuncs.unBindCardAct()
                            .then(function () {
                                custFuncs.payOrder({
                                    "isActCardPay": false,
                                    'isJump': object.isJump
                                });
                            })

                    } else {
                        //普通购票操作
                        custFuncs.payOrder({
                            "isActCardPay": false,
                            'isJump': object.isJump
                        });
                    }

                }
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
        that.getCountDownState = custFuncs.getCountDownState;
        that.changeUserCardAct = custFuncs.changeUserCardAct;
        that.changePayInfo = custFuncs.changePayInfo;
        return that;
    }
});