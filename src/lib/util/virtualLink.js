/**
 * 虚拟链接，含有指定属性的节点可代替a链接
 * 需重写!
 *
 * var virtualLink = require("../util/virtualLink");
 * var link = virtualLink("data-href", container);
 * 含有data-href的即为a链接;
 * container可不传，默认为body节点，container也可传选择器，默认选择第一个含有该选择器的节点.
 *
 * 注：拨打电话的链接和a链接一样，写法是"data-href='tel:xxxx'"
 */
var touch = require("../evt/touch");
var closest = require("../dom/closest");
var isElement = require("../dom/isElement");

module.exports = function(attrName, node) {
    var attr = attrName || "data-href";
    var container = node || document.body;
    var selector = '[' + attr + "]";
    container = typeof container === "string" ? document.querySelector(container) : container;
    container = !isElement(container) ? document.body : container;

    touch.on(container, "tap", selector, function(ev) {
        var target = closest(ev.target, selector, container);
        if (!isElement(target)) return;
        var url = target.getAttribute(attr);

        if (url.indexOf("javascript:void(0)") >= 0) {
            return;
        }

        top.location.href = url;
    });
}