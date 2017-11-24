/**
 * 获取节点动画结束后回调
 * 例子：
 * import transitionEnd from 'lib/dom/transitionEnd'
 * transitionEnd(document.body, function(arg){});
 */
export default function (el, fun) {
    let arr = ['msTransitionEnd', 'mozTransitionEnd', 'oTransitionEnd', 'webkitTransitionEnd', 'transitionend'];
    let handler = {
        handleEvent (event) {
            arr.forEach(function (eventName) {
                el.removeEventListener(eventName, handler, false)
            });
            fun.apply(el, arguments)
        }
    }
    arr.forEach(function (eventName) {
        el.addEventListener(eventName, handler, false)
    })
};