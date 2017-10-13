/**
 * 实现image预加载功能
 * 例子：
 * var loader = require("../io/imageLoader");
 * var console = require("../io/console");
 *
 * loader("/xxx/xxx.png", function(image) {
 *     if (image == null) {
 *         console.log("加载失败")
 *     } else {
 *         console.log("已经加载成功");
 *         window.body.appendChild(image);
 *     }
 * });
 */
module.exports = function(url, callback) {
    var img = new Image();
    img.src = url;

    if (img.complete) {
        callback(img);
    } else {
        img.onload = function() {
            img.onload = null;
            img.onerror = null;
            callback(img);
        };

        img.onerror = function() {
            img.onload = null;
            img.onerror = null;
            callback(null);
        };
    }
}