/**
 * 为字符串加上掩码，前后保留两个可见字符，其它的都变成*
 * 例子：
 *
 * var shadow = require("../str/shadow");
 * var str = shadow("hello world"); // he*******ld
 *
 */
module.exports = function(match) {
    if (match.length == 1) {
        match = "*";
    } else if (match.length < 5) {
        match = match.split("");
        match[1] = match[match.length - 2] = "*";
        match = match.join("");
    } else {
        match = match[0] + match[1] + new Array(match.length - 3).join("*") + match[match.length - 2] + match[match.length - 1];
    }

    return match;
}