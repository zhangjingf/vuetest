/**
 * 不要执行与事件关联的默认动作，并且停止事件冒泡
 * 例子请阅读add函数
 */
define(function(require, exports, module) {
    var getEvent = require("../evt/get");

    return function(event) {
        event = event || getEvent();

        if (event.preventDefault) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
            event.returnValue = false;
        }

        return false;
    };
});