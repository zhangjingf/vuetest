/**
 *
 *移动话费支付订单
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var ajax = require("lib/io/ajax");
	var base64Encoder = require("lib/util/base64Encoder");
	var touch = require("touch");
	var showMessage = require("sea/showMessage");
	var queryToJson = require("lib/json/queryToJson");
	var URL = require("lib/util/URL");
	var webBridge = require("sea/webBridge");
	var loading = require("sea/dialog/loading");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var unifyPayOrderNo =null;
		var url = null;
		var haveCreatePayMobile = false;
		var m_loading = null;
		//---------------事件定义----------------
		var evtFuncs = {
			getVcode: function () {
				if (!/^1\d{10}$/.test(nodeList.payTel.value)) {
					showMessage("请输入正确的手机号");
					return;
				}
				custFuncs.getVcode();
			},
			payOrder: function () {
				if (!/^1\d{10}$/.test(nodeList.payTel.value)) {
					showMessage("请输入正确的手机号");
					return;
				}
				if(nodeList.vCode.value.length< 3) {
					showMessage("请输入正确的验证码");
					return;
				}
				custFuncs.payOrder();
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
			touch.on(nodeList.getVcode, "tap", evtFuncs.getVcode);
			touch.on(nodeList.payOrder, "tap", evtFuncs.payOrder);
		}

		//-----------------自定义函数-------------
		var custFuncs = {
			getVcode:function() {
				if(that.isLock()) {
					return;
				}
				that.lock();
				var param = {
					"mobile": nodeList.payTel.value,
					"orderNo": opts["orderNo"],
					"cmcc_Price": opts["cmcc_Price"]
				};
				m_loading.show();
				ajax({
					"url": opts["mobilePay"],
					"method": "post",
					"data": param,
					"onSuccess": function (res) {
						that.unLock();
						m_loading.hide();
						var Nowtime = new Date();
						custFuncs.countDown(nodeList.getVcode,Nowtime);
						setTimeout(function() {
						},59000);
						if (res["status"] != 1) {
							console.log(res["msg"]);
							showMessage(res["msg"]);
							return;
						}
						haveCreatePayMobile = true;
						unifyPayOrderNo = res["data"]["unifyPayOrderNo"];
						webBridge.isCancelMobilePay({"isCancel": 1});
					},
					"onError": function (req) {
						that.unLock();
						m_loading.hide();
						console.error("网络连接失败:" + req["status"]);
					}
				});

			},
			//尊享卡移动支付
			payOrder: function () {
				/*
				 *ALIPAY4	            ALIPAY		支付宝
				 *CCB7		CCB7_05	建设银行
				 *ICBC		ICBC_05		工商银行H5
				 *SPDB		SPDB_05	浦发银行
				 *CMCC_C	CMCC_C03	移动支付
				 *WEIXIN7_AP	WEIXIN7_AP	微信支付
				 */
				if(url["gui"] == 1) {
					var param = {
						"bankNo": "CMCC_C03",
						"orderPrice": opts["orderPrice"],
						"channelType": "CMCC_C",
						"orderNo": opts["orderNo"],
						"payment": opts["cmcc_Price"],
						"cardNo": url["cardNo"],
						"cardPwd": base64Encoder.decode(url["cardPwd"]),
						"unifyPayOrderNo":unifyPayOrderNo,
						"verifycode": nodeList.vCode.value,
						"cardActId": url["cardActId"]
					};
				}
				else {
					var param = {
						"bankNo": "CMCC_C03",
						"orderPrice": opts["orderPrice"],
						"channelType": "CMCC_C",
						"orderNo": opts["orderNo"],
						"payment": opts["cmcc_Price"],
						"unifyPayOrderNo":unifyPayOrderNo,
						"verifycode": nodeList.vCode.value,
						"cardActId": ''
					};
				}
				ajax({
					"url": opts["payOrder"],
					"method": "post",
					"data": param,
					"onSuccess": function (res) {
						if (res["status"] != 1) {
							showMessage(res["msg"]);
							return;
						}
						webBridge.openUrl(res["data"]["url"]);
						showMessage(res);

					},
					"onError": function (req) {
						console.error("网络连接失败:" + req.msg);
					}
				})
			},
			/*倒计时一分钟*/
			countDown:function(node, Lasttime) {
				node.style.backgroundColor = '#c6c6c6';
				node.style.fontSize = '1.2rem';
				var count =59;
				function countStart() {
					var now = new Date();
					count = Math.floor((Lasttime.getTime() + 59000 - now.getTime()) / 1000);
					node.innerHTML =count+'秒后重新发送';
					if(count<=0) {
						clearInterval(timer);
						node.style.backgroundColor = '';
						node.style.fontSize = '';
						node.innerHTML ='获取验证码';
					}
				}
				var timer = setInterval(countStart, 990);
			},
			/*取消移动话费支付*/
			cancelMobilePay: function () {
				if(!haveCreatePayMobile) {
					webBridge.close();
					return;
				}
				var param = {
					"orderNo":url["orderNo"],
					"mobileNo": nodeList.payTel.value
				};
				ajax({
					"url": opts["cancelMobilePay"],
					"method": "post",
					"data": param,
					"onSuccess": function (res) {
						if (res["status"] != 1) {
							showMessage(res["msg"]);
							return;
						}
						webBridge.close();
					},
					"onError": function (req) {
						console.error("网络连接失败:" + req.msg);
						webBridge.close();
					}
				})
			}
		}

		//-----------------初始化----------------
		var init = function(_data) {
			url = queryToJson(URL.parse(location.href)["query"]);
			nodeList = parseNode(node);
			data = _data;
			modInit();
			bindEvents();
		}

		//-----------------暴露各种方法-----------
		that.init = init;
		that.cancelMobilePay = custFuncs.cancelMobilePay;

		return that;
	}
});