/**
 * 日历模块
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var closest = require("lib/dom/closest");
	var touch = require("touch");
	var ajax = require("lib/io/ajax");
	var appendQuery = require("lib/str/appendQuery");
	var showMessage = require('sea/showMessage');
	var giftDetail = require('sea/dialog/giftDetail');
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var m_days = null;
		var year = null;
		var month = null;

		//---------------事件定义----------------
		var evtFuncs = {
			prevMonth: function() {
				month--;
				if (month < 0) {
					month = 11;
					year--;
				}
				custFuncs.drawCalendar();
			},

			nextMonth: function() {
				month++;
				if (month > 11) {
					year++;
					month = 0;
				}
				custFuncs.drawCalendar();
			},

			showGift: function(ev) {
				var target = closest(ev.target, '.item', node);
				var id = target.getAttribute('data-id');
				var date = target.getAttribute('data-date');
				var status = target.getAttribute('data-status');

				if (!id) {
					return;
				}

				var url = appendQuery(opts.getGift, {
					packetId: id,
					pointDate: date,
					whereDay: ''
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
			touch.on(nodeList.prev, 'tap', evtFuncs.prevMonth);
			touch.on(nodeList.next, 'tap', evtFuncs.nextMonth);
			touch.on(nodeList.date, 'tap', '.item', evtFuncs.showGift);
		}

		//-----------------自定义函数-------------
		var custFuncs = {
			isLeap: function(year) {
				if ((year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
					return 1;
				}
				else {
					return 0;
				}
			},

			initView: function() {
				var now = new Date();
				year = now.getFullYear();
				month = now.getMonth();

				custFuncs.drawCalendar();
			},

			drawCalendar: function() {
				m_days = [31, 28 + custFuncs.isLeap(year), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
				var counts = m_days[month];
				var html = '';
				var currentMonth = new Date(year, month, 1);
				var day = currentMonth.getDay();

				nodeList.year.innerHTML = year;
				nodeList.month.innerHTML = month + 1;

				for (var index = 0; index < day; index++) {
					html += '<div class="item"></div>';
				}

				var monthStr = (month + 1 + '').length < 2 ? '0' + (month + 1) : month + 1;
				var url = appendQuery(opts.history, {
					pointDate: year + '-' + monthStr
				});

				ajax({
					url: url,
					onSuccess: function(res) {
						if (res.status != 1) {
							showMessage(res.msg);
							return;
						}

						var result = res.data;

						var thePoints = result.thePoints.split(','); //签到日
						var packetIds = result.packetIds.split(','); //礼物id
						var thePointTimes = result.thePointTimes.split(','); //轮数

						var currentTimes = 0;
						var greenColor = true;
						var tickClass = '';

						for (index = 0; index < counts; index++) {
							if (packetIds[index] && packetIds[index] != '0') {
								var status = thePoints[index] ? 1 : 0;
								var dateStr = (index + 1 + '').length < 2 ? ('0' + (index + 1)) : (index + 1);
								html += '<div class="item" data-date="' + year + '-' + monthStr + '-' + dateStr + '" data-id="' + packetIds[index] + '" data-status="' + status + '">';
							}
							else {
								html += '<div class="item">';
							}

							html += '<span class="text">' + (index + 1);

							if (currentTimes == 0 && thePointTimes[index]) {
								currentTimes = thePointTimes[index];
							}

							if (thePoints[index]) {
								if (thePointTimes[index] && (currentTimes != thePointTimes[index])) {
									greenColor = !greenColor;
									currentTimes = thePointTimes[index];
								}

								if (greenColor) {
									tickClass = 'icon-sign-tick-green';
								}
								else {
									tickClass = 'icon-sign-tick-red';
								}

								html += '<span class=' + tickClass + '></span>';
							}

							if (packetIds[index] && packetIds[index] != '0') {
								html += '<span class="icon-sign-gift"></span>';
							}

						 	html += '</span></div>';
						}

						nodeList.date.innerHTML = html;
					}
				})
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