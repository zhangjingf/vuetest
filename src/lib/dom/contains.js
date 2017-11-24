/**
 * 判断节点是否为另一个节点的父元素（如果两者是同一个元素，返回假）
 * 例子：
 * import contains from 'lib/dom/contains';
 * console.log(contains(parentNode, node));
 **/
export default function(parent, node) {
    if (parent === node) {
        return false;
    } else if (parent.compareDocumentPosition) {
        return ((parent.compareDocumentPosition(node) & 16) === 16);
    } else if (parent.contains && node.nodeType === 1) {
        return parent.contains(node);
    } else {
        while (node = node.parentNode) {
            if (parent === node) {
                return true;
            }
        }
    }

    return false;
}