<template>
  <transition :name="myAnimate.name"
              @before-enter="myAnimate.beforeEnter"
              @enter="myAnimate.enter"
              @leave="myAnimate.leave"
              @after-enter="afterEnter"
              @after-leave="afterLeave"
              :css="true">
    <div v-show="isShow" class="m-popup" :style="setStyle">
      <div ref="content"></div>
      <div class="progress-bar" v-if="myProgressBar.show && myProgressBar.showTime > 0">
        <div class="bar" :style="setTime" :class="control"></div>
      </div>
    </div>
  </transition>
</template>
<script>
    import OverlayManager from 'lib/layer/overlay'
    import { getUniqueId, getZIndex, fire, bind } from 'lib/comp/bus'
    import getSize from 'lib/util/getSize'
    import closest from 'lib/dom/closest'
    import delay from 'lib/util/delay'
    import stopScroll from 'lib/dom/stopScroll'

    import {isString, isNumber, isFunction, isUndefined, isObject } from  'lib/util/dataType'

    export default {
        props: {
            absolute: {
                type: Boolean,
                default: false
            },
            top: {
                type: String,
                default: "40%"
            },
            left: {
                type: String,
                default: "20%"
            },
            right: {
                type: String,
                default: "auto"
            },
            bottom: {
                type: String,
                default: "auto"
            },
            width: {
                type: String,
                default: "auto"
            },
            height: {
                type: String,
                default: "auto"
            },
            progressBar: {
                type: Object,
                default () {
                    return {}
                }
            },
            overlay: {
                type: Object,
                default () {
                    return {}
                }
            },
            escHide: {
                type: Boolean,
                default: false
            },
            autoHide: {
                type: Boolean,
                default: false
            },
            showCenter: {// 显示的时候保持居中
                type: Boolean,
                default: false
            },
            animate: {
                type: Object,
                default () {
                    return {}
                }
            }
        },
        mounted () {
            this.showPromise = new Promise((resolve) => {
                this.$nextTick(() => {
                    this.myOverlay = Object.assign(this.myOverlay, this.overlay, {overlayClick: this.get("overlayClick")});
                    this.myProgressBar = Object.assign(this.myProgressBar, this.progressBar);
                    this.myAnimate = Object.assign(this.myAnimate, this.animate);
                    this.stopScroll.bind(this.$el.querySelectorAll("[data-bind-scroll]"));
                    resolve();
                });
            });
        },
        data () {
            return {
                zIndex: getZIndex(),
                isShow: false,
                status: false,
                showFinish: null,
                control: '',
                delay: delay(),
                stopScroll: stopScroll(this.$el),
                showPromise: null,
                hidePromise: null,
                animateShowResolve: null,
                animateHideResolve: null,
                myAnimate: {
                    name: "scale",
                    beforeEnter (){},
                    enter (){},
                    leave (){},
                    custom: false
                },
                myOverlay: {
                    show: true,
                    color: '',
                    opacity: ''
                },
                myProgressBar: {
                    show: false,
                    color: '#6AEE00',
                    opacity: 1,
                    showTime: 0//默认显示时间0秒,不自动关闭
                },
                fire: {},
                child: []
            }
        },
        computed: {
            setStyle () {
                return {
                    'position': this.absolute ? 'absolute' : '',
                    'left': this.left,
                    'top': this.top,
                    'right': this.right,
                    'bottom': this.bottom,
                    'width': this.width,
                    'height': this.height,
                    'z-index': this.zIndex
                }
            },
            setTime () {
                return {
                    'transition': `all ${this.myProgressBar.showTime}s linear`,
                    'background': this.myProgressBar.color
                }
            }
        },
        methods: {
            addUnit (value){
                return /\d$/.test(value) ? value + "px" : value;
            },
            bindEvent () {
                this.delay.append(self => {
                    self.autoHide && window.addEventListener('click', self.autoClickHide);
                    self.escHide && window.addEventListener("keyup", self.escPress);
                    this.stopScroll.start();
                }, 10, this);
            },
            unbindEvent () {
                this.autoHide && window.removeEventListener('click', this.autoClickHide);
                this.escHide && window.removeEventListener("keyup", this.escPress);
                this.stopScroll.end();
            },
            autoClickHide (evt) {
                if(OverlayManager.isTop(this.zIndex)){
                    return;
                }
                const node = closest(evt.target, ".m-popup");
                if(node === this.$el) return;
                this.hide(null, "auto");
            },
            escPress (ev) {
                if (ev.keyCode === 27) { // ESC
                    this.hide(null, "esc");
                }
            },
            afterEnter () {
                this.animateShowResolve();
            },
            afterLeave () {
                this.animateHideResolve();
            },
            useProgress () {
                if (this.myProgressBar.showTime > 0) {
                    if (this.myProgressBar.show) {
                        this.delay.append(self => {
                            self.control = "progress-leave";
                        }, 30, this);
                    }
                    this.delay.append((self, state) => {
                        self.hide(null, state);
                    }, this.myProgressBar.showTime * 1000, this, "time");
                }
            },
            initProgress () {
                this.myProgressBar.show && (this.control = "");
            },
            get (key) {
                if(this.fire[key]){
                    return this.fire[key];
                }else{
                    this.fire[key] = getUniqueId();
                }
                return this.fire[key];
            },
            pushMessage (fn) {
                isFunction(fn) && this.child.push(fn);
            },
            postMessage (option){//通讯模块
                this.child.forEach(fn => fn(option));
            },
            setTop () {
                this.zIndex = getZIndex();
            },
            setMiddle (left, top) {
                const screenWidth = window.innerWidth;
                const screenHeight = window.innerHeight;
                const size = getSize(this.$el);
                const format = function(total, value){
                    if(/^\d+$/.test(parseInt(value))){
                        if(/%$/.test(value)) {
                            return total * parseInt(value) / 100;
                        }else{
                            return parseInt(value);
                        }
                    }
                    return value;
                };
                const x = (isNumber(left) || isString(left) ? format(screenWidth, left) : (screenWidth - size.width) / 2);
                const y = (isNumber(top) || isString(top) ? format(screenHeight, top) : (screenHeight - size.height) / 2);
                this.setPosition(x, y);
            },
            setFullScreen (horizontal = false, vertical = false) {
                if(horizontal){
                    this.width = this.addUnit(window.innerWidth);
                }else{
                    this.width = "auto";
                }
                if(vertical){
                    this.height = this.addUnit(window.innerHeight);
                }else{
                    this.height = "auto";
                }
            },
            setPosition (left, top, right, bottom){
                !isUndefined(left) && (this.left = this.addUnit(left));
                !isUndefined(top) && (this.top = this.addUnit(top));
                !isUndefined(right) && (this.right = this.addUnit(right));
                !isUndefined(bottom) && (this.bottom = this.addUnit(bottom));
            },
            setLayout (left, top, right, bottom) {
                this.showCenter && this.setMiddle(left, top);
                !this.showCenter && this.setPosition(left, top, right, bottom);
            },
            getStatus () {
                return this.status;
            },
            destroy () {
                fire(this.get("destroy"), {type: "destroy"});
                this.$destroy();
            },
            show (left, top, right, bottom, callback) {
                if(this.getStatus()) {
                    this.setLayout(left, top, right, bottom);
                    return;
                }
                this.status = true;
                this.showPromise.then(() => {
                    document.body.appendChild(this.$el);
                    this.delay.append(self => {
                        self.setLayout(left, top, right, bottom);
                    }, 10, this).append(self => {
                        self.isShow = true;
                        self.bindEvent();
                        if(self.myOverlay.show){
                            OverlayManager.open(self.myOverlay);
                            self.setTop();
                        }
                        self.useProgress();
                    }, 30, this);
                });

                new Promise((resolve) => {
                    this.animateShowResolve = resolve;
                }).then(() => {
                    fire(this.get("show"), {type: "show"});
                    isFunction(callback) && callback();
                    this.animateShowResolve = null;
                    if(isObject(this.showFinish)) {
                        const callback = this.showFinish.callback;
                        const state = this.showFinish.state;
                        this.showFinish = true;
                        this.hide(callback, state);
                    }else this.showFinish = true;
                });

                this.hidePromise = new Promise(resolve => {
                    this.animateHideResolve = resolve;
                });
            },
            hide (callback, state) {
                if(this.getStatus() && !this.showFinish){
                    this.showFinish = {callback: callback, state: state};
                }
                if(!this.isShow || isObject(this.showFinish)) return;
                this.isShow = false;
                this.delay.cancel();
                this.unbindEvent();
                this.hidePromise.then(() => {
                    fire(this.get("hide"), {type: "hide", state: state || "close"});
                    isFunction(callback) && callback();
                    this.initProgress();
                    document.body.removeChild(this.$el);
                    this.status = this.isShow;
                    this.myOverlay.show && OverlayManager.close(this.myOverlay);
                    this.animateHideResolve = null;
                    this.showFinish = null;
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
  .m-popup {
    position: fixed;
    left: 0;
    top: 0;
  }
  .slide-enter-active,.slide-leave-active,
  .slide-left-enter-active,.slide-left-leave-active,
  .slide-top-enter-active,.slide-top-leave-active,
  .slide-right-enter-active,.slide-right-leave-active,
  .slide-bottom-enter-active,.slide-bottom-leave-active,
  .fade-enter-active,.fade-leave-active,
  .scale-enter-active,.scale-leave-active{
    transition: all .3s linear;
  }
  .scale-enter,.scale-leave-to {
    transform: scale(0.5) !important;
    opacity: 0.5 !important;
  }
  .fade-enter,.fade-leave-to {
    opacity: 0 !important;
  }
  .slide-enter {
    transform: translateY(-100%) !important;
    opacity: 0 !important;
  }
  .slide-leave-to {
    transform: translateY(100%) !important;
    opacity: 0 !important;
  }
  .slide-left-enter,.slide-left-leave-to {
    transform: translateX(-200%) !important;
  }
  .slide-top-enter,.slide-top-leave-to {
    transform: translateY(-200%) !important;
  }
  .slide-right-enter,.slide-right-leave-to {
    transform: translateX(200%) !important;
  }
  .slide-bottom-enter,.slide-bottom-leave-to {
    transform: translateY(200%) !important;
  }

  .progress-bar {
    width: 100%;
    height: 2px;
    z-index: 1000;
    position: absolute;
    top: 0;
    left: 0;
    overflow: hidden;
    .bar{
      width: 100%;
      background: #000;
      height: 2px;
      transform: translateZ(0);
      &.progress-leave {
        transform: translate3d(-100%, 0, 0);
      }
    }
  }


</style>
