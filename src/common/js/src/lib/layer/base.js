/**
 * 层基础对象
 * 方法：
 *     init: 初始化
 *     show: 将浮层添加到文档中，并显示浮层
 *     		 hanlder: 弹层执行显示动画结束后的回调
 *     hide: 将浮层从文档中移除。
 *           why: 关闭原因
 *           extra: 附加数据
 *           hanlder: 弹层执行隐藏动画结束但尚未从文档移除时的回调
 *     getOuter: 获取浮层容器元素
 *     fullscreen: 使浮层铺满整个可视区域
 *     setMiddle: 将浮层居中
 *     keepMiddle: 保持浮层居中
 *     setTop: 将浮层显示在最上层
 *     getStatus: 浮层是否处于可见状态
 *
 * opts:
 * 		showAnimate: function(layer, handler)
 * 		hideAnimate: function(layer, handler)
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("../io/console");
	var compBase = require("../comp/base");
	var parseNode = require("../dom/parseNode");
	var addEvent = require("../evt/add");
	var removeEvent = require("../evt/remove");
	var setStyle = require("../dom/setStyle");
	var browser = require("../util/browser");
	var pageSize = require("../util/pageSize");
	var winSize = require("../util/winSize");
	var scrollPos = require("../util/scrollPos");
	var clone = require("../json/clone");

	//---------- require end -------------

	return function(opts) {
		opts = opts || {};
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var node = null;
		var isKeepMiddle = false;

		//---------------事件定义----------------
		var evtFuncs = {}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {}

		//-----------------自定义函数-------------
		var custFuncs = {
			/**
			 * 获取弹层是否处于就绪状态
			 * @return {boolean} 是否处于就绪状态
			 */
			getStatus: function() {
				return node != null && node.parentNode === document.body;
			},
			/**
			 * 显示浮层
			 * @param  {object} handlers 允许定义beforeAppend、beforeAnimate、afterAnimate
			 *                           beforeAppend: 节点被添加到文档流之前
			 *                           beforeAnimate: 节点被添加到文档之后，开始显示动画之前
			 *                           afterAnimate: 显示动画之后
			 */
			show: function(handlers) {
				if (custFuncs.getStatus()) {
					return;
				}

				handlers = handlers || {};
				that.fire("beforeshow");

				handlers.beforeAppend && handlers.beforeAppend();
				document.body.appendChild(node);
				handlers.beforeAnimate && handlers.beforeAnimate();

				if (opts.showAnimate) {
					opts.showAnimate(that, function() {
						handlers.afterAnimate && handlers.afterAnimate();
						that.fire("aftershow");

						if (isKeepMiddle) {
							that.setMiddle();
						}
					});
				} else {
					handlers.afterAnimate && handlers.afterAnimate();
					that.fire("aftershow");

					if (isKeepMiddle) {
						that.setMiddle();
					}
				}

				that.fire("show");
			},
			/**
			 * 隐藏弹层
			 * @param  {string} why     隐藏的原因，默认为hide
			 * @param  {object} extra   隐藏时往beforehide/afterhide传递的数据
			 * @param  {object} handlers 允许定义beforeAnimate、afterAnimate、afterRemove
			 * beforeAnimate: 执行隐藏动画之前
			 * afterAnimate: 执行隐藏动画之后，从文档流移除之前
			 * afterRemove: 从文档流移除之后
			 */
			hide: function(why, extra, handlers) {
				if (!custFuncs.getStatus()) {
					return;
				}

				handlers = handlers || {};

				var ev = {
					why: why || "hide",
					extra: extra || {}
				}

				that.fire("beforehide", clone(ev));
				handlers.beforeAnimate && handlers.beforeAnimate();

				if (opts.hideAnimate) {
					opts.hideAnimate(that, function() {

						handlers.afterAnimate && handlers.afterAnimate();
						document.body.removeChild(node);
						handlers.afterRemove && handlers.afterRemove();
						that.fire("afterhide", clone(ev));
					});
				} else {
					handlers.afterAnimate && handlers.afterAnimate();
					document.body.removeChild(node);
					handlers.afterRemove && handlers.afterRemove();
					that.fire("afterhide", clone(ev));
				}

				that.fire("hide", clone(ev));
			},
			/**
			 * 获取容器节点
			 * @return {element} 节点
			 */
			getOuter: function() {
				return node;
			},
			/**
			 * 设置弹层为全屏
			 */
			fullscreen: function() {
				if (!custFuncs.getStatus()) {
					return;
				}

				that.fire("beforefullscreen");

					var size = pageSize();

					setStyle(node, {
						"position": "absolute",
					"left": 0,
					"top": 0,
						"width": size.w + "px",
						"height": size.h + "px"
					});

				that.fire("afterfullscreen");
			},
			/**
			 * 设置弹层为居中
			 */
			setMiddle: function() {
				if (!custFuncs.getStatus()) {
					return;
				}

				that.fire("beforemiddle");

				var size = winSize();
				var scroll = scrollPos();
				var left = (size.width - node.offsetWidth) / 2 + scroll.left;
				var top = 0;

				// 如果位置足够，让它放高一点
				var testTop = Math.floor(size.height * .25);

				if ((testTop * 2 + node.offsetHeight) <= size.height) {
					top = testTop + scroll.top;
				} else {
					top = (size.height - node.offsetHeight) / 2 + scroll.top;
				}

				left = left < 0 ? 0 : left;
				top = top < 0 ? 0 : top;

				setStyle(node, {
					"left": left + "px",
					"top": top + "px"
				});

				that.fire("aftermiddle");
			},
			/**
			 * 设置弹层是否保持居中状态
			 * @param  {Boolean} isKeep 弹层是否为居中状态
			 */
			keepMiddle: function(isKeep) {
				isKeep = isKeep === false ? false : true;

				if (isKeepMiddle == isKeep) {
					return;
				}

				isKeepMiddle = isKeep;

				if (that.getStatus() && isKeep) {
					that.setMiddle();
				}
			},
			/**
			 * 要求弹层马上变成最上层的元素
			 */
			setTop: function() {
				if (!custFuncs.getStatus()) {
					return;
				}

				setStyle(node, "z-index", compBase.getZIndex());
			},
			/**
			 * 设置浮层的位置
			 * @param {number} x x轴的位置，请自带单位
			 * @param {[type]} y y轴的位置，请自带单位
			 */
			setPosition: function(x, y) {
				if (!custFuncs.getStatus()) {
					return;
				}

				setStyle(node, {
					left: x,
					top: y
				});
			}
		}

		//-----------------初始化----------------
		var init = function(_data) {
			node = document.createElement("DIV");
			data = _data;

			modInit();
			bindEvents();

			setStyle(node, {
				"position": "absolute",
				"left": 0,
				"top": 0
			});
		}

		//-----------------暴露各种方法-----------
		that.init = init; // 初始化
		that.show = custFuncs.show; // 将浮层加入文档，并显示
		that.hide = custFuncs.hide; // 将浮层移出文档
		that.getOuter = custFuncs.getOuter; // 获取最外层容器
		that.fullscreen = custFuncs.fullscreen; // 铺满整个屏幕
		that.setMiddle = custFuncs.setMiddle; // 居中显示
		that.keepMiddle = custFuncs.keepMiddle; // 设置保持一直居中
		that.setTop = custFuncs.setTop; // 显示在最上层
		that.getStatus = custFuncs.getStatus; // 浮层是否就绪，并且处于可视状态
		that.setPosition = custFuncs.setPosition; // 设置座标

		return that;
	}
});