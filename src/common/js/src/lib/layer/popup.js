/**
 * popup浮层
 *
 * option:
 *     autoHide: false 当屏幕其它位置获得焦点是否自动显示。当设置为true时，如果是由click触发的弹层，
 *               则需要在click响应函数中调用lib/evt/stop，否则浮层马上又被关闭
 *     autoDirection: false 是否根据基准点决定显示位置，当设置为false的时候，则将基准点当成layer的左上角
 *     direction: "right bottom" 当autoDirection启用时，popup浮层不再将基准点当成左上角，
 *                而是根据设置的方向优先级决定显示区域，如果该区域显示不下，则再根据优先级显示在下一个位置
 *                取left/right以及top/bottom中各一个，如果所有位置都放置不下，则固定放在left top，以防止出滚动条
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("../io/console");
	var compBase = require("../comp/base");
	var parseNode = require("../dom/parseNode");
	var addEvent = require("../evt/add");
	var removeEvent = require("../evt/remove");
	var stopPropagation = require("../evt/stopPropagation");
	var layerBase = require("../layer/base");
	var merge = require("../json/merge");
	var clone = require("../json/clone");
	var getPosition = require("../dom/getPosition");
	var winSize = require("../util/winSize");
	var scrollPos = require("../util/scrollPos");
	var getScrollBarSize = require("../util/getScrollBarSize");
	var browser = require("../util/browser");
	var touch = require("touch");
	//---------- require end -------------

	var defaultOption = {
		autoHide: false,
		autoDirection: false,
		direction: "right bottom"
	}

	return function(opts) {
		opts = merge(defaultOption, opts || {});
		var that = layerBase(opts);
		var superMethod = {
			show: that.show,
			init: that.init
		};

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var node = null;
		var autoHide = false;
		var direction = { h: "right", v: "bottom"};

		//---------------事件定义----------------
		var evtFuncs = {
			autoHideClick: function() {
				that.hide();
			},
			stopNodeAutoHide: function(ev) {
				if ("originEvent" in ev) {
					stopPropagation(ev.originEvent);
				} else {
					stopPropagation(ev);
				}
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {}

		//-----------------自定义函数-------------
		var custFuncs = {
			/**
			 * 基于x,y为基准点显示浮层
			 * @param  {string} x             0px 基准点的x轴座标
			 * @param  {string} y             0px 基准点的y轴座标
			 * @param  {object} handlers 允许定义beforeAppend、beforeAnimate、afterAnimate
			 *                           beforeAppend: 节点被添加到文档流之前
			 *                           beforeAnimate: 节点被添加到文档之后，开始显示动画之前
			 *                           afterAnimate: 显示动画之后
			 */
			show: function(x, y, handlers) {
				handlers = handlers || {};

				superMethod.show.call(that, {
					beforeAppend: function() {
						handlers.beforeAppend && handlers.beforeAppend();
						// 先隐藏掉，准备计算它的显示位置
						node.style.visibility = "hidden";
					},
					beforeAnimate: function() {
						if (opts.autoDirection) {
							that.setPosition("0px", "0px");

							var nodeSize = {
								width: node.offsetWidth,
								height: node.offsetHeight
							}

							var clientSize = winSize();
							var dir = clone(direction);
							var scroll = scrollPos();

							that.setPosition(x + "px", y + "px");
							var barSize = getScrollBarSize();
							var pos = getPosition(node);
							var params = {
								x: pos.left,
								y: pos.top,
								clientWidth: clientSize.width,
								clientHeight: clientSize.height,
								nodeWidth: nodeSize.width,
								nodeHeight: nodeSize.height,
								scrollLeft: scroll.left,
								scrollTop: scroll.top,
								barH: barSize.h,
								barV: barSize.v
							}

							if (dir.h == "left") {
								dir.h = custFuncs.checkLeft(params) ? "left" : "right";

								if (dir.h == "right") {
									dir.h = custFuncs.checkRight(params) ? "right" : "left";
								}
							} else {
								dir.h = custFuncs.checkRight(params) ? "right" : "left";
							}

							if (dir.v == "top") {
								dir.v = custFuncs.checkTop(params) ? "top" : "bottom";

								if (dir.v == "bottom") {
									dir.v = custFuncs.checkBottom(params) ? "bottom" : "top";
								}
							} else {
								dir.v = custFuncs.checkBottom(params) ? "bottom" : "top";
							}

							var left = dir.h == "left" ? params.x - params.nodeWidth : params.x;
							var top = dir.v == "top" ? params.y - params.nodeHeight : params.y;
							that.setPosition(left + "px", top + "px");
						} else {
							that.setPosition(x + "px", y + "px");
						}

						node.style.visibility = "visible";
						handlers.beforeAnimate && handlers.beforeAnimate();
					}
				});
			},
			setAutoHide: function(isAutoHide) {
				if (isAutoHide == autoHide) {
					return;
				}

				autoHide = isAutoHide;

				if (browser.MOBILE) {
					if (autoHide) {
						touch.on(document, "tap", evtFuncs.autoHideClick);
						touch.on(node, "tap", evtFuncs.stopNodeAutoHide);
					} else {
						touch.off(document, "tap", evtFuncs.autoHideClick);
						touch.off(node, "tap", evtFuncs.stopNodeAutoHide);
					}
				} else {
					if (autoHide) {
						addEvent(document, "click", evtFuncs.autoHideClick);
						addEvent(node, "click", evtFuncs.stopNodeAutoHide);
					} else {
						removeEvent(document, "click", evtFuncs.autoHideClick);
						removeEvent(node, "click", evtFuncs.stopNodeAutoHide);
					}
				}

			},
			checkRight: function(params) {
				return (params.x + params.nodeWidth) <= (params.scrollLeft + params.clientWidth - params.barV);
			},
			checkLeft: function(params) {
				return (params.x - params.nodeWidth) >= params.scrollLeft;
			},
			checkTop: function(params) {
				return (params.y - params.nodeHeight) >= params.scrollTop;
			},
			checkBottom: function(params) {
				return (params.y + params.nodeHeight) <= (params.scrollTop + params.clientHeight - params.barH);
			}
		}

		//-----------------初始化----------------
		var init = function(_data) {
			superMethod.init.call(that, _data);
			node = that.getOuter();
			nodeList = parseNode(node);
			data = _data;
			direction.h = opts.direction.toLowerCase().indexOf("left") == -1 ? "right" : "left";
			direction.v = opts.direction.toLowerCase().indexOf("top") == -1 ? "bottom" : "top";
			custFuncs.setAutoHide(opts.autoHide);
			modInit();
			bindEvents();
		}

		//-----------------暴露各种方法-----------
		that.init = init;
		that.show = custFuncs.show;
		that.setAutoHide = custFuncs.setAutoHide;

		return that;
	}
});