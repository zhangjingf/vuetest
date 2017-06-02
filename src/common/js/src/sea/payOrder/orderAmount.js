/**
 *4.8---修改非活动尊享卡支付显示价格不改变
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var showMessage = require("sea/showMessage");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    var ajax = require('lib/io/ajax');
    var URL = require("lib/util/URL");
    var appendQuery = require("lib/str/appendQuery");
    var queryToJson = require("lib/json/queryToJson");
    var jsonToQuery = require("lib/json/jsonToQuery");
    var when = require("lib/util/when");
    var loading = require("sea/dialog/loading");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var flag = true;
        var GuiUrl = null;
        var getActMoney = false;
        var discountOverflow = false;
        var discountAmount = "";
        var flagTimes = false;
        var m_loading = null;
        var countDownTime = '0分0秒';

        //---------------事件定义----------------
        var evtFuncs = {
            payGui: function(ev) {
                if (opts["statusNoPay"] == '1') {
                    showMessage("该订单不支持现金支付");
                    return;
                }
                custFuncs.checkOvertime()
                    .then(function() {
                        if (flag == true) { /*直接进入第三方支付*/

                            if (opts["cardActId"] != "") {
                                custFuncs.cancelBindActivity(opts["cardActId"]); /*没有所会员特惠  会空释放。*/
                            }
                            webBridge.openUrl(ev.target.getAttribute("data-href") + '&notbackpressed');
                        }
                        if (flag == false) { /*尊享卡来支付*/
                            webBridge.openUrl(GuiUrl + '&notbackpressed');
                        }
                    });
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
            m_loading = loading();
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.payOrder, "tap", evtFuncs.payGui);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            payGui: function(data) {
                /*处理 电子券和优惠券 不去使用 优惠活动票数*/
                if (data.index == 3 || data.index == 4) {
                    if (flagTimes) { /*为三种有会员优惠的 flagTimes = true . 为电子券,优惠券 flagTimes = false*/
                        custFuncs.cancelBindActivity(opts["cardActId"]);
                    }
                    custFuncs.jumpToPay(data);
                    return;
                }
                var cardNo = data.cardNo;
                //非活动，有尊享卡，影院不支持使用尊享卡提示
                if (data.index == '1' && opts["guimemberStatusRemark"]) {
                    showMessage(opts["guimemberStatusRemark"]);
                    return;
                }

                /*没有尊享卡*/
                if (data.guiStatus != undefined) {
                    if (data.guiStatus == 0 || data.guiStatus == "0") { /*不是尊享卡*/
                        webBridge.openUrl(appendQuery(data.url), "blank"); /*只有这一处自己独自跳，其余的都在jumpToPay 方法中跳*/
                        return;
                    }
                }
                // 非活动影片  或者  选择了虚拟会员支付，却不是虚拟会员，则不请求接口  【排除无卡虚拟会员】
                if (!opts.cardActId || (data.index == 0 && cardNo == "0")) {
                    custFuncs.jumpToPay(data);
                    return;
                }
                var payChannelNo = '';
                /*选择支付方式的类型*/
                switch (data.index) {
                    case 0:
                        payChannelNo = 'ACCOUNTPAY';
                        break;
                    case 1:
                        payChannelNo = 'USERCARD_COMMON';
                        break;
                    case 2:
                        payChannelNo = 'USERCARD';
                        break;
                    default:
                        break;
                }
                // 不支持当前尊享卡 会员特惠，可以采用一般的会员特惠
                if (cardNo == "") {
                    custFuncs.jumpToPay(data);
                    return;
                }

                // 选择了会员卡或者尊享卡却没有相应的卡，则不请求接口                【无卡会员卡或者尊享卡】
                if (!cardNo) {
                    custFuncs.jumpToPay(data);
                    return;
                }
                m_loading.show();
                ajax({
                    "url": opts.cardAct,
                    "method": 'POST',
                    "data": {
                        orderNo: opts.orderNo,
                        cardActId: opts.cardActId,
                        cardNo: cardNo,
                        payChannelNo: payChannelNo
                    },
                    "onSuccess": function(res) {
                        m_loading.hide();
                        if (res.status == 0) {
                            return;
                        }
                        /*通知header 可以使用 取消会员特惠接口*/
                        that.fire("cancelDis", true);
                        /*有会员优惠票数*/
                        discountAmount = res.data.discountAmount;
                        if (discountAmount > 0 && discountAmount <= opts.ticketCounts) {

                            // 尊享卡和会员卡有cards数组，虚拟会员有accountInfo数组
                            var body = res.data.accountInfo ? res.data.accountInfo[0] : res.data.cards[0];
                            var price = res.data.accountInfo ? res.data.accountInfo[0].orderPrice : res.data.cards[0].realAllPrice;

                            /*计算会员优惠价格*/
                            //var disAmount = parseFloat(opts["guiPrice"]) - parseFloat(price);
                            var disAmount = (parseFloat(opts["oriSellerPrice"]) + parseFloat(opts["guiPrice"])) - parseFloat(price);
                            price = custFuncs.convert(price);
                            disAmount = custFuncs.convert(disAmount.toFixed(2));

                            /*如果为尊享卡，不会跳页面，修改下面的价格*/
                            if (payChannelNo == "USERCARD_COMMON") {
                                /*优惠价格为负数 将优惠价格改为0*/
                                if (disAmount.indexOf("-") != -1) {
                                    disAmount = "0";
                                }
                                nodeList.order_amount.innerHTML = '¥' + price;
                                nodeList.discount_amount.innerHTML = '优惠:¥' + disAmount;
                            }

                            /*给url添加参数*/
                            var url = URL.parse(data.url);
                            var query = url.query;
                            query = queryToJson(query);
                            query.payment = price;
                            query.memberPrice = body.memberPrice ? body.memberPrice.replace(/\|/g, '+') : '';
                            query.realSinglePrice = body.realSinglePrice ? body.realSinglePrice.replace(/\|/g, '+') : '';
                            query.realAllPrice = body.realAllPrice ? body.realAllPrice.replace(/\|/g, '+') : '';
                            query.discountAmount = res.data.discountAmount ? res.data.discountAmount : '';
                            url.query = jsonToQuery(query);
                            data.url = URL.build(url);

                            var text = '该场次为会员特惠场次，影城会员卡、尊享卡和<br/>虚拟会员每天各可购买1-2张特惠票，选座超出的<br/>数量为会员正常价，请确认后支付';
                            if (discountAmount < opts.ticketCounts) {
                                /*会员特惠数小于购买的票数，进行提示*/
                                showMessage(text, function() {
                                    custFuncs.jumpToPay(data);
                                });
                                return;
                            }
                            custFuncs.jumpToPay(data);
                            return;
                        }

                        custFuncs.jumpToPay(data);
                    },
                    "onError": function(req) {
                        m_loading.hide();
                        console.log("网络连接失败(" + req.status + ")");
                    }
                })
            },

            /*检测订单是否超时*/
            checkOvertime: function() {
                that.fire("getCountDownTime", '要获取倒计时时间了');
                if (countDownTime == "0分0秒") {
                    var defer = when.defer();
                    var param = {
                        "orderNo": opts["orderNo"]
                    };
                    ajax({
                        "url": opts["checkOrderApi"],
                        "method": "post",
                        "data": param,
                        "onSuccess": function(res) {
                            if (res["status"] != 1) {
                                console.log(res["msg"]);
                                showMessage(res["msg"]);
                                defer.reject();
                                return;
                            }
                            if (res["data"]["status"] == 1) { /*未支付*/
                                showMessage("订单已超时!", function() {
                                    webBridge.close(1);
                                });
                                defer.reject();
                                return;
                            }
                        },
                        "onError": function(req) {
                            console.log("网络连接失败（" + req.status + ")");
                            defer.reject("网络连接失败（" + req.status + ")");
                        }
                    });
                    return defer.promise;
                } else { /*时间没有过期*/
                    var deferNoOutTime = when.defer();
                    deferNoOutTime.resolve();
                    return deferNoOutTime.promise;
                }
            },

            jumpToPay: function(data) {
                /*data.index == 1 为没有任何活动的主流程*/
                if (data.index != "1") {
                    webBridge.openUrl(appendQuery(data.url, {
                        "virtualDiscountAmount": discountAmount,
                        /*传过去 优惠票数*/
                        "notbackpressed": ''
                    }));
                    return;
                }

                if (flag) {
                    GuiUrl = data.url;
                    flag = false;
                    /*非活动，尊享卡价格改变*/
                    if (!opts["cardActId"]) {
                        nodeList.order_amount.innerHTML = '¥' + opts["guimemberPrice"];
                        //var discAmount = opts["discountPrice"];
                        nodeList.discount_amount.innerHTML = '优惠:¥' + opts["discountPrice"];
                        return;
                    }

                    nodeList.order_amount.innerHTML = '¥' + opts["guimemberPrice"];
                    nodeList.discount_amount.innerHTML = '优惠:¥' + opts["discountPrice"];

                }
            },

            convert: function(price) {
                price += '';
                var delicima = price.split('.')[1];

                if (!delicima) {
                    price += '.00';
                    length = 2;
                } else {
                    var length = delicima.length;
                    while (length < 2) {
                        price += '0';
                        length++;
                    }
                }
                return price;
            },

            cancelBindActivity: function(cardActId) {
                var defer = when.defer();
                var param = {
                    /*a)orderNo: 订单号
                     b)cardActId： 活动id*/
                    "orderNo": opts["orderNo"],
                    "cardActId": cardActId
                };
                ajax({
                    "url": opts["cancelActivity"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function(res) {
                        if (res["status"] == 0) {
                            console.log(res["msg"]);
                            defer.resolve();
                            return;
                        }
                        custFuncs.cancelActivityShow();
                        defer.resolve();
                    },
                    "onError": function(req) {
                        console.error("网络连接失败(" + req.status + ")");
                        defer.reject("网络连接失败(" + req.status + ")");
                    }
                });
                return defer.promise;
            },

            /*取消活动价*/
            cancelActivityShow: function() {
                nodeList.order_amount.innerHTML = '¥' + opts["orderPrice"];
                var discAmount = ((opts['CinemaPrice'] - opts['filmPrice']) * opts['dataOrderSeatNum']).toFixed(2);
                nodeList.discount_amount.innerHTML = '优惠:¥' + discAmount;
            },

            /*处理是否 可以取消会员特惠*/
            cancelFavorable: function(status) {
                flagTimes = status;
            },

            /*没有一种被选中时，就显示“电影网售价格”*/
            cancelVipValue: function() {
                nodeList.order_amount.innerHTML = '¥' + (parseFloat(opts["orderPrice"]).toFixed(2));
                var discAmount = ((parseFloat(opts['CinemaPrice']) - parseFloat(opts['filmPrice'])) * parseFloat(opts['dataOrderSeatNum'])).toFixed(2);
                if (discAmount < 0) {
                    discAmount = 0;
                }
                nodeList.discount_amount.innerHTML = '优惠:¥' + discAmount;
            },

            /* 刷新flag变量 */
            fakeFlush: function() {
                flag = true;
            },
            getCountDownTime: function(data) {
                countDownTime = data;
            }
        };

        //-----------------初始化----------------
        var init = function(_data) {
                nodeList = parseNode(node);
                data = _data;
                modInit();
                bindEvents();
            }
            //-----------------暴露各种方法-----------
        that.init = init;
        that.payGui = custFuncs.payGui;
        that.cancelActivityShow = custFuncs.cancelActivityShow;
        that.cancelFavorable = custFuncs.cancelFavorable;
        that.cancelVipValue = custFuncs.cancelVipValue;
        that.fakeFlush = custFuncs.fakeFlush;
        that.getCountDownTime = custFuncs.getCountDownTime; //获取倒计时时间
        return that;
    }
});