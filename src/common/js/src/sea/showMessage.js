/**
 * 简易版的alert……
 */

define(function(require, exports, module) {
    var alert = require("sea/dialog/alert");
    var getType = require("lib/util/getType");

    return function(msg, callback) {
        var dialog = alert(getType(msg) == "object" ? JSON.stringify(msg) : msg);
        dialog.init();
        dialog.show();

        if (callback) {
            dialog.bind("hide", callback);
        }
    }
});