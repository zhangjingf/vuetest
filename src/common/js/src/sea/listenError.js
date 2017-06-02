/**
 * 调试用，当页面报错的时候调用showMessage显示
 * 不用了的话请删除本文件的调用，不要弄得满地都是！
 */
define(function(require, exports, module) {
    var showMessage = require("sea/showMessage");

    window.addEventListener("error", function(evt) {
        var html = [];

        html.push("文件:" + evt["filename"]);
        html.push("行:" + evt["lineno"] + ", 列:" + evt["colno"]);
        html.push("错误信息:" + evt["message"]);

        showMessage(html.join("<br/>"));
    });
});