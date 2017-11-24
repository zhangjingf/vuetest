/*****
 * 获取样式属性值
 */

export default function(element, styleName) {
    return element.style[styleName] ? element.style[styleName] : element.currentStyle ? element.currentStyle[styleName] : window.getComputedStyle(element, null)[styleName];
};