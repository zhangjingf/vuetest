/**
 * 切换影院
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var className = require("lib/dom/className");
    var each = require("lib/util/each");
    var closest = require("lib/dom/closest");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var isSnacksBack = null;

        //---------------事件定义----------------
        var evtFuncs = {
            showShop: function () {
                className.toggle(nodeList.shop_list,"select-shop");
                className.toggle(nodeList.down_icon,"down-icon");
            },
            changeShop: function (ev) {
                var nodeLi = closest(ev.target, "[data-cinemano]", nodeList.shop_list);
                var cinemaCell = nodeList.cinemaCell;
                try{
                    nodeList.select_shop.innerHTML = nodeLi.innerHTML;
                    className.remove(cinemaCell,"selected");
                    className.add(nodeLi,"selected");
                    var cinemaNo = nodeLi.getAttribute("data-cinemano");
                    var isSnacksBack = nodeLi.getAttribute("data-issnacksback");
                }catch(er) {
                    console.log(er);
                }

                /*选择商店跳回*/
                evtFuncs.showShop();
                that.fire("changeShop",{"cinema":cinemaNo,'isSnacksBack':isSnacksBack})
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {

        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.select, "tap", evtFuncs.showShop);
            touch.on(nodeList.shop_list, "tap",'li', evtFuncs.changeShop);
        }

        //-----------------自定义函数-------------
        var custFuncs = {

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