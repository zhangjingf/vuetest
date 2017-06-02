/**
 * loading浮层
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var modal = require("lib/layer/modal");
	var className = require("lib/dom/className");
	//var layerBase = require("lib/layer/base");
	//---------- require end -------------

	var TMPL = '<img class="loading" src="./images/loading.gif" alt="loading" />\
				<p node-name="content"></p>'

	return function(content, opts) {
		opts = opts || {};
		content = content || '正在向服务器检查支付状态，请稍候';
		//var that = layerBase(opts);
		var that = modal();
		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var node = null;
		var innerBox = null;
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
		var custFuncs = {}

		//-----------------初始化----------------
		var init = function(_data) {
			superMethod.init.call(that, _data);
			node = that.getOuter();
			className.add(node, "m-loading");
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