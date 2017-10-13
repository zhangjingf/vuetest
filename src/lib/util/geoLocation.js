/**
 * 封装了geolocation的请求
 */

var clone = require("../json/clone");
var merge = require("../json/merge");

module.exports = function(callback, opts) {
    opts = merge({
        enableHighAccuracy: true,
        timeout: 3000,
        maximumAge: 5000
    }, opts || {});

    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            var obj = {};

            for (var p in pos["coords"]) {
                obj[p] = pos["coords"][p];
            }

            callback({
                "code": 0,
                "msg": "success",
                "data": obj
            });
        }, function(error) {
            var msg = "";

            switch(error.code) {
                case error.PERMISSION_DENIED:
                  msg = "用户拒绝对获取地理位置的请求。";
                  break;
                case error.POSITION_UNAVAILABLE:
                  msg ="位置信息是不可用的。";
                  break;
                case error.TIMEOUT:
                  msg = "请求用户地理位置超时。";
                  break;
                // case error.UNKNOWN_ERROR:
                default:
                  msg = "未知错误。";
                  break;
            }

            console.error("定位获取失败，原因：" + msg);

            callback({
                "code": -1,
                "msg": msg,
                "data": null
            });
        }, opts);
    } else {
        console.error("定位获取失败，原因：不支持geolocation");

        callback({
            "code": -2,
            "msg": "不支持geolocation",
            "data": null
        });
    }
}