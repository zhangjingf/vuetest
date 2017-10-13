/**
 * cookie读写 来自STK.js
 *
 * var cookie = require("../util/cookie");
 * cookie.set("key1", "val1", {
 *     expire: 1, // 1分钟后过期
 *     path: "/",
 *     domain: "lgn.yy.com",
 *     secure: "httpOnly",
 *     encode: true // 是否要对值做escape编码
 * });
 * var val = cookie.get("key1");
 * cookie.remove("key1");
 *
 */
var merge = require("../json/merge");

module.exports = {
    set: function(sKey, sValue, oOpts){
        var arr = [];
        var d, t;
        var cfg = merge({
            'expire': null,
            'path': '/',
            'domain': null,
            'secure': null,
            'encode': true
        }, oOpts || {});

        if (cfg.encode == true) {
            sValue = escape(sValue);
        }
        arr.push(sKey + '=' + sValue);

        if (cfg.path != null) {
            arr.push('path=' + cfg.path);
        }
        if (cfg.domain != null) {
            arr.push('domain=' + cfg.domain);
        }
        if (cfg.secure != null) {
            arr.push(cfg.secure);
        }
        if (cfg.expire != null) {
            d = new Date();
            t = d.getTime() + cfg.expire * 60000;
            d.setTime(t);
            arr.push('expires=' + d.toGMTString());
        }
        document.cookie = arr.join(';');
    },
    get: function(sKey){
        sKey = sKey.replace(/([\.\[\]\$])/g, '\\\$1');
        var rep = new RegExp('(^| )' + sKey + '=([^;]*)?;', 'i');
        var co = document.cookie + ';';
        var res = co.match(rep);
        if (res) {
            return res[2] || "";
        }
        else {
            return '';
        }
    },
    remove: function(sKey, oOpts){
        oOpts = oOpts || {};
        oOpts.expire = -10;
        that.set(sKey, '', oOpts);
    }
};