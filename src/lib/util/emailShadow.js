/**
 * 为邮箱地址加上掩码
 * 例子：
 *
 * var shadow = require("../util/emailShadow");
 * var email = "bennyzheng@foxmail.com";
 * console.log(shadow(email)); // be******ng@foxmail.com
 *
 */
var shadow = require("../str/shadow");

module.exports = function(email) {
    var match = email.match(/^.+(?:@)/)[0];
    match = match.substr(0, match.length - 1).split("");
    match = shadow(match);
    match += email.substr(email.indexOf('@'));
    return match;
}