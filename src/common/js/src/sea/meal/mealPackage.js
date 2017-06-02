/**
 * 卖品列表操作页面
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    //var ajax = require("lib/io/ajax");
    //var each = require("lib/util/each");
    var touch = require("touch");
    //var showMessage = require("sea/showMessage");
    var webBridge = require("sea/webBridge");
    var closest = require("lib/dom/closest");
    var className = require("lib/dom/className");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var selectGoodsAttr = [];

        //---------------事件定义----------------
        var evtFuncs = {
            add: function(ev) {
                var num = parseInt(closest(ev.target, "[node-name='add']", node).previousElementSibling.innerHTML);
                var numNode = closest(ev.target, "[node-name='add']", node).previousElementSibling;
                var typeNode = closest(ev.target, "[data-ProCode]", node);
                var changeNum = closest(ev.target, "[data-change]", node);
                var ProCode = typeNode.getAttribute("data-ProCode");
                var proName = typeNode.getAttribute("data-proName");

                className.remove(changeNum,"change-num-t");
                className.add(changeNum,"change-num-o");
                num++;
                numNode.innerHTML = num;
                selectGoodsAttr[ProCode+'_'+proName] = num;
                custFuncs.intSelectList(selectGoodsAttr);
            },
            minus: function(ev) {
                var num = parseInt(closest(ev.target, "[node-name='minus']", node).nextElementSibling.innerHTML);
                var numNode = closest(ev.target, "[node-name='minus']", node).nextElementSibling;
                var typeNode = closest(ev.target, "[data-ProCode]", node);
                var changeNum = closest(ev.target, "[data-change]", node);
                var ProCode = typeNode.getAttribute("data-ProCode");
                var proName = typeNode.getAttribute("data-proName");
                if(num > 0) {
                    num--;
                    numNode.innerHTML = num;
                    selectGoodsAttr[ProCode+'_'+proName] = num;
                }
                if(num <=0 ) {
                    className.remove(changeNum,"change-num-o");
                    className.add(changeNum,"change-num-t");
                    delete selectGoodsAttr[ProCode+'_'+proName];
                }
                custFuncs.intSelectList(selectGoodsAttr);
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.minus, "tap", evtFuncs.minus);
            touch.on(nodeList.add, "tap", evtFuncs.add);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            intSelectList: function(arr) {
                var selectList = nodeList.selectList;
                if (custFuncs.arrLength(arr) > 0) {
                    var html = '<div>您选择了:</div>';
                    for (var key in arr) {
                        html += '<div><p><span>' + key.split("_")[1] + '</span><span>×' + arr[key] + '</span> </p></div>';
                    }
                } else {
                    html = '';
                }
                selectList.innerHTML = html;
                that.fire("selectMeal",{data:arr})
            },
            arrLength: function count(o) {
                var t = typeof o;
                if (t == 'string') {
                    return o.length;
                } else if (t == 'object') {
                    var n = 0;
                    for (var i in o) {
                        n++;
                    }
                    return n;
                }
                return false;
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
        return that;
    }
});
