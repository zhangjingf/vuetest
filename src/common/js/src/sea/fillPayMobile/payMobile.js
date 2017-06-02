/**
 *
 *移动话费支付订单
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	//var ajaxParam = require("sea/ajaxParam");
	var ajax = require("lib/io/ajax");
	//var md5 = require("lib/util/md5");
	var touch = require("touch");
	var showMessage = require("sea/showMessage");
	var storageMessager = require("lib/evt/storageMessager");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var unifyPayOrderNo =null;

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
		var modInit = function() {}

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
					"orderNo": "CreateMemberFillOrderType",
					"cmcc_Price": opts["payment"],
					"mobile":nodeList.payTel.value
				};
				//console.log(param);
				ajax({
					"url": opts["getVcode"],
					"method": "post",
					"data": param,
					"onSuccess": function (res) {
						that.unLock();
						if (res["status"] != 1) {
							showMessage(res["msg"]);
							return;
						}
						unifyPayOrderNo = res["data"]["unifyPayOrderNo"];
						//showMessage(res);
					},
					"onError": function (req) {
						that.unLock();
						console.error("网络连接失败:" + req.msg);
					}
				})

			},
			payOrder: function () {
				if(that.isLock()) {
					return;
				}
				that.lock();
					/*
					 *ALIPAY4	            ALIPAY		支付宝
					 *CCB7		CCB7_05	建设银行
					 *ICBC		ICBC_05		工商银行H5
					 *SPDB		SPDB_05	浦发银行
					 *CMCC_C	CMCC_C03	移动支付
					 *WEIXIN7_AP	WEIXIN7_AP	微信支付
					 */
					var param = {
						"fillMoney": opts["payment"],
						"unifyPayOrderNo":unifyPayOrderNo,
						"verifycode":nodeList.vCode.value,
						"channelType": "CMCC_C",
						"channelNo": "CMCC_C03",
					};
					console.log(param);
					ajax({
						"url": opts["ememberFill"],
						"method": "post",
						"data": param,
						"onSuccess": function (res) {
							if (res["status"] != 1) {
								console.log(res["msg"]);
								showMessage(res["msg"]);
								return;
							}
							storageMessager.send("reChangeMobile",{});
							webBridge.close();
							//showMessage(res);
						},
						"onError": function (req) {
							console.error("网络连接失败:" + req.msg);
							that.unLock();
						}

					});
				var Nowtime = new Date();
				custFuncs.countDown(nodeList.getVcode,Nowtime);
				setTimeout(function() {
				},59000)
			},
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
		that.initView = custFuncs.initView;

		return that;
	}
});