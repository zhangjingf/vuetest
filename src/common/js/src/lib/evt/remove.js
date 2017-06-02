/**
 * 删除事件
 * @2014-10-11 增加了批量处理功能，可以传入一个节点数组解绑事件
 * 例子请阅读add函数
 */
define(function(require, exports, module) {
    var getType = require("../util/getType");
    var each = require("../util/each");

    var removeEvent = function(el, type, fn, releaseCapture) {
        if (getType(el) == "array") {
            var fun = removeEvent;

            each(el, function(item, key) {
                fun(item, type, fn, releaseCapture);
            });
        }

        el = typeof el == "string" ? document.getElementById(el) : el;

	    if (el == null || typeof fn != "function") {
	        return false;
	    }

        if (el.removeEventListener) {
            el.removeEventListener(type, fn, releaseCapture === true ? true : false);
        } else if (el.detachEvent) {
            el.detachEvent("on" + type, fn);
            if (releaseCapture && el.releaseCapture) { el.releaseCapture(); }
        } else {
        	el['on' + type] = null;
            if (releaseCapture && el.releaseCapture) { el.releaseCapture(); }
        }

        return true;
    };

    return removeEvent;
});