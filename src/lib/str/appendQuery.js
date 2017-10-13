/**
 * 将一组查询字符串智能拼到url中去
 * 增加传入一个对象的功能
 * 例子：
 *
 * var appendQuery = require("../str/appendQuery");
 * var url = appendQuery("a.html?abc=1", "a=1&b=2"); // a.html?abc=1&a=1&b=2
 * url = appendQuery("a.html", "a=1&b=2"); // a.html?a=1&b=2
 * url = appendQuery("a.html", { "a": 1, "b": 2 }); // a.html?a=1&b=2
 *
 **/
var getType = require("../util/getType");
var jsonToQuery = require("../json/jsonToQuery");

module.exports = function(url, queryString) {
    queryString = getType(queryString) == "string" ? queryString : jsonToQuery(queryString);
    return url + (url.indexOf("?") == -1 ? "?" : "&") + queryString;
}