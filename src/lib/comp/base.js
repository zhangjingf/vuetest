/**
 * 定义了组件的基本代码功能
 * 例子：
 * var compBase = require("../comp/base");
 * var uniqueId = compBase.getUniqueId(); // 获取一个组件机制内不重复的数字ID，从0开始递增
 * var zIndex = compBase.getZIndex(); // 获取一个组件机制内不重复的zindex，从10000开始递增
 * var that = compBase(); // 获取一个组件实例，可以对其进行扩展。
 *
 * 全局锁机制的使用：在一些异步操作的按钮响应，经常会限制用户在响应期间只允许点击一次，那么可以使用锁。
 * that.lock(); // 所有组件实例的锁状态都被设置为true
 * if (that.isLock()) { .... } // 检查全局锁的状态是否为锁定，如果锁定则可能返回不做处理，要注意，你可以无视它继续做其它操作。
 * that.unLock(); // 解锁。注意锁定后一定要在所有的流程走向都有解锁操作，以防止死锁。
 *
 * 自定义事件模型： 建立了一个简单的事件模型，拥有绑定、解绑以及触发功能
 * 注意：由于JS的封装机制只有公开和私有，触发事件只能定义为公开方法，否则无法给扩展后的对象使用
 * 因此外部是可以调用，但事实上它只应该在内部被调用用于触发指定的事件
 * var myComp = XXComp(); // 扩展自base的某个组件实例
 *
 * myComp.bind("finish", function(evt) {
 *    console.log(evt.type); // 事件的名称，应该为finish
 *    console.log(evt.target); // 事件来源对象，应该为myComp对象，由于响应函数可能被指定给多个对象的事件，因此它可以得到触发事件的对象
 *    console.log(evt.data); // 事件触发的时候送过来的数据
 * });
 *
 * 在myComp的实现代码中，可以这样触发事件：
 * var that = compBase();
 *
 * that.fire("finish", {
 *     name: "benny",
 *     gender: "M"
 * });
 *
 * 这样子在响应函数中读取到的evt.data的值就是这个{ name: "benny", gender: "M" }，它并不是必须的
 */
require("./fixIE8"); // 如果使用IE8的话
var console = require("../io/console");
var each = require("../util/each");

var getUniqueId = (function() {
    var uniqueID = 0;
    var prefix = "LIVE_COMP_";

    return function() {
        return prefix + (uniqueID++);
    }
})();

var getZIndex = (function() {
    var zIndex = 10000;

    return function() {
        return zIndex++;
    }
})();

var isLock = false;

var base = function() {
    var that = {};
    var events = {};

    that.bind = function(evtType, handler) {
        if (typeof(handler) != "function") {
            return;
        }

        if (!(evtType in events)) {
            events[evtType] = [];
        }

        var flat = true;
        each(events[evtType], function(item) {
            if (item === handler) {
                flat = false;
                return false;
            }
        });
        flat && events[evtType].push(handler);
    };

    that.unbind = function(evtType, handler) {
        if (!(evtType in events)) {
            return;
        }

        each(events[evtType], function(item, index) {
            if (item === handler) {
                events[evtType].splice(index, 1);
                return false;
            }
        });
    };

    that.fire = function(evtType, data) {
        if (!(evtType in events)) {
            return;
        }

        each(events[evtType], function(item) {
            var evt = {
                type: evtType,
                target: that,
                data: data
            };

            item(evt);
        });
    };

    that.isLock = function() {
        return isLock;
    };

    that.lock = function() {
        isLock = true;
    };

    that.unLock = function() {
        isLock = false;
    };

    return that;
}

base.getUniqueId = getUniqueId;
base.getZIndex = getZIndex;

module.exports = base;
