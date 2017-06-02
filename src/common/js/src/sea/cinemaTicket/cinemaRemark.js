/**
 * 指定地区、日期和影片 筛选出影院
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var className = require("lib/dom/className");
    var each = require("lib/util/each");
    //---------- require end -------------

    //-------------全局变量 --------------

    return function(node, opts) {

        //-------------模块扩展--------------
        var that = compBase();
        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var cinema = null;


        //---------------事件定义----------------
        var evtFuncs = {}

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {}

        //-----------------自定义函数-------------
        var custFuncs = {
            inputDate : function (day) {
                each(nodeList.swiperSlide, function (item, index) {
                    var date = item.getAttribute("data-swiper");
                    //alert(day+"=="+date);
                    if (day == date) {
                        className.add(item, 'show');
                        className.remove(item, 'hidden');
                    } else {
                        className.add(item, 'hidden');
                        className.remove(item, 'show');
                    }
                });
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            data = _data;
            nodeList = parseNode(node);

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.inputDate = custFuncs.inputDate;

        return that;
    }
});