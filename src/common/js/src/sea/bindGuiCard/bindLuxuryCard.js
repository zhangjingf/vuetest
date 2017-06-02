/**
 * 尊享卡模块
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var touch = require("touch");
	var encodeHTML = require("lib/str/encodeHTML");
	var confirm = require("sea/dialog/confirm");
	var ajax = require("lib/io/ajax");
	var webBridge = require("sea/webBridge");
	var storageMessager = require("lib/evt/storageMessager");
	//var URL = require("lib/util/URL");
	//var queryToJson = require("lib/json/queryToJson");
	var showMessage = require("sea/showMessage");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		//var userId = null;
		//var url = null;

		//---------------事件定义----------------
		var evtFuncs = {
			bindCard : function () {
				custFuncs.bindCard();
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			touch.on(nodeList.nextStep, "tap", evtFuncs.bindCard);
		}

		//-----------------自定义函数-------------
		var custFuncs = {
			/*会员卡绑定*/
			bindCard: function () {
				if(that.isLock()){
					return;
				}
				var cardNo = nodeList.cardNo.value;
				var cardPwd = nodeList.cardPwd.value;

				/*var param = ajaxParam.create("userCardBind", {
					"userId": userId,
					"cinemaNo": 00000000,
					"cinemaName": encodeHTML("南京紫晶店"),
					"linkNo": "",
					"cardNo": cardNo,
					"cardPwd": base64Encoder.encode(cardPwd)
				});*/
				/*a)cinemaNo:影院编号
				 b)cinemaName ：影院名称
				 c)linkNo ：影院链接号
				 d)cardNo ：会员卡号
				 e)cardPwd ： 会员卡密码*/
				var param = null;
				if (opts["pageInt"]["fromType"] == undefined || opts["pageInt"]["fromType"] == "") {/**/
					param = {
						"cinemaNo": "00000000",
						"cinemaName": encodeHTML("南京紫晶店"),
						"linkNo": "",
						"cardNo": cardNo,
						"cardPwd": cardPwd,
						"type": 2/*支付过来*/
					};
				} else {
					if (opts["pageInt"]["fromType"] == "fromCenternToGui") {
						param = {
							"cinemaNo": "00000000",
							"cinemaName": encodeHTML("南京紫晶店"),
							"linkNo": "",
							"cardNo": cardNo,
							"cardPwd": cardPwd,
							"type": 1/*个人中心过来*/
						};
					}
				}
				that.lock();
				ajax({
					"url": opts["pageInt"]["guiCardBindUrl"],
					"method": "post",
					"data": param,
					"onSuccess": function (res) {
						that.unLock();
						var tip = null;
						if(res["status"] == 0){
							console.error("绑定失败：" + res["msg"]);
							showMessage(res["msg"]);
						}else{
							tip = confirm(res["msg"], {//"会员绑卡成功"
								"title": "温馨提示",
								"OKText": "继续绑定",
								"cancelText": "返回列表",
								"OK": function () {
									that.fire("bindLuxuryCard");
									nodeList.cardNo.value = "";
									nodeList.cardPwd.value = "";
								},
								"cancel": function () {
									/*storageMessager.send("cardsChange");
									webBridge.close();*/
									if (res["data"]["url"] != "") {/*从个人中心过来不为空*/
										webBridge.openUrl(res["data"]["url"], "_self");
									} else {/*从支付过来*/
										//storageMessager.send("bindCard");
										storageMessager.send("changeUserData",{'changeData':'true'});
										webBridge.close();
									}
								}
							});
							tip.init();
							tip.show();
						}
					},

					"onError": function(res) {
						that.unLock();
						console.log("请求失败，http status:" + res.status)
					}
				});
			}
		}

		//-----------------初始化----------------
		var init = function(_data) {
			//url = queryToJson(URL.parse(location.href)["query"]);
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