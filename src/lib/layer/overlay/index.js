/************
 * 遮罩层
 * 璩小孩 20170801
 */
import Vue from 'vue'
import overlay from './overlay.vue';
import { getZIndex, bind, fire } from 'lib/comp/bus'

const Overlay = Vue.extend(overlay);

const OverlayManager = {
    preventDefault (e) {
        e.preventDefault();
    },
    options: [],
    overlay: false,
    open (option) {
        if (!option || this.options.indexOf(option) !== -1) return;
        if (this.options.length === 0) {
            this.showOverlay();
        }
        option.zIndex = getZIndex();
        this.options.push(option);
        this.changeOverlayStyle();
    },
    close (option) {
        let index = this.options.indexOf(option);
        if (index === -1) return;
        Vue.nextTick(() => {
            this.options.splice(index, 1);
            if (this.options.length === 0) {
                this.closeOverlay();
            }
            this.changeOverlayStyle()
        });
    },
    showOverlay () {
        this.overlay = new Overlay().$mount(document.createElement("DIV"));
        bind(this.overlay.get("overlayClick"), this.handlerOverlayClick.bind(this));
        document.body.appendChild(this.overlay.$el);
        this.overlay.show = true;
        this.overlay.$el.addEventListener("touchmove", this.preventDefault);
    },
    closeOverlay (touchMove) {
        if (!this.overlay) return;
        this.overlay.$el.removeEventListener("touchmove", this.preventDefault);
        this.overlay.show = false;
        this.overlay = null;
    },
    changeOverlayStyle () {
        if (!this.overlay || this.options.length === 0) return;
        const option = this.options[this.options.length - 1];
        this.overlay.setStyle(option);
    },
    isTop (zIndex) {
        if (this.options.length === 0) {
            return false;
        }
        return this.overlay.zIndex > zIndex;
    },
    handlerOverlayClick () {
        if (this.options.length === 0) return;
        const option = this.options[this.options.length - 1];
        fire(option.overlayClick, option);
    }
};

export default OverlayManager;
