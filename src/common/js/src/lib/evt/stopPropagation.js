/**
 * 停止事件冒泡
 * 例子请阅读add函数
 */
define(function(require, exports, module) {
    var getEvent = require("../evt/get");

    return function(event) {
        event = event || getEvent();

        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.returnValue = false;
        }

        return false;
    };
});