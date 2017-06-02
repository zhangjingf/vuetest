/**
 * 激活事件
 * 注意：某些事件可能由于安全权限而必须由用户行为去触发，比如上传文件
 *
 * var fireEvent = require("../evt/fire");
 * var node = document.getElementById("node");
 * fireEvent(node, "click"); // 触发node的click事件。
 *
 */
define(function(require, exports, module) {
	return function(el, sEvent) {
        el = typeof el == "string" ? document.getElementById(el) : el;

        //由于IE9下有两种事件模型，所以addEvent,removeEvent,fireEvent的判定方式要相同
        if (element.addEventListener) {
            var evt = document.createEvent('HTMLEvents');
            evt.initEvent(sEvent, true, true);
            el.dispatchEvent(evt);
        } else {
            el.fireEvent('on' + sEvent);
        }
    };
});