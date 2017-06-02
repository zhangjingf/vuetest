/**
 * 对window.console做了封装，防止由于没有删除console语句而报错
 * 如果需要使用到console对象，请引入本文件，而不要直接使用window.console
 *
 */
define(function(require, exports, module) {
	var methods = ["log", "debug", "info", "warn", "exception", "assert", "dir", "dirxml", "trace", "group",
	"groupCollapsed", "groupEnd", "profile", "profileEnd", "count", "clear", "time", "timeEnd", "timeStamp",
	"table", "error", "markTimeline", "timeline", "timelineEnd", "cd", "countReset","select"];

	var console = window.console || {};
	var emptyFunc = function() {};

	for (var key in methods) {
		if (!(methods[key] in console)) {
			console[methods[key]] = emptyFunc;
		}
	}

	return console;
});