/*******
 * 往上一层一层查找滚动节点
 * 璩：2017/9/19
 */

import getStyle from 'lib/util/getStyle'

export default function (element, root = window) {
    function find(node){
        const display = getStyle(node, "display");
        const bool = !!node.style.display;
        node.style.display = "none";
        const height = getStyle(node, "height");
        const maxHeight = getStyle(node, "maxHeight");
        const overflow = getStyle(node, "overflow");
        if(bool) node.style.display = display;
        else node.style.removeProperty("display");

        if((height !== "auto" || maxHeight !== "none") && overflow === "auto"){
            return node;
        }
        if(node === document.body){
            return root;
        } else {
            return find(node.parentNode);
        }
    }
    return find(element);
}
