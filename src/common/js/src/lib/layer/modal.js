/**
 * 模态浮层
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("../io/console");
	var compBase = require("../comp/base");
	var parseNode = require("../dom/parseNode");
	var addEvent = require("../evt/add");
	var merge = require("../json/merge");
	var layerBase = require("../layer/base");
	var maskLayer = require("../layer/mask");
	//---------- require end -------------

	return function(opts) {
		opts = opts || {};
		var that = layerBase(opts);

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var node = null;
		var m_maskLayer = null;
		var superMethod = {
			show: that.show,
			init: that.init,
			hide: that.hide
		};

		//---------------事件定义----------------
		var evtFuncs = {}

		//---------------子模块定义---------------
		var modInit = function() {
			m_maskLayer = maskLayer();
			m_maskLayer.init();
		}

		//-----------------绑定事件---------------
		var bindEvents = function() {}

		//-----------------自定义函数-------------
		var custFuncs = {
			show: function(handlers) {
				handlers = handlers || {};

				if (document.activeElement) {
					document.activeElement.blur();
				}

				superMethod.show.call(that, merge(handlers, {
					beforeAppend: function() {
						m_maskLayer.show();
						handlers.beforeAppend && handlers.beforeAppend();
					},
					afterAnimate: function() {
						that.setTop();
						that.keepMiddle();
						handlers.afterAnimate && handlers.afterAnimate();
					}
				}));
			},
			hide: function(why, extra, handlers) {
				//ios 10 bug
				//在模态框里边有input框的时候hide移除节点不会让input失去焦点
				var onFocusNode = document.activeElement;
				if(onFocusNode && onFocusNode.tagName == 'INPUT') {
					onFocusNode.blur();
				}
				handlers = handlers || {};
				superMethod.hide.call(that, why, extra, merge(handlers, {
					afterRemove: function() {
						m_maskLayer.hide();
						handlers.afterRemove && handlers.afterRemove();
					}
				}));
			},
			getMask: function() {
				return m_maskLayer;
			}
		}

		//-----------------初始化----------------
		var init = function(_data) {
			superMethod.init.call(that, _data);
			node = that.getOuter();
			nodeList = parseNode(node);
			data = _data;

			modInit();
			bindEvents();
		}

		//-----------------暴露各种方法-----------
		that.init = init;
		that.show = custFuncs.show;
		that.hide = custFuncs.hide;
		that.getMask = custFuncs.getMask;

		return that;
	}
});