/**
 * 评论
 *
 */
define(function(require, exports, module) { 
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var touch = require("touch");
	var toast = require("sea/toast");
	var webBridge = require("sea/webBridge");
	var ajax = require("lib/io/ajax");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var dpr = document.documentElement.getAttribute("data-dpr");
		var phoneType =  document.documentElement.getAttribute("data-device-type");
		var nodeTextarea =document.querySelector("textarea");
		//var KeyboardHeight = 0;
		var setInputIntive  = null;

		//---------------事件定义----------------
		var evtFuncs = {
			//安卓页面向上推动
			textareaFocus: function () {
				setInputIntive = setInterval(custFuncs.textareaChange,100);
			},
			textareaBlur: function () {
				window.clearInterval(setInputIntive);
			},
			//发表评论
			publish: function () {
				if(opts["isLogin"] !="1") {
					webBridge.openUrl(opts["login"]);
					return;
				}
				var textarea = document.querySelector("textarea").value;
				if(textarea.length<=5) {
					toast("请最少输入6个字~");
					return;
				} else if(textarea.length >= 200) {
					toast("请最多输入200个字~");
					return;
				} else {
					var param = {
						'reviewType': '3',
						'id':opts["articleID"],
						'content': textarea
					}
					ajax({
						"url": opts["submiteview"]+'&reviewType=3&id='+opts["articleID"]+'&content='+textarea,
						"method": "get",
						"onSuccess": function(res) {
							if (res["status"] != '1') {
								toast(res["msg"]);
								return;
							}
							nodeTextarea.value ='';
							toast(res["msg"]);
							that.fire("publish",res["data"]);

						},
						"onError": function (req) {
							console.log("网络连接失败: " + req.status);
						}
					});
				}
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			node.querySelector("textarea").addEventListener("focus",evtFuncs.textareaFocus);
			node.querySelector("textarea").addEventListener("blur",evtFuncs.textareaBlur);
			touch.on(nodeList.publish,"tap",evtFuncs.publish);

			webBridge.showKeyboard = custFuncs.showKeyboard;
			webBridge.hiddenKeyboard = custFuncs.hiddenKeyboard;
		}

		//-----------------自定义函数-------------
		var custFuncs = {
			showKeyboard: function (data) {
				//console.log(data);
				//KeyboardHeight = data;
				node.style.marginBottom = parseInt(data)*dpr+'px';
			},
			hiddenKeyboard:function(){
				node.style.marginBottom ='0';
			},
			textareaChange: function () {
				var wordsNum = nodeTextarea.value.length;
				if(wordsNum<=5) {
					nodeList.textNum.style.display ='inherit';
					nodeList.textNum.style.color = 'rgba(106,106,106,0.9)';
					nodeList.textNum.innerHTML = wordsNum+'/200';
				} else if(wordsNum>5 && wordsNum<150) {
					nodeList.textNum.style.display ='none';
				} else if(wordsNum >=150 && wordsNum<=200) {
					nodeList.textNum.style.display ='inherit';
					nodeList.textNum.style.color = 'red';
					nodeList.textNum.innerHTML = 200 - wordsNum;
				} else if(wordsNum>200) {
					var _str= nodeTextarea.value.substr(0,200);
					nodeTextarea.value = _str;
					toast("禁止输入新增字符");
				}
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