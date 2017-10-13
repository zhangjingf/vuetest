/**
 * URL的解析和合成，注意：该设计有缺陷，不支持username:userpass，不过一般都用不上
 *
 * var URL = require("../util/URL");
 * var urlObj = URL.parse("http://www.baidu.com:8080/index.html?p=1#link1");
 * 得到：
 * {
 *     hash: "link1",
 *     host: "www.baidu.com",
 *     path: "/index.html",
 *     port: "8080",
 *     query: "p=1",
 *     scheme: "http:",
 *     slash: "//",
 *     url: "http://www.baidu.com:8080/index.html?p=1#link1"
 * }
 */
var link = null;
var merge = require("../json/merge");
var isEmpty = require("../str/isEmpty");
var queryToJson = require("../json/queryToJson");
module.exports = {
    parse: function(url) {

        link = link || document.createElement("A");
        link.href = url;

        var result = {
            "url": url,
            "scheme": link.protocol,
            "host": link.host,
            "port": link.port,
            "path": link.pathname,
            "query": isEmpty(link.search) ? "" : link.search.substr(1),
            "hash": isEmpty(link.hash) ? "" : link.hash.substr(1)
        }

        result["queryJson"] = queryToJson(result["query"]);
        result["hashJson"] = queryToJson(result["hash"]);
        return result;

        // var parse_url = /^(?:([A-Za-z]+:)(\/{0,3}))?([0-9.\-A-Za-z]+\.[0-9A-Za-z]+)?(?::(\d+))?(?:(\.?[\.\/]*\/[^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
        // var names = ['url', 'scheme', 'slash', 'host', 'port', 'path', 'query', 'hash'];
        // var results = parse_url.exec(url);
        // var ret = {};

        // for (var i = 0, len = names.length; i < len; i += 1) {
        //     ret[names[i]] = results[i] || '';
        // }

        // return ret;
    },
    build: function(url) {
        return url.scheme + "//" + url.host + (url.port != "" ? ":" + url.port : "") + url.path + (url.query != "" ? "?" + url.query : "") + (url.hash != "" ? "#" + url.hash : "");
    }
}