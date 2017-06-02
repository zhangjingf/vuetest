/**
 * 签到模块
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var ajax = require("lib/io/ajax");
	var className = require("lib/dom/className");
	var closest = require("lib/dom/closest");
	var touch = require("touch");
	var showMessage = require('sea/showMessage');
	var webBridge = require('sea/webBridge');
	var appendQuery = require("lib/str/appendQuery");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;

		//---------------事件定义----------------
		var evtFuncs = {
			sign: function(ev) {
				if(opts['hasErrorStatus'] == '1') {
					showMessage('签到失败，本轮活动积分已发放完');
				} else {
					showMessage('您今天已经签过到啦');
				}

			},

			jumpToMall: function() {
				webBridge.popToSelectedController('mall');
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			touch.on(nodeList.sign, 'tap', evtFuncs.sign);
			touch.on(nodeList.mall, 'tap', evtFuncs.jumpToMall);
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