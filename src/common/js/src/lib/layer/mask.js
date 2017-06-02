/**
 * 半透明遮罩层
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("../io/console");
	var compBase = require("../comp/base");
	var parseNode = require("../dom/parseNode");
	var addEvent = require("../evt/add");
	var layerBase = require("../layer/base");
	var merge = require("../json/merge");
	//---------- require end -------------

	return function(opts) {
		var that = layerBase(opts);

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var node = null;
		var superMethod = {
			show: that.show,
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
			show: function(handlers) {
				handlers = handlers || {};

				superMethod.show.call(that, merge(handlers, {
					afterAnimate: function() {
						that.fullscreen();
						that.setTop();
						handlers.afterAnimate && handlers.afterAnimate();
					}
				}));
			},
			//设置弹层透明度  不调用此方法就采用默认透明度
			setMaskOpacityStyle: function (value) {
				var val = parseFloat(value);
				if (val > 1) {
					val = val/100;
				};
				node.style.cssText = "-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=" + (val*100) + "); filter: alpha(opacity=" + (val*100) + "); opacity: " + val + "; background-color: black;";
			}
		}

		//-----------------初始化----------------
		var init = function(_data) {
			superMethod.init.call(that, _data);
			node = that.getOuter();
			node.className = 'mask-layer';
			nodeList = parseNode(node);
			data = _data;

			modInit();
			bindEvents();

			node.style.cssText = "-ms-filter: progid:DXImageTransform.Microsoft.Alpha(Opacity=20); filter: alpha(opacity=20); opacity: 0.2; background-color: black;";
		}

		//-----------------暴露各种方法-----------
		that.init = init;
		that.show = custFuncs.show;
		that.setMaskOpacityStyle = custFuncs.setMaskOpacityStyle;

		return that;
	}
});