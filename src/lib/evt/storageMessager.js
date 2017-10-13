/**
 * 调用localStorage实现不同页面通讯机制
 */
var clone = require("../json/clone");
var globalKey = "mopon-storage";
var that = {};
var events = {};
var timeout = 100;
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

    handlers.forEach(function(hld) {
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

    events[evtType].forEach(function(item) {
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

    events[evtType].forEach(function(item) {
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

module.exports = that;