/**
 * toast
 */
define(function (require, exports, module) {
    var notice = require("sea/dialog/notice");
    var getType = require("lib/util/getType");
    return function (msg, time, callback) {
        var _time = time ? time : 1000;
        var toast = notice(getType(msg) == "object" ? JSON.stringify(msg) : msg);
        toast.init();
        toast.show({
            'afterAnimate': function () {
                setTimeout(function() {
                    toast.hide();
                    callback && callback();
                }, _time);
            }
        });
    }
});