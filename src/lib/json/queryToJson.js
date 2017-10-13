/**
 * 来自STK.js
 * 将查询字符串转化成json对象，是jsonToQuery的反操作
 * 例子：
 *
 * var queryToJson = require("../json/jsonToQuery");
 * var str = "id=1&name=benny";
 * var json = queryToJson(str);
 * json的值将为：
 * json = { id: 1, name: "benny" };
 *
 */
module.exports = function(qs){
    var qList = qs.toString().trim().split("&"),
        json = {},
        i = 0,
        len = qList.length;

    for (; i < len; i++) {
        if (qList[i]) {
            var hash = qList[i].split("="),
                key = hash[0],
                value = hash[1];
            // 如果只有key没有value, 那么将全部丢入一个$nullName数组中
            if (hash.length < 2) {
                value = key;
                key = '$nullName';
            }
            if (!(key in json)) {
                // 如果缓存堆栈中没有这个数据，则直接存储
                json[key] = decodeURIComponent(value);
            } else {
                // 如果堆栈中已经存在这个数据，则转换成数组存储
                json[key] = [].concat(json[key], decodeURIComponent(value));
            }
        }
    }
    return json;
}