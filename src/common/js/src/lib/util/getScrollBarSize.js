/**
 * 获取滚动条高度以及宽度
 *
 * var getScrollBarSize
 */
define(function(require, exports, module) {
    var setStyle = require("../dom/setStyle");

    return function() {
        var div = document.createElement("DIV");

        setStyle(div, {
            "overflow": "scroll",
            "width": "100px",
            "height": "100px",
            "left": "-200px",
            "top": "-200px",
            "position": "absolute"
        });

        document.body.appendChild(div);

        var size = {
            h: div.offsetHeight - div.clientHeight,
            v: div.offsetWidth - div.clientWidth
        }

        document.body.removeChild(div);

        return size;
    }
});