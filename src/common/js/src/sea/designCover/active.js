/**
 *
 *
 *
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var touch = require("touch");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;

		//---------------事件定义----------------
		var evtFuncs = {
			saveImg: function (ev) {
				that.fire("saveImg");
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			touch.on(node,"tap",evtFuncs.saveImg);
		}

		//-----------------自定义函数-------------
		var custFuncs = {
			shareImg: function (flg) {
				if(flg) {
					node.style.display = 'none';
				} else {
					node.style.display = 'block';
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