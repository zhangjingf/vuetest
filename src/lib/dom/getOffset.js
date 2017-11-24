/**
 * 获取节点相对于指定的节点的位置
 * 如果没有指定节点，则返回相对于document的位置
 * 例子：
 * import getOffset from 'lib/dom/getOffset'
 * let pos = getOffset(node);
 * console.log("left:" + pos.left, "top:" + pos.top);
 */
export default function (el) {
    let box = el.getBoundingClientRect();
    let body = document.body;
    let clientTop = el.clientTop || body.clientTop || 0;
    let clientLeft = el.clientLeft || body.clientLeft || 0;
    let scrollTop = window.pageYOffset || el.scrollTop;
    let scrollLeft = window.pageXOffset || el.scrollLeft;
    return {
        top: box.top + scrollTop - clientTop,
        left: box.left + scrollLeft - clientLeft
    }
};