/**
 * 获取节点在父节点中的位置（仅限于element）
 */
module.exports = function(element, nodeList) {
    return Array.prototype.indexOf.call((nodeList || element.parentNode.children), element);
}