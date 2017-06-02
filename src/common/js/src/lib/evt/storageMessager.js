/**
 * 调用localStorage实现不同页面通讯机制
 * 建议仅在移动端使用
 */
define(function(require, exports, module) {
    var console = require("../io/console");
    var addEvent = require("../evt/add");
    var each = require("../util/each");
    var clone = require("../json/clone");
    var globalKey = "lib/evt/storageMessager";
    var that = {};
    var events = {};
    var timeout = 1;

    if (!("localStorage" in window)) {
        console.error("lib/evt/storageMessager无法在本环境下工作");
        return null;
    }

    var lastValue = localStorage.getItem(globalKey);

    var checkStorage = function() {
        var newValue = localStorage.getItem(globalKey);
        var json = null;

        if (lastValue == newValue) {
            setTimeout(checkStorage, timeout);
            return;
        }

        if (newValue == null) {
            lastValue = null;
            setTimeout(checkStorage, timeout);
            return;
        }

        lastValue = newValue;

        try {
            json = JSON.parse(newValue);
        }catch(ex) {
            console.error(ex);
            setTimeout(checkStorage, timeout);
            return;
        }

        if (!(json.name in events)) {
            setTimeout(checkStorage, timeout);
            return;
        }

        var handlers = events[json.name];

        each(handlers, function(hld) {
            try {
                hld.call(that, {
                    "type": json.name,
                    "data": clone(json.data),
                    "time": json.time
                });
            }catch(ex) {
                console.error(ex);
            }
        });

        setTimeout(checkStorage, timeout);
    }

    that.send = function(evtType, data) {
        localStorage.setItem(globalKey, JSON.stringify({
            "name": evtType,
            "data": data,
            "time": new Date().getTime(),
            "url": location.href
        }));
    }

    that.bind = function(evtType, handler) {
        if (typeof(handler) != "function") {
            return;
        }

        if (!(evtType in events)) {
            events[evtType] = [];
        }

        each(events[evtType], function(item, index) {
            if (item === handler) {
                return;
            }
        });

        events[evtType].push(handler);
    }

    that.unbind = function(evtType, handler) {
        if (!(evtType in events)) {
            return;
        }

        var tmp = [];

        each(events[evtType], function(item, index) {
            if (item === handler) {
                return;
            }

            tmp.push(item);
        });

        if (tmp.length) {
            events[evtType] = tmp;
        } else {
            delete events[evtType];
        }
    }

    // 开始检查
    checkStorage();

    return that;
});