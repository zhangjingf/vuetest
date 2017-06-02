/**
 * 用于跨页面通讯
 */
/**
 * postMessager的管理对象
 * @param  {[type]}  handler [数据回调函数]
 * @param  {[type]}  domain  [发送目标域名，默认为*]
 * @param  {Boolean} bindAll   [接收所有使用本组件发送的消息，默认仅接收发送给本组件的消息]
 * @return {[type]}          [description]
 */
define(function(require, exports, module) {
var base = require("../comp/base"); // 基础对象
var addEvent = require("../evt/add");
var md5 = require("../util/md5");
var each = require("../util/each");
var moduleId = "lib/io/postMessager";
var listeners = {
    'all': []
};

addEvent(window, "message", function(ev) {
    var data = null;
    var evObj = null;

    try {
        data = JSON.parse(ev.data);
    } catch(ex) {
        console.error(ex);
        return;
    }

    if (data["moduleId"] != moduleId) {
        return;
    }

    each(listeners['all'], function(listener) {
        if (listener["target"].getKey() == data["targetKey"]) {
            return;
        }

        evObj = {
            "target": listener["target"],
            "data": data.msg,
            "fromKey": data["targetKey"]
        }

        try {
            listener["target"].getHandler()(evObj);
        }catch(ex) {
            console.error(ex);
        }
    });

    if (listeners[data["toKey"]]) {
        evObj = {
            "target": listeners[data["toKey"]]["target"],
            "data": data.msg,
            "fromKey": data["targetKey"]
        }

        try {
            listeners[data["toKey"]]["target"].getHandler()(evObj);
        }catch(ex) {
            console.error(ex);
        }
    }
});
    return function(handler, bindAll, domain) {
        var that = {};
        var key = md5((new Date().getTime() + Math.floor(Math.random() * 100000)).toString());
        bindAll = bindAll === true ? true : false;
        domain = domain || "*";

        var listener = {
            "target": that,
            "handler": handler
        }

        if (bindAll) {
            listeners['all'].push(listener);
        } else {
            listeners[key] = listener;
        }

        that.send = function(data, toKey) {
            var data = {
                "moduleId": moduleId,
                "targetKey": key,
                "toKey": toKey,
                "msg": data
            }

            var postData = JSON.stringify(data);

            // 当是子页面时
            if (window != window.top) {
                window.top.postMessage(postData, domain);
            } else {
                var iframes = document.getElementsByTagName("IFRAME");

                for (var i = 0; i < iframes.length; i++) {
                    iframes[i].contentWindow.postMessage(postData, domain);
                }
            }
        }

        that.getKey = function() {
            return key;
        }

        that.getDomain = function() {
            return domain;
        }

        that.bindAll = function() {
            return bindAll;
        }

        that.getHandler = function() {
            return handler;
        }

        return that;
    }
});