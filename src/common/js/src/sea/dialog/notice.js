/**
 * loading浮层
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var className = require("lib/dom/className");
	var layerBase = require("lib/layer/base");
	//---------- require end -------------

	var TMPL = '<div class="notice"><div node-name="content"></div></div>'

	return function(content, opts) {
		opts = opts || {};
		content = content || '提示消息';
		var that = layerBase(opts);
		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var node = null;
		var superMethod = {
			init: that.init
		};

		//---------------事件定义----------------
		var evtFuncs = {}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {}

		//-----------------自定义函数-------------
		var custFuncs = {
		}

		//-----------------初始化----------------
		var init = function(_data) {
			superMethod.init.call(that, _data);
			node = that.getOuter();
			className.add(node, "m-notice");
			node.innerHTML = TMPL;
			nodeList = parseNode(node);
			nodeList.content.innerHTML = content;
			data = _data;

			modInit();
			bindEvents();
		}

		//-----------------暴露各种方法-----------
		that.init = init;

		return that;
	}
});