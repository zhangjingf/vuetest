/**
 * 获取ajax请求需要的信息
 */
define(function(require, exports, module) {
    var calendar = require("lib/util/calendar");
    var json2 = require("lib/json/json2");
    var md5 = require("lib/util/md5");
    var cal = calendar();
    var key = "888888";
    var appKey = "C10000002";
    var url = "/Interface/MobileInterface.ashx";
    // 测试环境接口地址：
    // http://172.16.34.3:8021/Interface/MobileInterface.ashx

    exports.create = function(tradeId, data) {
        var ts = cal.format("%yyyy%MM%dd%hh%mm%ss", new Date());
        return {
            "zip": false,
            "param": JSON.stringify({
                "head": {
                    "timestamp": ts,
                    "tradeId": tradeId,
                    "appKey": "C10000002",
                    "validCode": md5(ts + key).toUpperCase()
                },
                "body": data
            })
        }
    },
    exports.getUrl = function() {
        return url;
    },
    exports.getKey = function() {
        return key;
    }
});