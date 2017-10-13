/**
 * 将encodeHTML转义过的字符串反转义
 * 例子：
 *
 * var decodeHTML = require("../str/decodeHTML");
 * var str = encodeHTML("&lt;div&gt;text&lt;/div&gt;"); // <div>text</div>
 *
 */
module.exports = function(str){
    str = str == null ? "" : str.toString();
    return str.replace(/&quot;/g,'"').
        replace(/&lt;/g,'<').
        replace(/&gt;/g,'>').
        replace(/&#39/g,'\'').
        replace(/&nbsp;/g,'\u00A0').
        replace(/&#32/g,'\u0020').
        replace(/&amp;/g,'\&');
};