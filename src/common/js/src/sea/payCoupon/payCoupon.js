/**
 * 优惠券支付
 * 优惠券验证
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var className = require("lib/dom/className");
    var each = require("lib/util/each");
    var closest = require("lib/dom/closest");
    var touch = require("touch");
    var webBridge = require("sea/webBridge");
    var ajax = require("lib/io/ajax");
    var appendQuery = require("lib/str/appendQuery");
    var loading = require("sea/dialog/loading");
    var showMessage = require("sea/showMessage");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var ticketStr = null;
        var payMent = null;
        var m_loading = null;
        //---------------事件定义----------------
        var evtFuncs = {
            inputNum: function () {
                var text = nodeList.inputNo.value;
                if (text.length > 11 && text.length < 21) {
                    className.remove(nodeList.addMark, "add");
                    className.add(nodeList.addMark, "well");
                } else {
                    className.add(nodeList.addMark, "add");
                    className.remove(nodeList.addMark, "well");
                }
            },
            addMark: function() {
                if (!className.has(nodeList.addMark, "well")) {
                    return;
                }
                var text = nodeList.inputNo.value;
                nodeList.selectCouponList.innerHTML += '<div class="row" data-coupon="'+ text +'">\
                                                            <div class="number">'+ text +'</div>\
                                                            <div class="state">未知</div>\
                                                            <div class="type">优惠券待验证</div>\
                                                            <div class="btn" node-name="removeCoupon" data-removeCoupon="true">﹣</div>\
                                                            </div>';
                nodeList.inputNo.value = '';
                className.add(nodeList.addMark, "add");
                className.remove(nodeList.addMark, "well");
                className.remove(nodeList.btn, "m-pay-bt-gray");
                nodeList.btn.innerHTML ='验证';
                className.remove(nodeList.btn, "isPay");
            },
            validationCoupon: function () {
                if(that.isLock()){
                    return;
                }
                that.lock();
                if(className.has(nodeList.btn,"isPay")) {
                    that.unLock();
                    custFuncs.discountTicketPay();
                } else {
                    if(className.has(nodeList.btn,'m-pay-bt-gray')) {
                        that.unLock();
                        return;
                    }
                    if(nodeList.selectCouponList.childNodes.length <= 0) {
                        showMessage("优惠券不能为空");
                        that.unLock();
                        return;
                    }
                    var ticketString = '';
                    var nodeArr = nodeList.selectCouponList.childNodes;
                    each(nodeArr, function (item) {
                        if(item.nodeType == 1) {
                            ticketString += item.getAttribute("data-coupon")+',';
                        }
                    })
                    ticketString = ticketString.substr(0,ticketString.length-1);
                    /*if(ticketString == ticketStr) {
                        showMessage("现在输入的优惠券不可用哦~请输入新的<br/>优惠券再试试吧");
                        that.unLock();
                        return;
                    }*/
                    ticketStr = ticketString;

                    var param = {
                        "orderNo": opts["orderNo"],
                        "discounts": ticketString
                    };
                    //console.log(param);
                    ajax({
                        "url": opts["validatordiscountticket"],
                        "method": "post",
                        "data": param,
                        "onSuccess": function(res) {
                            that.unLock();
                            if (res["status"] != 1) {
                                showMessage(res["msg"]);
                                return;
                            }
                            var vData = res["data"];
                            payMent = vData.discountPrice + vData.surplusPrice +vData.sellPrice;
                            payMent = parseFloat(payMent).toFixed(2);
                            console.log(payMent);
                            var selectCouponListHtml='';
                            var txt ='';
                            var isAvailable = 0;
                            each(res["data"]["items"], function (item) {
                                if(item["priceType"] ==1) {
                                    txt = item["oneDiscountPrice"]+'元优惠券';
                                } else if (item["priceType"] ==2) {
                                    txt = item["oneDiscountPrice"]+'折优惠券';
                                } else {
                                    txt = '未知';
                                }
                                if(item["status"] ==1) {
                                    isAvailable += 1;
                                }
                                console.log(res);
                                selectCouponListHtml += '<div class="row" data-coupon="'+ item["discountNo"] +'"data-status = "'+item["status"] +'">\
                                                    <div class="number">'+ item["discountNo"] +'</div>\
                                                    <div class="state"><span>'+ txt + '</span></div>\
                                                    <div class="type">'+ item["statusRemark"] +'</div>\
                                                    <div class="btn" node-name="removeCoupon" data-removeCoupon="true">﹣</div>\
                                                    </div>';
                            });
                            nodeList.selectCouponList.innerHTML = selectCouponListHtml;
                            nodeList.tipSecond.innerHTML = '可用优惠券 <em>'+ isAvailable +'</em>张其中<em>显示可用状态</em>的将享受优惠';
                            if(isAvailable > 0) {
                                //var totalMoney = parseFloat(res["body"]["discountPrice"]) + parseFloat(res["body"]["surplusPrice"]);
                                nodeList.btn.innerHTML = '立即使用';
                                if(opts["statusMeal"] == 1 || opts["statusMeal"] == "1") {
                                    nodeList.tipThree.innerHTML = '可用优惠券 <em>'+ isAvailable +'</em>张其中<em>显示可用状态</em>的将享受优惠<br/>\
                                                                使用优惠券需补足最低票价: <em>'+ parseFloat(res["data"]["surplusPrice"]).toFixed(2) +'元</em><br>\
                                                                使用优惠券需支付卖品价格: <em>'+ parseFloat(res["data"]["sellPrice"]).toFixed(2) +'元</em><br>\
                                                                这笔订单共需要支付<em>'+ payMent +'元</em>';
                                } else {
                                    nodeList.tipThree.innerHTML = '可用优惠券 <em>'+ isAvailable +'</em>张其中<em>显示可用状态</em>的将享受优惠<br/>\
                                                                使用优惠券需补足最低票价: <em>'+ parseFloat(res["data"]["surplusPrice"]).toFixed(2) +'元</em><br>\
                                                                这笔订单共需要支付<em>'+ payMent +'元</em>';
                                }

                                className.add(nodeList.btn, "isPay");
                                nodeList.tipFirst.style.display ='none';
                                nodeList.tipSecond.style.display ='none';
                                nodeList.tipThree.style.display ='inherit';
                            }
                        },
                        "onError": function(req) {
                            console.error("网络连接失败:" + req.status);
                            that.unLock();
                        }
                    });
                }
            },
            removeCoupon: function (ev) {
                var nodeRemoveCoupon = parseNode(nodeList.selectCouponList);
                var CouponNode = closest(ev.target, "[data-coupon]", nodeList.selectCouponList);
                if(CouponNode.getAttribute("data-status") !="1") {
                    CouponNode.remove();
                } else {
                    CouponNode.remove();
                    //className.add(nodeList.btn, "m-pay-bt-gray");
                    className.remove(nodeList.btn, "isPay");
                    nodeList.btn.innerHTML = '验证';
                    nodeList.tipFirst.style.display ='inherit';
                    nodeList.tipSecond.style.display ='none';
                    nodeList.tipThree.style.display ='none';
                }
                /*取消券为空*/
                if(!nodeRemoveCoupon.removeCoupon.length) {
                    nodeList.tipFirst.style.display ='inherit';
                    nodeList.tipSecond.style.display ='none';
                    nodeList.tipThree.style.display ='none';
                    className.add(nodeList.btn, "m-pay-bt-gray");
                    className.remove(nodeList.btn, "isPay");
                    nodeList.btn.innerHTML = '验证';
                }
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
            touch.on(nodeList.inputNo, "input", evtFuncs.inputNum);
            touch.on(nodeList.addMark, "tap", evtFuncs.addMark);
            touch.on(nodeList.btn, "tap", evtFuncs.validationCoupon);
            touch.on(nodeList.selectCouponList, "tap","[data-removeCoupon]", evtFuncs.removeCoupon);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            showSelectCouponList: function (ticketArr) {
                var selectCouponListHtml = '';
                if(ticketArr.length > 0) {
                    className.remove(nodeList.btn,"isPay");
                    nodeList.btn.innerHTML = "验证";
                    each(ticketArr, function (item,index) {
                        selectCouponListHtml += '<div class="row" data-coupon="'+ item +'">\
                        <div class="number">'+ item +'</div>\
                        <div class="state">未知</div>\
                        <div class="type">优惠券待验证</div>\
                        <div class="btn" node-name="removeCoupon" data-removeCoupon="true">﹣</div>\
                        </div>';
                    })
                    nodeList.selectCouponList.innerHTML = selectCouponListHtml;
                    nodeList.tipFirst.style.display = "none";
                    nodeList.tipSecond.style.display = "inherit";
                    nodeList.tipThree.style.display = "none";
                    className.remove(nodeList.btn, "m-pay-bt-gray");
                }
                else {
                    nodeList.tipFirst.style.display = "inherit";
                    nodeList.tipSecond.style.display = "none";
                }
            },
            /*优惠券支付订单*/
            discountTicketPay: function () {
                if (that.isLock()) {
                    return;
                }

                var ticket = '';
                each(nodeList.selectCouponList.childNodes, function (item) {
                    if(item.nodeType == 1 && item.getAttribute("data-status") == "1") {
                        ticket += item.getAttribute("data-coupon")+',';
                    }
                });
                ticket = ticket.substr(0,ticket.length-1);

                var param = {
                    "orderNo": opts["orderNo"],
                    "discounts": ticket
                };

                that.lock();
                m_loading.show();
                that.fire('paying');

                ajax({
                    "url": opts["discountpay"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function(res) {
                        that.unLock();

                        m_loading.hide();
                        that.fire('payed');

                        if (res["status"] != 1) {
                            showMessage(res["msg"]);
                            return;
                        }
                        if(res["data"]["orderStatus"] == 1) {
                            webBridge.openUrl(appendQuery(res["data"]["url"], {
                                "chargePrice": res["data"]["cmcc_ChargePrice"],
                                "payment":payMent,/*res["data"]["orderPrice"],*/
                                "orderTime": res["data"]["orderTime"],
                                "orderPrice": res["data"]["orderPrice"],
                                "payType": "TicketPay",
                                "orderNo": res["data"]["orderNo"],
                                "notbackpressed":''
                            }), "blank", {
                                "title": "支付订单_pay/type",
                                "controllertype": "payment"
                            });
                        } else {
                            webBridge.openUrl(res["data"]["url"], "blank", {
                                "title": "支付结果_pay/result",
                                "style": "4"
                            });
                        }
                    },
                    "onError": function(req) {
                        that.unLock();
                        m_loading.hide();
                        that.fire('payed');
                        console.error("网络连接失败:" + req.status);
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
        that.showSelectCouponList = custFuncs.showSelectCouponList;
        return that;
    }
});