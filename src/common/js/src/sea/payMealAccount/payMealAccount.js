/**
 *
 * 虚拟会员支付
 *
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var touch = require("touch");
	var webBridge = require("sea/webBridge");
	var showMessage = require("sea/showMessage");
	var ajax = require("lib/io/ajax");
	var utils = require("sea/utils");
	var loading = require("sea/dialog/loading");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
        var url = null;
		var m_loading = null;

		//---------------事件定义----------------
		var evtFuncs = {
			getVerifyCode: function () {
				var Nowtime = new Date();
				custFuncs.countDown(nodeList.getVerifyCode, Nowtime);
				custFuncs.getVerifyCode();
				setTimeout(function() {
				}, 59000)
			},
			payAccount: function() {
				if(nodeList.verifyCode.value.length <= 0) {
					showMessage("短信验证码不能为空");
					return;
				}
				custFuncs.payAccount(nodeList.verifyCode.value);
			}

		}

		//---------------子模块定义---------------
		var modInit = function() {
			m_loading = loading("支付中，请稍后");
			m_loading.init();
			m_loading.keepMiddle();
		}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			touch.on(nodeList.getVerifyCode, "tap", evtFuncs.getVerifyCode);
			touch.on(nodeList.payAccount, "tap", evtFuncs.payAccount);
		}

		//-----------------自定义函数-------------
		var custFuncs = {
			getVerifyCode: function () {
				if(that.isLock()) {
					return;
				}
				that.lock();
				var param = {
					"orderNo": opts["orderNo"],
					"orderAmount":opts["pageInt"]["payment"],
					"orderType":'1'
				};
				//console.log(param)
				ajax({
					"url": opts["pageInt"]["vcsendverifycode"],
					"method": "post",
					"data": param,
					"onSuccess": function (res) {
						that.unLock();
						if (res["status"] == 0) {
							console.log(res["msg"]);
							showMessage(res["msg"]);
							return;
						}
					},
					"onError": function (res) {
						that.unLock();
						console.error("网络连接失败(" + res.status + ")");
					}
				});
			},
			/*倒计时一分钟*/
			countDown:function(node, Lasttime) {
				node.style.backgroundColor = '#c6c6c6';
				node.style.fontSize = '1.2rem';
				var count = 59;
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
			payAccount: function(vercode) {
				if(that.isLock()) {
					return;
				}
				var param = {
					"verCode": vercode,
					"orderNo": opts["orderNo"],
					"cinemaNo": opts["cinemaNo"],
					"level": opts["pageInt"]["level"],
					"orderPrice": opts["pageInt"]["orderPrice"],
					"payment": opts["pageInt"]["payment"]
				};
				that.lock();
				m_loading.show();
				ajax({
					"url": opts["pageInt"]["accountPay"],
					"method": "post",
					"data": param,
					"onSuccess": function (res) {
						that.unLock();
						that.fire('payed');
						m_loading.hide();
						if (res["status"] != 1) {
							console.log(res["msg"]);
							showMessage(res["msg"]);
							return;
						}
						//console.log(res);
						webBridge.openUrl(res["data"]["url"]);
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
		var init = function(_data) {
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