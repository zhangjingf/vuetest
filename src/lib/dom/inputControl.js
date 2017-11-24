/**
 * 对安卓手机键盘弹出会把页面顶上去的问题做兼容处理
 * 璩：2017-09-13
 */
import getOffset from './getOffset'
import closest from './closest'
import viewport from 'lib/comp/viewport'

const inputControl = function(element, isAll){

    if(!isAll && viewport.isIPhone){
        return {add: function(){}, remove: function(){}};
    }

    let events = [],
        tid = null,
        count = 0,
        node = null,
        curEl = null,
        run = false,
        stop = false;
    const screen = window.innerHeight;
    let data = {
        result: 0,
        mod: 0,
        startY: 0,
        moveY: 0
    };

    function start(el){
        let height = window.innerHeight;
        if(node === null){
            node = closest(el, element || ".m-popup");
            if(!node){
                end();
                stop = true;
                return;
            }
            node.addEventListener("touchstart", _touchStart);
            node.addEventListener("touchmove", _touchMove);
            node.addEventListener("touchend", _touchEnd);
        }
        if(screen !== height && !run){
            if(data.moveY === 0){
                _reset();
                data.result = screen - height;
                const pos = getOffset(el);
                if(!node.style.transform){
                    data.result = Math.min(data.result, screen - data.result - pos.top - 30);
                }else{
                    data.result = Math.min(data.result, screen - pos.top - 30);
                }
                node.style.transform = "translateY(" + data.result + "px)";
            }
            run = true;
        }else if(screen === height && run){
            node.style.removeProperty("transform");
            run = false;
            _reset();
        }
        count++;
        if(count > 100 && !run){
            end();
        }
    }

    function end() {
        clearInterval(tid);
        tid = null;
        count = 0;
        curEl = null;
        run = false;
        _reset();
        if(stop){
            document.body.removeEventListener("click", _inputSet);
            events = [];
        }
    }

    function _reset(){
        data = {
            result: 0,
            mod: 0,
            startY: 0,
            moveY: 0
        };
    }

    function _inputSet(ev) {
        const target = ev.target;
        if("input,textarea".includes(target.nodeName.toLowerCase())){
            if(events.indexOf(target) > -1){
                if(tid === null){
                    tid = setInterval(start, 10, target);
                }else if(curEl !== target){
                    count = 0;
                    run = false;
                }
                curEl = target;
            }
        }else if(tid !== null && run){
            node.style.removeProperty("transform");
            end();
        }
    }

    function _touchStart(evt){
        data.startY = evt.touches[0].clientY;
    }

    function _touchMove(evt){
        if(run){
            data.moveY = data.mod + evt.touches[0].clientY - data.startY;
            node.style.transform = "translateY(" + (data.result + data.moveY) + "px)";
        }
        evt.preventDefault();
    }

    function _touchEnd(){
        data.mod = data.moveY;
    }

    document.body.addEventListener("click", _inputSet);

    return {
        add (el) {
            !stop && events.push(el);
        },
        remove (el) {
            if(stop) return;
            const index = events.indexOf(el);
            if(index > -1){
                events.splice(index, 1);
            }
        }
    }
};

export default inputControl;
