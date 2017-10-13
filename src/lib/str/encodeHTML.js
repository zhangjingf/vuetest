/**
 * 转义字符串使其能够安全输出到页面
 * 例子：
 *
 * var encodeHTML = require("../str/encodeHTML");
 * var str = encodeHTML("<div>text</div>"); // &lt;div&gt;text&lt;/div&gt;
 *
 */
module.exports = function(str) {
    str = str == null ? "" : str.toString();
    return str.replace(/\&/g,'&amp;').
        replace(/"/g,'&quot;').
        replace(/\</g,'&lt;').
        replace(/\>/g,'&gt;').
        replace(/\'/g,'&#39;').
        replace(/\u00A0/g,'&nbsp;').
        replace(/(\u0020|\u000B|\u2028|\u2029|\f)/g,'&#32;');
}