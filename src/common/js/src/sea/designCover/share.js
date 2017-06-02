/**
 *
 *分享
 *
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var touch = require("touch");
	var closest = require("lib/dom/closest");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;

		//---------------事件定义----------------
		var evtFuncs = {
			share: function (ev) {
				var type = closest(ev.target, "[data-type]", nodeList.path).getAttribute("data-type");
				that.fire("shareToWeiXin",{"type":type});
			},
			cancel: function (ev) {
				that.fire("shareImg",{'flg': false});
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			touch.on(nodeList.path,"tap",evtFuncs.share);
			touch.on(nodeList.cancel,"tap",evtFuncs.cancel);
		}

		//-----------------自定义函数-------------
		var custFuncs = {
			shareImg: function (flg) {
				if(flg) {
					node.style.display = 'block';
				} else {
					node.style.display = 'none';
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
		that.shareImg = custFuncs.shareImg;
		return that;
	}
});