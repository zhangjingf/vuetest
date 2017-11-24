/**
 * 判断当前节点是否匹配查询规则
 */
export default function(node, selector) {
    if (node.nodeType !== 1) {
        return false;
    }
    
    let p = Element.prototype;
    let fn = p.matches || p.webkitMatchesSelector || function(s) {
        return Array.from(document.querySelectorAll(s)).indexOf(this) !== -1;
    }

    return fn.call(node, selector);
}