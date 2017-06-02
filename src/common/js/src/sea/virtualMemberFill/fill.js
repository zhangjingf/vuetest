/**
 * 虚拟会员充值模块
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var className = require("lib/dom/className");
    var closest = require("lib/dom/closest");
    var each = require("lib/util/each");
    var ajax = require("lib/io/ajax");
    var touch = require("touch");
    var swiper = require("swiper");
    var alert = require("sea/dialog/alert");
    var showMessage = require('sea/showMessage');
    var storageMessager = require("lib/evt/storageMessager");
    var webBridge = require('sea/webBridge');
    var loading = require("sea/dialog/loading");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var payType = null;

        var m_swiper = null;
        var m_loading = null;
        var money = null;
        var url = null;
        var mobile = null;
        var fee = null;

        //---------------事件定义----------------
        var evtFuncs = {
            fillMoney: function(ev) {
                if (!nodeList.moneyChoice) {
                    return;
                }
                var choices = [].concat(nodeList.moneyChoice);
                each(choices, function(choice) {
                    className.remove(choice, "cur");
                });
                className.add(ev.target, "cur");
                money = ev.target.getAttribute("data-money");
                fee = ev.target.getAttribute('data-fee');
            },
            inputInfo: function(ev) {
                var inputNode = closest(ev.target, "[data-input]", nodeList.inputInfo);

                if (inputNode == null) {
                    return;
                }
                each(inputNode.childNodes, function(item) {
                    if (item.nodeType != "1") {
                        return;
                    }
                    if (item.targetName = "INPUT") {
                        item.style.display = "inline-block";
                        item.focus();
                    } else if (item.targetName = "DIV") {
                        item.style.display = "none";
                    }
                })
            },
            inputChange: function(ev) {
                ev.target.previousSibling.innerHTML = ev.target.value;
            },
            payType: function(ev) {
                var target = closest(ev.target, 'li', nodeList.payType);
                payType = parseInt(target.getAttribute("data-type"), 10);
                var iconNode = nodeList.icon;
                each(iconNode, function(item) {
                    if (item.getAttribute("data-icon") == payType) {
                        className.remove(item, "select-icon");
                        className.add(item, "selected-icon");
                    } else {
                        className.remove(item, "selected-icon");
                        className.add(item, "select-icon");
                    }
                });
            },
            fillCard: function() {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                ajax({
                    "url": opts["card"],
                    "method": 'POST',
                    "data": {
                        "fillCardNo": nodeList.cardNo.value,
                        "fillPwd": nodeList.cardPwd.value,
                        "mobile": nodeList.mobile.value
                    },
                    "onSuccess": function(res) {
                        that.unLock();
                        if (res.status != '1') {
                            showMessage(res.msg);
                            return;
                        }
                        showMessage("充值成功", function() {
                            storageMessager.send("changeUserData", { 'changeData': 'true' });
                            webBridge.close();
                        });
                    },
                    "onError": function(req) {
                        that.unLock();
                        showMessage("网络连接失败: " + req.status);
                    }
                })
            },
            fillBank: function() {
                    if (!payType) {
                        showMessage("请选择一种支付方式");
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
                            webBridge.openUrl(url + "&payment=" + money + "&chargeprice=" + fee);
                            break;
                        case 7:
                            custFuncs.payForApplePay("ICBC_IOS|I_IOS_V2", "ICBC_IOS|I_IOS_V2");
                            break;
                        default:
                            return;
                    }
                }
                /*,
                payForApplePay: function (channelType, bankNo) {
                	webBridge.launchAppPay({
                		"data": {
                			"payment": opts["payment"],
                			"bankNo": bankNo
                		}
                	},function(res){
                		var applePayParam = {
                			'channelType':channelType,
                			'bankNo':bankNo,
                			"orderNo": opts["orderNo"],
                			"orderPrice": opts["payment"],
                			"extendInfo": JSON.stringify(res)
                		};
                		if(opts["gui"] == "1") {
                			applePayParam.cardNo= cardNo;
                			applePayParam.cardPwd= cardPwd;
                		}
                		if(that.isLock()) {
                			return;
                		}
                		that.lock();
                		m_loading.show();
                		ajax({
                			"url": opts["pageInt"]["payOrder"],
                			"method": "post",
                			"data": applePayParam,
                			"onSuccess": function (res) {
                				that.unLock();
                				m_loading.hide();
                				if (res["status"] != 1) {
                					m_loading.hide();
                					showMessage(res["msg"]);
                					return;
                				}
                				if(res["data"]["bank"][0]["result"] =="S") {
                					webBridge.openUrl(res["data"]["url"]+'&from=applePay');
                				} else {
                					custFuncs.checkOrderStatus('applePay');
                				}
                				/!*   if(res["data"]["payDone"]==1 || res["data"]["payDone"] == "1") {
                				 m_loading.hide();
                				 webBridge.openUrl(res["data"]["url"]);
                				 return;
                				 }*!/
                			},
                			"onError": function (req) {
                				that.unLock();
                				m_loading.hide();
                				console.error("网络连接失败:" + req.msg);
                			}
                		})
                	})
                }*/
        }

        //---------------子模块定义---------------
        var modInit = function() {
            m_loading = loading('结果查询中，请稍后');
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.fillMoney, "tap", '.item', evtFuncs.fillMoney);
            touch.on(nodeList.inputInfo, "tap", "div", evtFuncs.inputInfo);
            touch.on(nodeList.inputInfo, "input", "input", evtFuncs.inputChange);

            touch.on(nodeList.payType, "tap", "li", evtFuncs.payType);
            touch.on(nodeList.fillCard, "tap", evtFuncs.fillCard);
            touch.on(nodeList.fillBank, "tap", evtFuncs.fillBank);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            switch: function(index) {
                m_swiper.slideTo(index);
            },

            initData: function() {
                if (!nodeList.moneyChoice) {
                    showMessage('无充值金额，无法充值');
                    return;
                }
                mobile = nodeList.mobileNo.innerHTML;
                var defaultMoney = ([].concat(nodeList.moneyChoice))[0];
                money = defaultMoney.getAttribute("data-money");
                fee = defaultMoney.getAttribute('data-fee');
                url = nodeList.mobilePay.getAttribute('data-href');
            },
            swiperInitview: function() {
                m_swiper = swiper('.fill-swiper', {
                    "speed": 400,
                    "touchMoveStopPropagation": false,
                    "autoHeight": true,
                    "onSlideChangeStart": function() {
                        that.fire("slideChange", {
                            "index": m_swiper.activeIndex
                        });
                    }
                });
            },
            checkFillOrderInfo: function() {
                var _flg = 0; //递归调用标志
                custFuncs.checkFillOrder(_flg);
            },
            checkFillOrder: function(_flg) {
                m_loading.show();
                ajax({
                    "url": opts["queryMemberfillOrder"],
                    "method": 'POST',
                    "data": {},
                    "onSuccess": function(res) {
                        if (res.status != '1') {
                            showMessage(res.msg);
                            return;
                        }
                        var _payStatus = res["data"]["items"]["0"]["payStatus"];
                        if (_payStatus == '2') {
                            //showMessage("充值成功", function() {
                            m_loading.hide();
                            storageMessager.send("changeUserData", { 'changeData': 'true' });
                            webBridge.close();
                            //});
                        } else if (_payStatus == '1') {
                            if (_flg <= 1) {
                                _flg++;
                                setTimeout(function() {
                                    custFuncs.checkFillOrder();
                                }, 1000)
                            } else {
                                m_loading.hide();
                                //showMessage('充值失败，请重试');
                            }
                        } else {
                            m_loading.hide();
                            //showMessage('充值失败，请重试');
                        }
                    },
                    "onError": function(req) {
                        m_loading.hide();
                        showMessage("网络连接失败: " + req.status);
                    }
                })
            },
            payForBank: function(channelType, bankNo) {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                ajax({
                    "url": opts["bank"],
                    "method": 'POST',
                    "data": {
                        "fillMoney": money,
                        "mobile": mobile,
                        "channelType": channelType,
                        "channelNo": bankNo
                    },
                    "onSuccess": function(res) {
                        that.unLock();
                        if (res.status != '1') {
                            showMessage(res.msg);
                            return;
                        }
                        webBridge.launchAppPay(res, function(res) {
                            if (res["payResult"] == "0" || res["payResult"] == "9000") {
                                //微信和支付宝有返回值payResult=0（微信成功）9000（支付宝成功）
                                storageMessager.send("changeUserData", { 'changeData': 'true' });
                                webBridge.close();
                            } else {
                                //其他情况查询接口数据
                                custFuncs.checkFillOrderInfo();
                            }
                        });
                    },
                    "onError": function(req) {
                        that.unLock();
                        showMessage("网络连接失败: " + req.status);
                    }
                })
            },
            payForApplePay: function(channelType, bankNo) {
                webBridge.launchAppPay({
                    "data": {
                        "payment": money,
                        "bankNo": bankNo
                    }
                }, function(res) {
                    var applePayParam = {
                        'channelType': channelType,
                        'channelNo': bankNo,
                        "fillMoney": money,
                        "mobile": mobile,
                        "extendInfo": JSON.stringify(res)
                    };
                    if (that.isLock()) {
                        return;
                    }
                    that.lock();
                    m_loading.show();
                    ajax({
                        "url": opts["bank"],
                        "method": "post",
                        "data": applePayParam,
                        "onSuccess": function(res) {
                            that.unLock();
                            m_loading.hide();
                            if (res["status"] != '1') {
                                m_loading.hide();
                                showMessage(res["msg"]);
                                return;
                            }
                            webBridge.tellAppAppleSuccess({ "result": res }, function(res) {
                                if (res["data"]["bank"][0]["result"] == "S") {
                                    storageMessager.send("changeUserData", { 'changeData': 'true' });
                                    webBridge.close();
                                } else {
                                    custFuncs.checkFillOrderInfo();
                                }
                            });

                        },
                        "onError": function(req) {
                            that.unLock();
                            m_loading.hide();
                            console.error("网络连接失败:" + req.msg);
                        }
                    })
                })
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
            custFuncs.initData();
            custFuncs.swiperInitview();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.switch = custFuncs.switch;

        return that;
    }
});