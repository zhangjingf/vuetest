/**
 * 订单详情
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var className = require("lib/dom/className");
    //---------- require end -------------
    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var initNumber = null;
        //---------------事件定义----------------
        var evtFuncs = {
            minus: function () {
                var number = parseInt(nodeList.num.innerHTML);
                if(number<=1) {

                }else {
                    nodeList.num.innerHTML = number-1;
                    custFuncs.changeNumStyle();
                }
            },
            add: function () {
                var number = parseInt(nodeList.num.innerHTML);
                if(number>=initNumber) {

                }else {
                    nodeList.num.innerHTML = number+1;
                    custFuncs.changeNumStyle();
                }
            },
            goVirtualmemberfill:function(ev) {
                webBridge.openUrl(nodeList.goVirtualmemberfill.getAttribute("data-href"));
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.changeNum,"tap","[node-name='minus']",evtFuncs.minus);
            touch.on(nodeList.changeNum,"tap","[node-name='add']",evtFuncs.add);
            touch.on(nodeList.goVirtualmemberfill,"tap", evtFuncs.goVirtualmemberfill);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            initView: function () {
                initNumber =parseInt(nodeList.num.innerHTML);
                if(parseInt(nodeList.num.innerHTML)>1) {
                    className.add(nodeList.changeNum,"change-num-o");
                    className.remove(nodeList.changeNum,"change-num-t");
                } else if(parseInt(nodeList.num.innerHTML)==1){
                    className.add(nodeList.changeNum,"change-num-ff");
                    className.remove(nodeList.changeNum,"change-num-t");
                }
            },
            changeNumStyle :function () {
                var num = parseInt(nodeList.num.innerHTML);
                if(num<=1) {
                    className.remove(nodeList.changeNum,["change-num-o","change-num-t","change-num-th","change-num-fo"]);
                    className.add(nodeList.changeNum,"change-num-fo");
                } else if(num>=initNumber) {
                    className.remove(nodeList.changeNum,["change-num-o","change-num-t","change-num-th","change-num-fo"]);
                    className.add(nodeList.changeNum,"change-num-o");
                } else if(num < initNumber) {
                    className.remove(nodeList.changeNum,["change-num-o","change-num-t","change-num-th","change-num-fo"]);
                    if(num>1) {
                        className.add(nodeList.changeNum,"change-num-th");
                    }
                }
                nodeList.allPrice.innerHTML = '¥'+parseFloat(nodeList.price.getAttribute("data-price"))*num;
                that.fire("changeNum",{"num":num});
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
            custFuncs.initView();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        return that;
    }
});
