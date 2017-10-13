/**
 * 将一个Image对象按比例转成dataUrl，默认比例为1:1
 */
var getType = require("../util/getType");
var merge = require("../json/merge");

module.exports = function(image, opts) {
    opts = merge({
        "sourceWidth": image.width, // 源图片默认宽度
        "sourceHeight": image.height, // 源图片默认高度
        "destWidth": image.width, // 目标图片宽度，默认原宽度
        "destHeight": image.height, // 目标图片高度，默认原高度
        "scale": 1, // 质量损失比例，默认不压缩
        "type": "image/jpeg" // 输出类型：image/jpeg | image/png | image/gif
    }, opts || {});

    var canvas = document.createElement("canvas");
    canvas.width = opts["destWidth"];
    canvas.height = opts["destHeight"];
    var context = canvas.getContext("2d");
    context.drawImage(image, 0, 0, opts["sourceWidth"], opts["sourceHeight"], 0, 0, opts["destWidth"], opts["destHeight"]);
    return canvas.toDataURL("image/jpeg", opts["scale"]);
}