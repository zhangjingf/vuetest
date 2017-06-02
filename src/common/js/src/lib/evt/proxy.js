/**
 * 利用事件冒泡实现事件代理（尽量不要用mouseover之类非常耗性能的代理，建议自己实现）
 *
 * HTML:
 * <div id="node">
 *  <a href="javascript:void(0);" onclick="return false;" data-action="send" data-query="id=1&name=a">点击我</a>
 *  <a href="javascript:void(0);" onclick="return false;" data-action="send" data-query="id=2&name=b">点击我</a>
 * </div>
 *
 * var eventProxy = require("../evt/proxy");
 * var node = document.getElementById("node");
 * var proxy = eventProxy(node); // 为node节点建立一个事件代理器
 * var handler = function(evt) {
 *     return 0; // 可以返回： 0 正常执行（默认值），-1 不再执行未执行的事件响应函数，并且不响应上层元素的其它事件代理 其它真值：不再执行未执行的事件响应函数
 *
 *     evt的值是：
 *     evt = {
 *	       target: 触发事件的A连接对象,
 *         proxy: "send",
 *         data: { id: "1", name: "a"}, // 由data-query的值解析而来的json对象,data-query是一个查询字符串
 *         box: node, // 即建立事件代理的容器
 *         event: event对象 // DOM真正的event对象
 *     }
 * }
 *
 * proxy.add("send", "click", handler);
 *
 */
define(function(require, exports, module) {
	var addEvent = require("../evt/add");
	var removeEvent = require("../evt/remove");
	var getEvent = require("../evt/get");
	var dataset = require("../dom/dataset");
	var each = require("../util/each");
	var trim = require("../str/trim");
	var queryToJson = require("../json/queryToJson");
	var console = require("../io/console");
	var proxyNameKey = "action";
	var proxyDataKey = "query";

	return function(outerNode) {
		var that = {};
		var bindEvents = {};

    var eventHanlder = function(evt) {
			var node = evt.target || evt.srcElement;
			var evtResult = 0;
			var actionDatas = [];

			// 首先收集所有需要触发事件的节点（防止中途节点remove掉）
			while(node != outerNode) {
            if (node == null) {
                return;
            }

				if (node === outerNode) {
					break;
				}

				var name = dataset.get(node, proxyNameKey);

				if (name == null || (name = trim(name)) == "") {
					node = node.parentNode;
					continue;
				}

				if (bindEvents[evt.type] == null || bindEvents[evt.type][name] == null) {
					node = node.parentNode;
					continue;
				}

            if (node == null) {
                return;
            }

				actionDatas.push({
					target: node,
					proxy: name,
					data: queryToJson(dataset.get(node, proxyDataKey), true) || {}
				});

				node = node.parentNode;
			}

			var fns = bindEvents[evt.type];
			var actionData = null;
			evtResult = 0;

			for (var i = 0; i < actionDatas.length; i++) {
				actionData = actionDatas[i];

				for (var j = 0; j < fns[actionData.proxy].length; j++) {
					evtResult = fns[actionData.proxy][j]({
						target: actionData.target,
						proxy: actionData.proxy,
							box: outerNode,
							event: evt,
						data: actionData.data
						});

					if (evtResult == undefined) {
						evtResult = 0;
					}

					if (evtResult != 0) {
						break;
					}
				}

				if (evtResult == -1) {
					break;
					}
				}
			}

		that.add = function(name, eventName, fn) {
			if (typeof fn != "function") {
				console.error("参数fn必须是函数");
				return;
		}

			if (bindEvents[eventName] == null) {
				bindEvents[eventName] = {};
				addEvent(outerNode, eventName, eventHanlder);
			}

			if (bindEvents[eventName][name] == null) {
				bindEvents[eventName][name] = [];
			}

			bindEvents[eventName][name].push(fn);
		}

		that.remove = function(name, eventName, fn) {
			if (typeof fn != "function") {
				console.error("参数fn必须是函数");
				return;
			}

			if (bindEvents[eventName] == null) {
				return;
			}

			if (bindEvents[eventName][name] == null) {
				return;
			}

			var fns = bindEvents[eventName][name];
			var newFns = [];
			var len = fns.length;

			for (var i = 0; i < len; i++) {
				if (fns[i] !== fn) {
					newFns.push(fns[i]);
				}
			}

			var isEmpty = true;

			bindEvents[eventName][name] = newFns.length == 0 ? null : newFns;

			// 清除没用的事件
			for (var key in bindEvents[eventName]) {
				if (bindEvents[eventName][key] == null) {
					try { //尽可能地删除它
						delete bindEvents[eventName][key];
					}catch(ex){}
				} else {
					isEmpty = false;
					break;
				}
			}

			if (isEmpty) {
				bindEvents[eventName] = null;

				try { // 尽可能删除它
					delete bindEvents[eventName];
				} catch(ex) {}

				removeEvent(outerNode, eventName, eventHanlder);
			}
		}

		return that;
	}
});