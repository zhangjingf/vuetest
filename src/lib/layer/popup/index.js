/**
 * popup浮层
 * 璩小孩
 */

import Vue from 'vue'
import popupVue from './popup.vue'
import closest from 'lib/dom/closest'
import { bus } from 'lib/comp/bus'
import delay from 'lib/util/delay'

const _popup_queueing = [];

Vue.prototype.$message = function(fn){
    delay(() =>{
        let stop = false;
        const node = closest(this.$el, ".m-popup");
        _popup_queueing.forEach(p => {
            if(!stop && p.$el === node){
                stop = true;
                p.pushMessage(fn);
                bus.$once(p.get("destroy"), function(){
                    let _break = false;
                    _popup_queueing.forEach((p, index) => {
                        if(!_break && this === p){
                            _break = true;
                            _popup_queueing.splice(index, 1);
                        }
                    });
                }.bind(p));
            }
        });
    }, 0).defer();
};

const PopupManager = function(html, opts = {option: {}, popup: {}}){
    const Popup = Vue.extend(popupVue);
    const Content = opts.popup.components ? Vue.extend(opts.popup) : null;
    let popup = null;
    const that = {
        create () {
            popup = new Popup().$mount(document.createElement("DIV"));
            popup = Object.assign(popup, opts.option);
            popup.$refs.content.innerHTML = html;
            opts.popup.components && (popup.popup = new Content().$mount(popup.$refs.content));
        }
    };

    that.create();

    _popup_queueing.push(popup);

    return popup;
};

export default PopupManager;