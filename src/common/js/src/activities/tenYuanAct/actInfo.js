/**
 * 活动影院和影片列表模块
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var ajax = require("lib/io/ajax");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;

		//---------------事件定义----------------
		var evtFuncs = {
		}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {

		}

		//-----------------自定义函数-------------
		var custFuncs = {
			initView: function () {
				if(that.isLock()) {
					return;
				}
				that.lock();
				ajax({
					"url": opts["actDisplay"],
					"method": "post",
					"data": {'actNo':node.getAttribute("data-actno")},
					"onSuccess": function (res) {
						that.unLock();
						if(res["status"] != "1"){
							console.log(res["msg"]);
							return;
						}
						console.log(res["msg"]);
						custFuncs.countDown(res["0"]["data"]["leftTime"]);
						nodeList.numFocus.innerHTML= res["0"]["data"]["numFocus"];
						nodeList.numOfPeople.innerHTML= res["0"]["data"]["maxNum"];

					},
					"onError": function(res) {
						that.unLock();
						console.log("请求失败，http status:" + res.status);
					}
				});
			},
			countDown: function (lastTime) {
				var timeDifference = 0;
				timeDifference = parseInt(lastTime.substr(0,2))*86400;
				timeDifference += parseInt(lastTime.substr(2,2))*3600;
				timeDifference += parseInt(lastTime.substr(4,2))*60;
				timeDifference += parseInt(lastTime.substr(6,2));
				setInterval(function () {
					timeDifference--;
					var _str = Math.floor(timeDifference/86400)+'天';
					_str += Math.floor((timeDifference%86400)/3600)+'小时';
					_str += Math.floor((timeDifference%3600)/60)+'分';
					_str += timeDifference%60+'秒';
					nodeList.countDown.innerHTML = _str;
				},1000)
			}
		}

		//-----------------初始化----------------
		var init = function(_data) {
			nodeList = parseNode(node);
			data = _data;
			modInit();
			bindEvents();
			custFuncs.initView();
		}

		//-----------------暴露各种方法-----------
		that.init = init;

		return that;
	}
});