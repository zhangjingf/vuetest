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
	var className = require("lib/dom/className");
	var queryToJson = require("lib/json/queryToJson");
	var webBridge = require("sea/webBridge");
	var URL = require("lib/util/URL");
	var touch = require("touch");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var url = null;

		//---------------事件定义----------------
		var evtFuncs = {
			toggle: function (ev) {
				className.toggle(nodeList.taps,"active")
			},
			toggleTable:function(){
				className.toggle(nodeList.table,"moreTable");
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			touch.on(nodeList.taps,"tap",evtFuncs.toggle);
			touch.on(nodeList.tips_2,"tap",evtFuncs.toggle);
			touch.on(nodeList.tbody,"tap",evtFuncs.toggleTable);
		}

		//-----------------自定义函数-------------
		var custFuncs = {
			fromActPayResult: function () {
				nodeList.table.style.height = (nodeList.maxShow.offsetTop - nodeList.table.offsetTop + (parseInt(document.querySelector("html").getAttribute("data-dpr")))*9) +'px';
				if (url['from'] == 'actPayResult') {
					webBridge.close(2);
				}
			}
		}

		//-----------------初始化----------------
		var init = function(_data) {
			nodeList = parseNode(node);
			data = _data;
			url = queryToJson(URL.parse(location.href)["query"]);

			custFuncs.fromActPayResult();

			modInit();
			bindEvents();
		}

		//-----------------暴露各种方法-----------
		that.init = init;

		return that;
	}
});