/**
 * 实现了用script标签加入的jsonp功能
 * 注意：jsonp的实现机制与xmlHttp完全不同，仅支持get
 * 例子：
 *
 * var jsonp = require("../io/jsonp");
 *
 * jsonp({
 *     url: "/api/api.jsp",
 *     timeout: 30000, // 缺少值3秒,
 *     data: { id: 1 }, // 会转化成查询字符串追加在url的?后边
 *     callbackName: "_callback", // 回调函数的函数名
 *     onSuccess: function(jsonObject) { console.log(jsonObject); },
 *     onError: function(xmlHttp) { }, // 当访问出错，比如网络连接不上、解析内容失败时触发，超时也会触发
 *     onTimeout: function(xmlHttp) { }, // 超时触发
 *     onAbort: function() { } // 网络中断时触发
 * });
 *
 */
var merge = require("../json/merge");
var clone = require("../json/clone");
var appendQuery = require("../str/appendQuery");
var jsonToQuery = require("../json/jsonToQuery");
var uniqueKey = 0;
var uniquePrefix = "JSONP_";

module.exports = function(opts) {
    var tid = 0;

    opts = merge({
        "url": "",
        "timeout": 30 * 1000,
        "data": {},
        "callback": "callback",
        "onSuccess": function() {},
        "onError": function() {},
        "onTimeout": function() {}
    }, opts);

    var query = clone(opts.data);
    var funcName = uniquePrefix + (uniquePrefix++)
    // query[query.callback] = "mycallback"; ;
    query = jsonToQuery(query, true);
    var url = appendQuery(opts.url, query);

    window[funcName] = function(res) {
        window[funcName] = null;
        try { delete window[funcName]; } catch(ex) {}
        clearTimeout(tid);
        tag.parentNode.removeChild(tag);

        try {
            opts.onSuccess(res);
        } catch(ex) {
            console.error(ex);
        }
    }

    var tag = document.createElement("SCRIPT");
    tag.charset = "UTF-8";
    tag.type = "text/javascript";
    tag.async = true;

    tag.onerror = function() {
        window[funcName] = null;
        try { delete window[funcName]; } catch(ex) {}
        clearTimeout(tid);
        tag.parentNode.removeChild(tag);

        try {
            opts.onError();
        } catch(ex) {
            console.error(ex);
        }
    }

    tag.src = url;

    tid = setTimeout(function() {
        tid = 0;
        window[funcName] = null;
        try { delete window[funcName]; } catch(ex) {}
        tag.onerror = function() { }

        tag.parentNode.removeChild(tag);

        try {
            opts.onTimeout();
        }catch(ex) {
            console.error(ex);
        }
    }, opts.timeout);

    document.getElementsByTagName("HEAD")[0].appendChild(tag);
}