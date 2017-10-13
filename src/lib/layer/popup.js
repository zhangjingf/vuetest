/**
 * popup浮层
 *
 * option:
 *     autoHide: false 当屏幕其它位置获得焦点是否自动显示。当设置为true时，如果是由click触发的弹层，
 *               则需要在click响应函数中调用lib/evt/stop，否则浮层马上又被关闭
 *     autoDirection: false 是否根据基准点决定显示位置，当设置为false的时候，则将基准点当成layer的左上角
 *     direction: "right bottom" 当autoDirection启用时，popup浮层不再将基准点当成左上角，
 *                而是根据设置的方向优先级决定显示区域，如果该区域显示不下，则再根据优先级显示在下一个位置
 *                取left/right以及top/bottom中各一个，如果所有位置都放置不下，则固定放在left top，以防止出滚动条
 */
var _exports = module.exports = function(html, opts) {
    var merge = require("../json/merge");
    var builder = require("./builder");
    var getPosition = require("../dom/getPosition");
    var scrollBarSize = require("../dom/scrollBarSize");
    var parseModule = require("../dom/parseModule");
    var touch = require("../evt/touch");
    opts = merge({
        autoHide: false,
        autoDirection: false,
        direction: "right bottom",
        mask: false,
        keepMiddle: false
    }, opts || {});

    var that = builder.createFromHTML(html, opts);
    var node = that.getOuter();
    var nodeList = parseModule(node);
    var autoHide = opts.autoHide;
    var autoHideBind = false;
    var direction = { h: "right", v: "bottom"};
    direction.h = opts.direction.toLowerCase().indexOf("left") == -1 ? "right" : "left";
    direction.v = opts.direction.toLowerCase().indexOf("top") == -1 ? "bottom" : "top";
    var superMethod = { show: that.show, hide: that.hide };

    var evtFuncs = {
        "autoHideClick": function() {
            that.hide();
        },
        "stopNodeAutoHide": function(ev) {
            (ev.stopPropagation || ev.originEvent.stopPropagation)();
        }
    }

    var custFuncs = {
        /**
         * 基于x,y为基准点显示浮层
         * @param  {string} x             0px 基准点的x轴座标
         * @param  {string} y             0px 基准点的y轴座标
         * @param  {object} handlers 允许定义beforeAppend、beforeAnimate、afterAnimate
         *                           beforeAppend: 节点被添加到文档流之前
         *                           beforeAnimate: 节点被添加到文档之后，开始显示动画之前
         *                           afterAnimate: 显示动画之后
         */
        "show": function(x, y, handlers) {
            handlers = handlers || {};

            superMethod.show.call(that, {
                beforeAppend: function() {
                    handlers.beforeAppend && handlers.beforeAppend();
                    // 先隐藏掉，准备计算它的显示位置
                    node.style.visibility = "hidden";
                },
                beforeAnimate: function() {
                    if (opts.autoDirection) {
                        that.setPosition("0px", "0px");

                        var nodeSize = {
                            width: node.offsetWidth,
                            height: node.offsetHeight
                        }

                        var clientSize = { width: de.clientWidth, height: de.clientHeight };
                        var scroll = { left: body.scrollTop, top: body.scrollTop };
                        var dir = clone(direction);
                        that.setPosition(x + "px", y + "px");
                        var barSize = scrollBarSize();
                        var pos = getPosition(node);
                        var params = {
                            x: pos.left,
                            y: pos.top,
                            clientWidth: clientSize.width,
                            clientHeight: clientSize.height,
                            nodeWidth: nodeSize.width,
                            nodeHeight: nodeSize.height,
                            scrollLeft: scroll.left,
                            scrollTop: scroll.top,
                            barH: barSize.h,
                            barV: barSize.v
                        }

                        if (dir.h == "left") {
                            dir.h = custFuncs.checkLeft(params) ? "left" : "right";

                            if (dir.h == "right") {
                                dir.h = custFuncs.checkRight(params) ? "right" : "left";
                            }
                        } else {
                            dir.h = custFuncs.checkRight(params) ? "right" : "left";
                        }

                        if (dir.v == "top") {
                            dir.v = custFuncs.checkTop(params) ? "top" : "bottom";

                            if (dir.v == "bottom") {
                                dir.v = custFuncs.checkBottom(params) ? "bottom" : "top";
                            }
                        } else {
                            dir.v = custFuncs.checkBottom(params) ? "bottom" : "top";
                        }

                        var left = dir.h == "left" ? params.x - params.nodeWidth : params.x;
                        var top = dir.v == "top" ? params.y - params.nodeHeight : params.y;
                        that.setPosition(left + "px", top + "px");
                    } else {
                        that.setPosition(x + "px", y + "px");
                    }

                    node.style.visibility = "visible";
                    handlers.beforeAnimate && handlers.beforeAnimate();
                }
            });

            if (autoHide && !autoHideBind) {
                touch.on(document, "tap", evtFuncs.autoHideClick);
                touch.on(node, "tap", evtFuncs.stopNodeAutoHide);
                touch.on(window, "blur", evtFuncs.autoHideClick);
                autoHideBind = true;
            } else if(!autoHide && autoHideBind) {
                touch.off(document, "tap", evtFuncs.autoHideClick);
                touch.off(node, "tap", evtFuncs.stopNodeAutoHide);
                touch.off(window, "blur", evtFuncs.autoHideClick);
                autoHideBind = false;
            }
        },
        hide: function(why, extra, handlers) {
            if (autoHideBind) {
                touch.off(document, "tap", evtFuncs.autoHideClick);
                touch.off(node, "tap", evtFuncs.stopNodeAutoHide);
                autoHideBind = false;
            }

            superMethod.hide.call(that, why, extra, handlers);
        },
        setAutoHide: function(isAutoHide) {
            if (isAutoHide == autoHide) {
                return;
            }

            autoHide = isAutoHide;

            if (that.getStatus() && autoHide) {
                touch.on(document, "tap", evtFuncs.autoHideClick);
                touch.on(node, "tap", evtFuncs.stopNodeAutoHide);
                autoHideBind = true;
            }
        },
        checkRight: function(params) {
            return (params.x + params.nodeWidth) <= (params.scrollLeft + params.clientWidth - params.barV);
        },
        checkLeft: function(params) {
            return (params.x - params.nodeWidth) >= params.scrollLeft;
        },
        checkTop: function(params) {
            return (params.y - params.nodeHeight) >= params.scrollTop;
        },
        checkBottom: function(params) {
            return (params.y + params.nodeHeight) <= (params.scrollTop + params.clientHeight - params.barH);
        }
    }

    that.show = custFuncs.show;
    that.hide = custFuncs.hide;
    that.setAutoHide = custFuncs.setAutoHide;

    return that;
}