/**
 * 判断对象是否为一个节点，注意：元素、注释、文本内容都是一个node，具体请查阅DOM实现接口文档
 * 例子：
 *
 * HTML: <div id="node"></div>
 *
 * var isNode = require("../dom/isNode");
 * var node = document.getElementById("node");
 * console.log(isNode(node)); // true
 *
 */
module.exports = function(node) {
    return (typeof node !== "undefined") && Boolean(node.nodeName) && Boolean(node.nodeType);
}