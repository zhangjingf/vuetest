/**
 * 购票首页头部
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var className = require("lib/dom/className");
    var touch = require("touch");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            hot: function() {
                if (that.isLock()
                    || className.has(nodeList.hot, "active")
                ) {
                    return;
                }
                that.slideTo(0);
                nodeList.futureList.scrollTo(0);
            },
            future: function() {
                if (that.isLock()
                    || className.has(nodeList.future, "active")
                ) {
                    return;
                }
                that.slideTo(1);
                nodeList.movieList.scrollTo(0);
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.hot, "tap", evtFuncs.hot);
            touch.on(nodeList.future, "tap", evtFuncs.future);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            initView: function() {

                return that.slideTo(0);
            },
            slideTo: function(index) {

                if (index == 0) {
                    className.add(nodeList.hot, "active");
                    className.remove(nodeList.hot, "link");
                    className.add(nodeList.future, "link");
                    className.remove(nodeList.future, "active");
                } else {
                    className.remove(nodeList.hot, "active");
                    className.add(nodeList.hot, "link");
                    className.remove(nodeList.future, "link");
                    className.add(nodeList.future, "active");
                }
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.slideTo = custFuncs.slideTo;
        that.initView = custFuncs.initView;

        return that;
    }
});