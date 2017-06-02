/**
 * 活动详情模块
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var each = require("lib/util/each");
	var ajax = require("lib/io/ajax");
    var ajaxParam = require("activities/ajaxParam");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;

		//---------------事件定义----------------
		var evtFuncs = {}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {}

		//-----------------自定义函数-------------
		var custFuncs = {
			updateView: function() {
				var param = ajaxParam.create("getActivityDetail", {
	                "actNo": opts["actNo"]
	            });

	            // ajax({
	            //     "url": ajaxParam.getUrl(),
	            //     "method": "post",
	            //     "data": param,
	            //     "onSuccess": function(res) {
	            //         if (res["head"]["errCode"] != 0) {
	            //             return;
	            //         }

	            //         var result = res.body;
	            //         var hasDetail = false;
	            //         for (prop in result) {
	            //         	hasDetail = true;
	            //         }

	            //         if (!hasDetail) {
	            //         	return;
	            //         }

	            //         that.fire('changeTitle', result.title);
	            //         nodeList.actImg.src = result.imageUrl;
	            //         nodeList.numFocus.innerHTML = result.numFocus || "暂无数据";
	            //         nodeList.numOfPeople.innerHTML = result.numOfPeople || "暂无数据";
	            //         nodeList.description.innerHTML = result.description || "暂无数据";
	            //         nodeList.leftTime.innerHTML = custFuncs.convertToLeftTime(result.leftTime);

	            //         that.fire('updateCityList', result.seatTicket);
	            //     },
	            //     "onError": function(req) {
	            //         console.error("网络连接失败:" + req.status);
	            //     }
	            // });
			},

			convertToLeftTime: function(str) {
				var hhmmss = str.substr(str.length - 7, 6);
				var day = str.substring(0, str.length - 6);
				var hour = hhmmss.substr(0, 2);
				var min = hhmmss.substr(2, 2);
				var sec = hhmmss.substr(4, 2);

				day = day == '' ? '' : day + '天';
				hour = hour == '00' ? '' : hour + '时';
				min = min == '00' ? '' : min + '分';
				sec = sec == '00' ? '' : sec + '秒';

				var leftTime = day + hour + min + sec;

				return leftTime;
			}
		}

		//-----------------初始化----------------
		var init = function(_data) {
			nodeList = parseNode(node);
			data = _data;

			modInit();
			bindEvents();

			custFuncs.updateView();
		}

		//-----------------暴露各种方法-----------
		that.init = init;

		return that;
	}
});