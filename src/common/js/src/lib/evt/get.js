/**
 * 获取事件对象，一般情况下不需要使用本函数
 * 一般来说绑定事件时，event对象会当成参数传给响应函数，
 * 但在某些特殊情况下，可能event对象在函数调用链中没有传递（代码设计缺陷造成的）
 * 那可以使用本函数去获取。
 *
 * 例子：
 *
 * var getEvent = require("../evt/get");
 * var addEvent = require("../evt/add");
 *
 * var fun1 = function(evt) { // 注意没有事件对象传递
 *   var evt = evt || getEvent(); // 如果没有evt参数，则getEvent()获取
 *   console.log(evt.type);
 * }
 *
 * var handler = function(evt) {
 *   fun1(); // 调用了，可是没有将evt传递给fun1，这就是所谓的代码设计问题
 * }
 *
 * addEvent(node, "click", handler);
 *
 */
define(function(require, exports, module) {
    var getEvent = function() {
        if (document.addEventListener) {
            var o = getEvent, e;
                do {
                    e = o.arguments[0];
                    if (e && /Event/.test(Object.prototype.toString.call(e))) {
                        return e;
                    }
                } while (o = o.caller);
                return e;
        } else {
            return window.event;
        }
    }

    return getEvent;
});