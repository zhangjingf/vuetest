/**
 * 标准窗口基础对象
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("../io/console");
	var compBase = require("../comp/base");
	var parseNode = require("../dom/parseNode");
	var addEvent = require("../evt/add");
	var className = require("../dom/className");
	var merge = require("../json/merge");
	var isElement = require("../dom/isElement");
	var browser = require("../util/browser");
	var modal = require("../layer/modal");
	var touch = require("touch");
	//---------- require end -------------

	var TMPL = '<div class="header" node-name="header">\
						<div class="title" node-name="title">提示</div>\
						<a href="javascript:void(0);" class="close" node-name="close"></a>\
					</div>\
					<div class="inner" node-name="inner"></div>'
	return function(opts) {
		opts = opts || {};
		var that = modal(opts);

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var node = null;
		var innerBox = null;
		var superMethod = {
			init: that.init
		};

		//---------------事件定义----------------
		var evtFuncs = {
			close: function() {
				that.hide("close");
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			if (browser.MOBILE) {
				touch.on(nodeList.close, "tap", evtFuncs.close);
			} else {
				addEvent(nodeList.close, "click", evtFuncs.close);
			}
		}

		//-----------------自定义函数-------------
		var custFuncs = {
			setTitle: function(title) {
				nodeList.title.innerHTML = title;
			},
			setInner: function(inner) {
				if (!isElement(inner)) {
					console.error("lib/layer/dialog/base: inner必须为元素");
					return;
				}

				innerBox && nodeList.inner.removeChild(innerBox);
				nodeList.inner.appendChild(inner);
				innerBox = inner;
			},
			getInner: function() {
				return innerBox;
			}
		}

		//-----------------初始化----------------
		var init = function(_data) {
			superMethod.init.call(that, _data);
			node = that.getOuter();
			className.add(node, "m-dialog-standard");
			node.innerHTML = TMPL;
			nodeList = parseNode(node);
			data = _data;

			modInit();
			bindEvents();
		}

		//-----------------暴露各种方法-----------
		that.init = init;
		that.setTitle = custFuncs.setTitle;
		that.setInner = custFuncs.setInner;
		that.getInner = custFuncs.getInner;

		return that;
	}
});