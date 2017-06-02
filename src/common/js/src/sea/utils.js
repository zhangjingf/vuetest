/**
 * 工具类
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var className = require("lib/dom/className");
	var sizzle = require('lib/dom/sizzle');
	var each = require('lib/util/each');
	var URL = require("lib/util/URL");
	var jsonToQuery = require("lib/json/jsonToQuery");
	var queryToJson = require("lib/json/queryToJson");
	var appendQuery = require("lib/str/appendQuery");
	//---------- require end -------------

	var that = exports;

	/**
	 * 倒计时
	 * @param  {Node}  倒计时位置节点
	 * @param  {String}  当时时间戳  eg."20160111173259"
	 * @param  {num}  倒计秒数  eg."10" ==> 10s
	 */
	that.countDown = function (node, string, s) {
		var timer = null;
		var year = string.substr(0,4);
		var month = string.substr(4,2);
		var day = string.substr(6,2);
		var hour = string.substr(8,2);
		var minute = string.substr(10,2);
		var second = string.substr(12,2) ||"00";
		var current = new Date();
		current.setFullYear(year, parseInt(month)-1, day);
		current.setHours(hour, minute, second);
		function countStart() {
			var now = new Date();
			var count = Math.floor(((current.getTime() + s * 1000) - now.getTime())/1000);
			if(count <= 0/* || count > s*/){
				node.innerHTML = "0分0秒";
				return;
			}

			var min = Math.floor(count / 60);
			var sec = count % 60 ;
			//sec = sec < 10 ? "0" + sec : sec;
			node.innerHTML = min + "分" + sec + "秒";
			timer = setTimeout(countStart, 950);
			if (min == 0 && sec == 0) {
				clearTimeout(timer);
				timer = null;
			}
		}
		countStart();
	}

	/**
	 * 显示节点方法
	 * @param  {String} 要显示的节点的选择器
	 */
	that.show = function(selector) {
		var nodes = sizzle(selector);
		each(nodes, function(node, key, source) {
			className.remove(node, 'hide');
			className.add(node, 'show');
		})
	}

	/**
	 * 隐藏节点方法
	 * @param  {String} 要隐藏的节点的选择器
	 */
	that.hide = function(selector) {
		var nodes = sizzle(selector);
		each(nodes, function(node, key, source) {
			className.remove(node, 'show');
			className.add(node, 'hide');
		})
	}

	/**
	 * 转化rem为px
	 * @param  {num} rem的大小
	 */
	 that.remToPixel = function(rem) {
	 	var docEl = document.documentElement;
		var portrait = ((Math.min(docEl.clientWidth, docEl.clientHeight) / 320) * 10);
		var pixel = portrait * rem;

		return pixel;
	 }

	/**
	 * 获取当前url，并且去除_target=blank
	 */
	that.getCurrentURL = function() {
		var url = URL.parse(location.href);
		var query = queryToJson(url.query);

		if ("_target" in query) {
			delete query["_target"];
		}

		url.query = jsonToQuery(query);
		url = URL.build(url)

		return url;
	}

	return that;
});