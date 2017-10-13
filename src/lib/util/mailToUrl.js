/**
 * 获取邮箱地址对应的登录地址，如果不认识该邮箱，则变成mail.xxx.com
 *
 * var mailToUrl = require("../util/mailToUrl");
 * var loginUrl = mailToUrl("bennyzheng@foxmail.com"); // 'http://mail.foxmail.com'
 * var unkownUrl = mailToUrl("bennyzheng@hello.com"); // 不认识的直接变成http://mail.hello.com
 */
module.exports = function(email) {
    var hash = {
        'qq.com': 'http://mail.qq.com',
        'gmail.com': 'https://mail.google.com',
        'sina.com': 'http://mail.sina.com.cn',
        '163.com': 'http://mail.163.com',
        '126.com': 'http://mail.126.com',
        'yeah.net': 'http://www.yeah.net/',
        'sohu.com': 'http://mail.sohu.com/',
        'tom.com': 'http://mail.tom.com/',
        'sogou.com': 'http://mail.sogou.com/',
        '139.com': 'http://mail.10086.cn/',
        'hotmail.com': 'http://www.hotmail.com',
        'live.com': 'http://login.live.com/',
        'live.cn': 'http://login.live.cn/',
        'live.com.cn': 'http://login.live.com.cn',
        '189.com': 'http://webmail16.189.cn/webmail/',
        'yahoo.com.cn': 'http://mail.cn.yahoo.com/',
        'yahoo.cn': 'http://mail.cn.yahoo.com/',
        'eyou.com': 'http://www.eyou.com/',
        '21cn.com': 'http://mail.21cn.com/',
        '188.com': 'http://www.188.com/',
        'foxmail.com': 'http://mail.foxmail.com'
    }

    var host = email.split("@")[1].toLowerCase();

    if (host in hash) {
        return hash[host];
    } else {
        return 'http://mail.' + host;
    }
}