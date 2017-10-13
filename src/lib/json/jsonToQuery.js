/**
 * 来自STK.js
 * 将json转化成查询字符串，第二个参数如果设置为true，则对值做encodeURIComponent编码
 * 例子：
 *
 * var jsonToQuery = require("../json/jsonToQuery");
 * var json = { id: 1, name: "benny" };
 * var query = jsonToQuery(json, true); // 生成一个字符串"id=1&name=benny"
 *
 */
var format = function(val) {
    val = val == null ? "" : val.toString().trim();
    return encodeURIComponent(val);
}

module.exports = function(json) {
    var query = [];

    if(typeof json == "object"){
        for(var k in json){
            if(k === '$nullName'){
                query = query.concat(json[k]);
                continue;
            }
            if(json[k] instanceof Array){
                for(var i = 0, len = json[k].length; i < len; i++){
                    query.push(k + "=" + format(json[k][i]));
                }
            }else{
                if(typeof json[k] != 'function'){
                    query.push(k + "=" +format(json[k]));
                }
            }
        }
    }

    if(query.length){
        return query.join("&");
    }else{
        return "";
    }
}