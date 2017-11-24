import matches from './matches'
import contains from './contains'
/*************
 * 向上查找某个节点
 */
export default function(node, selector, box) {
    let result = null;
    box = box || document.body;

    if (node.closest) {
        result = node.closest(selector);
        if (result === null || !contains(box, result)) {
            return null;
        }
    }

    while(node && node !== box && node.nodeType === 1) {
        if (matches(node, selector)) {
            return node;
        }

        node = node.parentNode;
    }

    return null;
}