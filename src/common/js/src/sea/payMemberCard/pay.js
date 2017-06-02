/**
 * 会员卡支付
 * payment-------url存在，代表活动特惠
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var ajax = require("lib/io/ajax");
    var confirm = require("sea/dialog/confirm");
    var showMessage = require("sea/showMessage");
    var queryToJson = require("lib/json/queryToJson");
    var webBridge = require("sea/webBridge");
    var showCards = require("sea/dialog/showCards");
    var URL = require("lib/util/URL");
    var loading = require("sea/dialog/loading");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var url = null;
        var selectedCardInfo = {};
        var selectedCardInfoB = {};
        var param = null;
        var m_loading = null;

        /*  var memberPriceB = null;
         var realSinglePriceB = null;
         var realAllPriceB = null;
         var cardLevelB = null;*/

        //---------------事件定义----------------
        var evtFuncs = {
            payMemberCard: function () {
                if (opts["changOrderInfo"]) {
                    custFuncs.changOrder();
                    return;
                }
                custFuncs.payMemberCard();
            },

            showCardList: function () {
                var cards = nodeList.card.innerHTML;
                var dialog = showCards(cards, {
                    "OKText": "确定",
                    "cancelText": "取消",
                    "OK": function () {
                        selectedCardInfo = dialog.getSelectedCard();
                        // 会员活动，价格切换
                        if (url.payment) {
                            custFuncs.cardArtInfo();
                            return;
                        }
                        if (selectedCardInfo != null) {
                            nodeList.member_card.innerHTML = url["cinemaName"] + "&nbsp&nbsp" + selectedCardInfo["card"];
                            nodeList.orderPrice.innerHTML = parseFloat(selectedCardInfo["realallprice"]);
                            var _disAmountPrice = (parseFloat(url["cinemaPrice"]) * (selectedCardInfo["memberprice"].split('|').length)) - parseFloat(selectedCardInfo["realallprice"]);
                            nodeList.disAmount.innerHTML = _disAmountPrice > 0 ? _disAmountPrice : 0;
                        }
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

                /*  var memberPrice = url.memberPrice ? url.memberPrice.replace(/\+/g, '|') : opts.memberPrice;
                 var realSinglePrice = url.realSinglePrice ? url.realSinglePrice.replace(/\+/g, '|') : opts.realSinglePrice;
                 var realAllPrice = url.realAllPrice ? url.realAllPrice.replace(/\+/g, '|') : opts.realAllPrice;*/


                /*会员卡切换修改请求参数*/

                //有会员特惠活动----传活动id
                if (url.payment) {
                    param = {
                        "orderNo": opts["orderNo"],	                            //订单号	String	Y
                        "payment": opts["payment"],	                        //支付金额	Number	Y
                        "sendType": 1,	                                                    //发送方式	Number	Y	0不发，1短信，2彩信，3短彩信
                        "cardNo": selectedCardInfoB["cardNo"] || opts["cardNo"],	        //会员卡号	String	Y
                        "cardLevel": selectedCardInfoB["cardLevel"] || opts["cardLevel"],	        //会员卡级别			Y
                        "cardPwd": nodeList.psd.value,	                                    //会员卡密码	String	Y
                        "realSinglePrice": selectedCardInfoB["realSinglePrice"] || url.realSinglePrice.replace(/\+/g, '|'),	//真实单价	String	Y	例子：11.5|11.5|9.5|9.5
                        "realAllPrice": selectedCardInfoB["realAllPrice"] || url.realAllPrice.replace(/\+/g, '|'),      //真实总价	Number	Y	例子：42.00
                        "discountFlag": selectedCardInfoB["discountFlag"] || opts["discountFlag"],	    //优惠标识	String	Y	例子：1|1|0|0
                        "discountName": selectedCardInfoB["discountName"] || opts["discountName"],	    //优惠票名称	String	Y	例子：成人票|成人票|学生票|学生票
                        "chargePrice": selectedCardInfoB["chargePrice"] || opts["chargePrice"],	        //手续费	Number	Y	例子：1.50
                        "memberPrice": selectedCardInfoB["memberPrice"] || url.memberPrice.replace(/\+/g, '|'),         //会员价	String	Y	例子：10|10|8|8
                        "cardActId": opts['cardActId']
                    };

                } else {
                    //无会员特惠活动----不传活动id
                    param = {
                        "orderNo": opts["orderNo"],	                            //订单号	String	Y
                        "payment": selectedCardInfo["realallprice"] || opts["payment"],	                        //支付金额	Number	Y
                        "sendType": 1,	                                                    //发送方式	Number	Y	0不发，1短信，2彩信，3短彩信
                        "cardNo": selectedCardInfo["card"] || opts["cardNo"],	        //会员卡号	String	Y
                        "cardLevel": selectedCardInfo["cardlevel"] || opts["cardLevel"],	        //会员卡级别			Y
                        "cardPwd": nodeList.psd.value,	                                    //会员卡密码	String	Y
                        "realSinglePrice": selectedCardInfo["realsingleprice"] || opts["realSinglePrice"],	//真实单价	String	Y	例子：11.5|11.5|9.5|9.5
                        "realAllPrice": selectedCardInfo["realallprice"] || opts["realAllPrice"],      //真实总价	Number	Y	例子：42.00
                        "discountFlag": selectedCardInfo["discountflag"] || opts["discountFlag"],	    //优惠标识	String	Y	例子：1|1|0|0
                        "discountName": selectedCardInfo["discountname"] || opts["discountName"],	    //优惠票名称	String	Y	例子：成人票|成人票|学生票|学生票
                        "chargePrice": selectedCardInfo["chargeprice"] || opts["chargePrice"],	        //手续费	Number	Y	例子：1.50
                        "memberPrice": selectedCardInfo["memberprice"] || opts["memberPrice"],         //会员价	String	Y	例子：10|10|8|8
                        "cardActId": ''
                    };

                }
                that.lock();
                m_loading.show();
                that.fire('paying');
                ajax({
                    "url": opts["payMember"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();

                        m_loading.hide();
                        that.fire('payed');
                        if (res["status"] == '-1') {
                            var dialog = confirm("您的余额不足，请前往影城充值后使用。<br/>开通虚拟会员卡也可享受购票优惠，去<br/>看看？", {
                                "OKText": "去看看",
                                "cancelText": "以后再说",
                                "OK": function () {
                                    webBridge.openUrl(opts["virtualMemberFill"], 'blank');
                                }
                            });
                            dialog.init();
                            dialog.show();
                            return;
                        }
                        if (res["status"] != 1) {
                            showMessage(res["msg"]);
                            return;
                        }
                        webBridge.openUrl(res["data"]["url"]);
                    },
                    "onError": function (req) {
                        that.unLock();
                        m_loading.hide();
                        that.fire('payed');
                        console.error("网络连接失败:" + req.msg);
                    }
                });
            },
            //取消会员卡活动支付
            /* cancecardactivitypay: function () {
             var defer = when.defer();
             var param = {
             "orderNo": opts["orderNo"],
             "cardActId": opts["cardActId"]
             };
             console.log(param);
             ajax({
             "url": opts["cancecardactivitypay"],
             "method": "post",
             "data": param,
             "onSuccess": function (res) {

             //that.unLock();
             if (res["status"] != 1) {
             /!*showMessage(res["msg"]);*!/
             return;
             }
             console.log(res);
             defer.resolve();
             //showMessage(res);
             },
             "onError": function (req) {
             console.error("网络连接失败:" + req.msg);
             defer.reject();
             //that.unLock();
             }
             });
             return defer.promise;
             },*/
            //查询会员活动支付价格
            cardArtInfo: function () {
                var param = {
                    orderNo: opts["orderNo"],
                    cardActId: opts["cardActId"],
                    cardNo: selectedCardInfo["card"] || opts["cardNo"],
                    payChannelNo: "USERCARD"
                };
                console.log(param);
                ajax({
                    "url": opts["cardAct"],
                    "method": 'POST',
                    "data": param,
                    "onSuccess": function (res) {
                        if (res.status == 0) {
                            return;
                        }
                        if (res["data"]["discountAmount"] > 0) {
                            /* memberPriceB = res["data"]["cards"][0]["memberPrice"];
                             realSinglePriceB = res["data"]["cards"][0]["realSinglePrice"];
                             realAllPriceB = res["data"]["cards"][0]["realAllPrice"];
                             cardLevelB = res["data"]["cards"][0]["cardLevel"];*/
                            selectedCardInfoB = res["data"]["cards"][0];
                            nodeList.member_card.innerHTML = url["cinemaName"] + "&nbsp&nbsp" + selectedCardInfo["card"];
                            nodeList.orderPrice.innerHTML = parseFloat(selectedCardInfoB["realAllPrice"]);
                            nodeList.disAmount.innerHTML = (parseFloat(url["cinemaPrice"]) * (selectedCardInfo["memberprice"].split('|').length)) - parseFloat(selectedCardInfoB["realAllPrice"]);
                        }
                        //console.log(res);
                    },
                    "onError": function (req) {
                        console.log("网络连接失败(" + req.status + ")");
                    }
                })
            },
            changOrder: function () {
                if (that.isLock()) {
                    return;
                }
                var changOrderInfo = JSON.parse(opts["changOrderInfo"]);
                var param = {
                    "orderNo": opts["orderNo"],
                    "orderNoBack": opts["orderNoBack"],
                    "payPrice": opts["changPayMent"],
                    "backPrice": opts["backPrice"],
                    "orderNoBackPrice": opts["orderNoBackPrice"],
                    "integralNum": opts["integralNum"],
                    "cardNo": opts["cardNo"],
                    "cardPwd": nodeList.psd.value,
                    "bankNo": changOrderInfo["payChannelNoBack"],
                    "channelType": changOrderInfo["payChannelNoBack"],
                    "fillPriceSing": changOrderInfo["fillPriceSing"],
                    "isGuiCard": 0,
                    "userRemark": '就是要改签'
                };
                that.lock();
                m_loading.show();
                ajax({
                    "url": opts["changOrderUrl"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        m_loading.hide();
                        if (res["status"] != 1) {
                            console.log(res["msg"]);
                            showMessage(res["msg"]);
                            return;
                        }
                        webBridge.openUrl(res["data"]["url"], "blank");
                    },
                    "onError": function (res) {
                        that.unLock();
                        m_loading.hide();
                        console.error("网络连接失败(" + res.status + ")");
                    }
                });
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            url = queryToJson(URL.parse(location.href)["query"]);
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
            if (opts["orderNoBack"]) {
                touch.off(nodeList.cardList, "tap", evtFuncs.showCardList);
            }
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        return that;
    }
});