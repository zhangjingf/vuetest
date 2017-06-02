/**
 * 连续签到礼包模块
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var closest = require("lib/dom/closest");
	var touch = require("touch");
	var giftDetail = require('sea/dialog/giftDetail');
	var appendQuery = require("lib/str/appendQuery");
	var ajax = require("lib/io/ajax");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;

		//---------------事件定义----------------
		var evtFuncs = {
			showDetail: function(ev) {
				var target = closest(ev.target, '.item', nodeList.gift);
				var status = target.getAttribute('data-status');
				var id = target.getAttribute('data-id');
				var whereDay = target.getAttribute('data-where-day');

				var url = appendQuery(opts.getGift, {
					packetId: id,
					whereDay: whereDay,
					pointDate: ''
				})

				ajax({
					url: url,
					onSuccess: function(res) {
						if (res.status != 1) {
							showMessage(res.msg);
							return;
						}

						var dialog = giftDetail({
							status: status,
							gift: res.data,
							whereDay: whereDay
						});
						dialog.init();
						dialog.show();
					}
				})
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			touch.on(nodeList.gift, 'tap', '.item', evtFuncs.showDetail);
		}

		//-----------------自定义函数-------------
		var custFuncs = {}

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