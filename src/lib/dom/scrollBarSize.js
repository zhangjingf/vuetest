/**
 * 获取滚动条宽高
 */
module.exports = function() {
    var div = document.createElement("DIV");
    var _s = div.style;
    _s.overflow = "scroll";
    _s.width = "100px";
    _s.height = "100px";
    _s.left = "-200px";
    _s.top = "-200px";
    _s.position = "absolute";

    document.body.appendChild(div);

    var size = {
        h: div.offsetHeight - div.clientHeight,
        v: div.offsetWidth - div.clientWidth
    };

    document.body.removeChild(div);

    return size;
};