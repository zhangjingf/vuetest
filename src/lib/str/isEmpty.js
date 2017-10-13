/**
 * 检查字符串是否为空
 *
 * var isEmpty = require("../str/isEmpty");
 * console.log(isEmpty(null)); // true
 * console.log(isEmpty(" ")); // true
 *
 */
module.exports = function(str) {
    str = str || '';
    return str.trim().length == 0;
}