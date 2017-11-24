/******
 * 禁止滚动
 * 璩 2017/09/14
 */
import {isNode } from  'lib/util/dataType'
import contains from "lib/dom/contains"

export default function(node){
    node = isNode(node) ? node : document.body;
    let startX = 0, startY = 0, nodeList = [], box = null;

    function _bind(element){
        const list = isNode(element) ? [element] : [...element];
        list && list.forEach(n => {
            isNode(n) && nodeList.push(n);
        });
    }

    function _unbind(element){
        const list = isNode(element) ? [element] : [...element];
        list.forEach(n => {
            if(isNode(n)){
                const index = nodeList.indexOf(n);
                if(index > -1) nodeList.splice(index, 1);
            }
        });
    }

    function _touchStart(ev){
        startX = ev.changedTouches[0].pageX;
        startY = ev.changedTouches[0].pageY;
        let stop = false;
        nodeList.forEach(parent => {
            if(!stop && contains(parent, ev.target)){
                box = parent;
                stop = true;
            }
        });
        if(!stop) box = null;
    }

    function _touchMove(ev){
        ev.stopPropagation();

        if(box === null) {
            ev.preventDefault();
            return false;
        }

        let deltaX = ev.changedTouches[0].pageX - startX;
        let deltaY = ev.changedTouches[0].pageY - startY;

        // 只能纵向滚
        if(Math.abs(deltaY) < Math.abs(deltaX)){
            ev.preventDefault();
            return false;
        }

        if(box.offsetHeight + box.scrollTop >= box.scrollHeight){
            if(deltaY < 0) {
                ev.preventDefault();
                return false;
            }
        }
        if(box.scrollTop === 0){
            if(deltaY > 0) {
                ev.preventDefault();
                return false;
            }
        }
    }


    function _init(){
        node.addEventListener("touchstart", _touchStart);
        node.addEventListener("touchmove", _touchMove);
    }

    function _clear(){
        node.removeEventListener("touchstart", _touchStart);
        node.removeEventListener("touchmove", _touchMove);
    }

    return {
        bind: _bind,
        unbind: _unbind,
        start: _init,
        end: _clear
    }
}
