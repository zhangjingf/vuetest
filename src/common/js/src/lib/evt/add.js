/**
 * 为一个节点或者节点数组添加事件
 * @2014-10-11 增加了批量处理功能，可以传入一个节点数组绑定事件
 *
 * var addEvent = require("../evt/add");
 * var removeEvent = require("../evt/remove");
 * var stopEvent = require("../evt/stop");
 * var sizzle = require("../dom/sizzle");
 * var handler = function(evt) {
 *     stopEvent(evt); // 阻止事件冒泡以及默认事件行为
 *     removeEvent(nodes, "click", handler); // 将addEvent时的参数原样不动传给removeEvent，可以解除事件
 * }
 *
 * var nodes = sizzle(".nodes", parentNode); // 获取到parentNode中所有class为nodes的节点，返回一个数组
 * addEvent(nodes, "click", handler); // 为数组nodes中所有的节点绑定click事件
 * // 仅绑定一个可以只传入一个节点，而不是数组：addEvent(nodes[0], "click", hanlder);
 *
 *
 */
define(function(require, exports, module) {
    var getType = require("../util/getType");
    var each = require("../util/each");

	var addEvent = function(el, type, fn, setCapture) {
        if (getType(el) == "array") {
            var fun = addEvent;

            each(el, function(item, key) {
                fun(item, type, fn, setCapture);
            });
        }

        el = getType(el) == "string" ? document.getElementById(el) : el;

	    if (el == null || typeof fn != "function") {
	        return false;
	    }

        if (el.addEventListener) {
            el.addEventListener(type, fn, setCapture === true ? true : false);
        } else if (el.attachEvent) {
            el.attachEvent('on' + type, fn);
            if (setCapture && el.setCapture) { el.setCapture(); }
        } else {
            el['on' + type] = fn;
            if (setCapture && el.setCapture) { el.setCapture(); }
        }

        return true;
    };

    return addEvent;
});