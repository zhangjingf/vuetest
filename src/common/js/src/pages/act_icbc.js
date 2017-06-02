/**
 *
 *
 *  工行开卡活动
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	var touch = require("touch");
	var ajax = require("lib/io/ajax");
	var webBridge = require("sea/webBridge");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;

	//---------------事件定义----------------
	var evtFuncs = {
		toICBC: function (ev) {
			if (that.isLock()) {
				return;
			}
			that.lock();
			ajax({
				"url": opts["icbcurl"],
				"method": "post",
				"data": {},
				"onSuccess": function (res) {
					that.unLock();
					if (res["status"] == 0) {
						return;
					}
					var _url = res["data"]["url"].replace(/\|/g, "%7C");
					webBridge.openUrl(_url);
				},
				"onError": function (req) {
					that.unLock();
					console.error("操作失败，状态码：" + req["status"]);
				}
			})
		}
	}

	//---------------子模块定义---------------
	var modInit = function() {}

	//-----------------绑定事件---------------
	var bindEvents = function() {
		touch.on(nodeList.button,"tap",evtFuncs.toICBC)
	}

	//-----------------自定义函数-------------
	var custFuncs = {}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts || {};

		nodeList = {
			button: queryNode("#m_toICBC")
		}

		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});