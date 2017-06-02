/**
 * 阻止事件默认行为
 *
 * HTML:
 * <a href="http://aq.yy.com" id="node">这是一个连接</a>
 *
 * var queryNode = require("../dom/queryNode");
 * var addEvent = require("../evt/add");
 * var preventDefault = require("../evt/preventDefault");
 * var node = queryNode("#node");
 *
 * var handler = function(evt) {
 *     preventDefault(evt); // 点击连接的时候，并不会将页面跳到http://aq.yy.com
 * }
 *
 * addEvent(node, "click", handler);
 */
define(function(require, exports, module) {
	var getEvent = require("../evt/get");

	return function(event) {
        event = event || getEvent();

        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    };
});