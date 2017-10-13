/**
 * 判断当前节点是否匹配查询规则
 */
module.exports = function(node, selector) {
    if (node.nodeType !== 1) {
        return false;
    }
    
    var p = Element.prototype;
    var f = p.matches || p.webkitMatchesSelector || function(s) {
        return Array.from(document.querySelectorAll(s)).indexOf(this) !== -1;
    }

    return f.call(node, selector);
}