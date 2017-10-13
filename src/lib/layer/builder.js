/**
 * @author benny.zheng
 * @data 2016-06-10
 * @description 浮层的基本对象
 */
//----------------require--------------

var viewport = require("../../vlib/comp/viewport"); // viewport
var base = require("../comp/base"); // 基础对象
var parseModule = require("../dom/parseModule"); // 页面模块自动解析
var getType = require("../util/getType");
var merge = require("../json/merge");
var insertHTML = require("../dom/insertHTML");
var clone = require("../json/clone");

var buildHTML = function(html) {
    var panel = document.createElement("div");
    panel.innerHTML = html;
    return panel.firstElementChild;
}

var disableEvent = function(event) {
    event.preventDefault();
}

var zIndex = 10000;

var _exports = module.exports = {
    "createFromHTML": function(html, opts) {
        //-----------声明模块全局变量-------------
        var that = base();
        var node = buildHTML(html);
        var mask = null;
        node.style.position = "absolute";
        opts = merge({
            "keepMiddle": false, // 是否在调用show的时候自动居中
            "middleFix": .25, // 设置居中的时候距离顶部的百分比，还可以取值为0表示完全居中
            "mask": true, // 设置是否需要遮罩层
            "maskOpacity": 0.3, // 遮罩层的透明度
            "lockScroll": true // 是否禁用页面滚动
        }, opts || {});

        //-------------自定义函数----------------
        var custFuncs = {
            trigger: function(why){//触发按钮
                var ev = {
                    why: why || "trigger",
                    close: custFuncs.hide
                };
                that.fire("trigger", clone(ev));
            },
            /**
             * 显示浮层
             * @param  {object} handlers 允许定义beforeAppend、beforeAnimate、afterAnimate
             *                           beforeAppend: 节点被添加到文档流之前
             *                           beforeAnimate: 节点被添加到文档之后，开始显示动画之前
             *                           afterAnimate: 显示动画之后
             */
            show: function(handlers) {
                if (custFuncs.getStatus()) {
                    return;
                }

                if (opts["mask"]) {
                    mask = mask || _exports.createMask(opts["maskOpacity"]);
                    mask.show();
                }

                handlers = handlers || {};
                that.fire("beforeshow");

                handlers.beforeAppend && handlers.beforeAppend();
                document.body.appendChild(node);
                that.setTop();
                handlers.beforeAnimate && handlers.beforeAnimate();

                var aniHandler = function() {
                    handlers.afterAnimate && handlers.afterAnimate();
                    that.fire("aftershow");

                    if (opts["keepMiddle"]) {
                        that.setMiddle();
                    }

                    if (opts["mask"]) {
                        custFuncs.setTop();
                    }
                }

                if (opts.showAnimate) {
                    opts.showAnimate(that, aniHandler);
                } else {
                    aniHandler();
                }

                if(opts.lockScroll){
					window.addEventListener("touchmove", disableEvent);
				}

                that.fire("show");
            },
            /**
             * 隐藏弹层
             * @param  {string} why     隐藏的原因，默认为hide
             * @param  {object} extra   隐藏时往beforehide/afterhide传递的数据
             * @param  {object} handlers 允许定义beforeAnimate、afterAnimate、afterRemove
             *                           beforeAnimate: 执行隐藏动画之前
             *                           afterAnimate: 执行隐藏动画之后，从文档流移除之前
             *                           afterRemove: 从文档流移除之后
             */
            hide: function(why, extra, handlers) {
                if (!custFuncs.getStatus()) {
                    return;
                }

                handlers = handlers || {};

                var ev = {
                    why: why || "hide",
                    extra: extra || {}
                }

                that.fire("beforehide", clone(ev));
                handlers.beforeAnimate && handlers.beforeAnimate();

                var aniHandler = function() {
                    handlers.afterAnimate && handlers.afterAnimate();
                    document.body.removeChild(node);
                    handlers.afterRemove && handlers.afterRemove();
                    that.fire("afterhide", clone(ev));

                    if (opts["mask"]) {
                        mask.hide();
                    }
                }

                if (opts.hideAnimate) {
                    opts.hideAnimate(that, aniHandler);
                } else {
                    aniHandler();
                }

                if(opts.lockScroll){
					window.removeEventListener("touchmove", disableEvent);
				}

                that.fire("hide", clone(ev));
            },
            /**
             * 获取容器节点
             * @return {element} 节点
             */
            getOuter: function() {
                return node;
            },
            /**
             * 设置弹层为全屏
             */
            fullscreen: function() {
                if (!custFuncs.getStatus()) {
                    return;
                }

                that.fire("beforefullscreen");
                node.style.position = "fixed";
                node.style.top = 0;
                node.style.right = 0;
                node.style.bottom = 0;
                node.style.top = 0;
                that.fire("afterfullscreen");
            },
            /**
             * 设置弹层为居中
             */
            setMiddle: function() {
                if (!custFuncs.getStatus()) {
                    return;
                }

                that.fire("beforemiddle");

                var de = document.documentElement;
                var body = document.body;
                var size = { width: de.clientWidth, height: de.clientHeight };
                var scroll = { left: body.scrollLeft, top: body.scrollTop };
                var left = (size.width - node.offsetWidth) / 2 + scroll.left;
                var top = (size.height - node.offsetHeight) / 2 + scroll.top;

                if ((opts["middleFix"] != 0)) {
                    var testTop = Math.floor(size.height * .25);

                    if ((testTop * 2 + node.offsetHeight) <= size.height) {
                        top = testTop + scroll.top;
                    }
                }

                left = left < 0 ? 0 : left;
                top = top < 0 ? 0 : top;
                console.log("宽度",node.offsetWidth);

                node.style.position = "absolute";
                node.style.top = top + "px";
                node.style.left = left + "px";
                that.fire("aftermiddle");
            },
            /**
             * 设置弹层是否保持居中状态
             * @param  {Boolean} isKeep 弹层是否为居中状态
             */
            keepMiddle: function(isKeep) {
                isKeep = isKeep === false ? false : true;

                if (opts["keepMiddle"] == isKeep) {
                    return;
                }

                opts["keepMiddle"] = isKeep;

                if (that.getStatus() && opts["keepMiddle"]) {
                    that.setMiddle();
                }
            },
            /**
             * 要求弹层马上变成最上层的元素
             */
            setTop: function() {
                if (!custFuncs.getStatus()) return;
                node.style.zIndex = _exports.newZIndex();
            },
            /**
             * 获取弹层是否处于就绪状态
             * @return {boolean} 是否处于就绪状态
             */
            getStatus: function() {
                return node.parentNode === document.body;
            },
            /**
             * 设置浮层的位置
             * @param {number} left 相当原来的x轴，不设置则传null
             * @param {number} top  相当原来的y轴，不设置则传null
             * @param {number} right，不设置则传null
             * @param {number} bottom，不设置则传null
             */
            setPosition: function(left, top, right, bottom) {
                if (left) { node.style.left = left; }
                if (top) { node.style.top = top; }
                if (right) { node.style.right = right; }
                if (bottom) { node.style.bottom = bottom; }
            },
            /**
             * 获取遮罩层
             */
            getMask: function() {
                return mask;
            }
        }

        //---------------暴露API----------------
        that.show = custFuncs.show;
        that.hide = custFuncs.hide;
        that.trigger = custFuncs.trigger;
        that.getOuter = custFuncs.getOuter;
        that.fullscreen = custFuncs.fullscreen;
        that.setMiddle = custFuncs.setMiddle;
        that.keepMiddle = custFuncs.keepMiddle;
        that.setTop = custFuncs.setTop;
        that.getStatus = custFuncs.getStatus;
        that.setPosition = custFuncs.setPosition;
        that.getMask = custFuncs.getMask;

        return that;
    },
    "createMask": function(opacity) {
        var that = {};
        node = document.createElement("div");
        node.style.position = "absolute";
        node.style.left = 0;
        node.style.right = 0;
        node.style.top = 0;
        node.style.bottom = 0;
        node.style.backgroundColor = "rgba(0,0,0," + (opacity || 0.3) + ")";

        var custFuncs = {
            "show": function() {
                if (node.parentNode == document.body)  return;
                document.body.appendChild(node);
                node.style.zIndex = _exports.newZIndex();
            },
            "hide": function() {
                if (!node) return;
                node.parentNode.removeChild(node);
            },
            "getOuter": function() {
                return node;
            }
        }

        that.show = custFuncs.show;
        that.hide = custFuncs.hide;
        that.getOuter = custFuncs.getOuter;

        return that;
    },
    "newZIndex": function() {
        return zIndex++;
    }
};