/**
 * 延时动画管理
 * by:璩 2017/9/7
 */
import {isObject, isFunction, isBoolean, isNumber} from './dataType'

export default function(fnc, duration, options){

    let worker = [],
        timer = [],
        timerId = null,
        loop = false,
        defaultThis = null,
        defaultArgs = [],
        interval = +duration || 10,
        easing = function(p){return p};

    if (isObject(options)) {
        loop = isBoolean(options.loop) ? options.loop : loop;
        interval = isNumber(options.interval) ? +options.interval : interval;
        easing = isFunction(options.easing)  ? options.easing : easing;
    }

    const requestAniFrame = (window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || _delay);

    function _delay(func, wait, args) {
        return setTimeout(func.bind(defaultThis), +wait || 1000 / 60, ...args)
    }

    function _run(){
        if(loop){
            if(timer.length > 0) return;
            timer.push(setInterval(() => {
                worker.forEach(res => {
                    if(!res.stop && Date.now() - res.now >= res.time){
                        res.fn.apply(defaultThis, res.args);
                        res.stop = true;
                    }
                });
                _clear();
                (worker.length === 0) && _cancel();
            }, interval));
        }else{
            worker.forEach(res => {
                if(!res.stop) {
                    timer.push(_delay(res.fn, res.time, res.args));
                    res.stop = true;
                }
            });
            _clear();
        }
    }

    function _clear(){
        let count = 0;
        worker.forEach((item, index) => {
            item.stop && worker.splice(index - count++, 1);
        });
    }

    function _cancel(){
        if(timer.length > 0){
            timer.forEach(id => (loop ? clearInterval(id) : clearTimeout(id)));
            worker = [];
            timer = [];
        }
        if(timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    return {
        bind (self, ...args){
            defaultThis = self;
            defaultArgs = args;
            return this;
        },
        ani (finished) {
            let startTime = Date.now();
            requestAniFrame(function step(){
                let p = (Date.now() - startTime) / duration;
                let next =  true;
                if(p < 1){
                    fnc.apply(defaultThis, [easing(p), p, ...defaultArgs]);
                }else{
                    if(isFunction(finished)){
                        next = finished() === false;
                    }else{
                        next = finished === false;
                    }

                    if(!next){
                        fnc.apply(defaultThis, [easing(1), 1, ...defaultArgs]);
                    }else{
                        startTime += duration;
                        fnc.apply(defaultThis, [easing(p), p, ...defaultArgs]);
                    }
                }

                if(next) requestAniFrame(step);
            });
            return this;
        },
        run (...args) {
            if(timerId !== null) return this;
            timerId = setInterval(() => {
                fnc.apply(defaultThis, args.length === 0 ? defaultArgs : args);
            }, interval);
            return this;
        },
        defer (...args) {
            timer.push(_delay(fnc, duration, args));
            return this;
        },
        cancel () {
            _cancel();
            return this;
        },
        flush () {
            const all = worker;
            this.cancel();
            all.forEach(res => {
                if(Date.now() - res.now <= res.time){
                    res.fn.apply(null, res.args);
                }
            });
            return this;
        },
        append (fn, time, ...args) {
            worker.push({fn: fn || fnc, args: args.length === 0 ? defaultArgs : args, time: +time || duration, now: Date.now()});
            _run();
            return this;
        }
    };
}