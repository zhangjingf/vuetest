/**
 * 电子券列表 模块控制器
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    //var webBridge = require("sea/webBridge");
    var each = require("lib/util/each");
    var closest = require("lib/dom/closest");
    var className = require("lib/dom/className");
    var touch = require("touch");
    //var showMessage = require("sea/showMessage");

    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            selected: function (ev) {
                var i = 0;
                var selectedRus = '';
                var target = ev.target;
                var pNode = closest(target, "[data-couponNo]", node);/*开始元素,含有的属性,终点元素*/
                if (pNode == null) {
                    return;
                }
                var nodeSelected = parseNode(pNode).selected;
                if (className.has(nodeSelected, "icon-blue-select")) {
                    className.remove(nodeSelected, "icon-blue-select");
                } else {
                    className.add(nodeSelected, "icon-blue-select");
                }

                if (nodeList.CouponNo instanceof Array) {
                    each(nodeList.CouponNo, function (item, index) {
                        if (className.has(parseNode(item).selected, "icon-blue-select")) {
                            if (i == 0) {
                                selectedRus = item.getAttribute('data-couponNo');
                            } else {
                                selectedRus += ',' + item.getAttribute('data-couponNo');
                            }
                            i++;
                        }
                    });
                } else {
                    if (className.has(parseNode(nodeList.CouponNo).selected, "icon-blue-select")) {
                        selectedRus = nodeList.CouponNo.getAttribute('data-couponNo');
                    }
                }
                custFuncs.fireResult(selectedRus);
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(node, 'tap', '[data-couponNo]', evtFuncs.selected);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            fireResult : function (selectedRus) {
                that.fire("ensureChange", {
                    "value": '1,'+selectedRus
                });
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;


            /*custFuncs.loadCoupon();*/
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});