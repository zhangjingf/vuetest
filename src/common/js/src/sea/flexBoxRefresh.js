/**
 *flexBox配合app下拉刷新页面
 *
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var addEvent = require("lib/evt/add");
    var removeEvent = require("lib/evt/remove");
    var merge = require("lib/json/merge");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        opts = merge({
            "atTheTop": function() {},
            "leaveTheTop": function() {}
        }, opts || {});

        //------------声明各种变量----------------
        var data = null;
        var height = 10;
        var flag = 1;//1元素滚动条在顶部，2元素滚动条离开顶部
        var scroll = 0;//下拉刷新回调app方法计数5次

        //---------------事件定义----------------
        var evtFuncs = {
            scroll: function() {
               if(node.scrollTop>height){
                   if(flag=='1' && scroll>=5) {
                       return;
                   }
                   flag = '1';
                   scroll++;
                   custFuncs.disable();
                   opts["leaveTheTop"]();


               } else {
                   if(flag=='2') {
                       return;
                   }
                   flag = '2';
                   scroll=0;
                   custFuncs.disable();
                   opts["atTheTop"]();
               }
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            addEvent(node, "scroll", evtFuncs.scroll);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            disable: function() {
                removeEvent(node, "scroll", evtFuncs.scroll);
            },
            work: function() {
                addEvent(node, "scroll", evtFuncs.scroll);
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            data = _data;

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.disable = custFuncs.disable;
        that.work = custFuncs.work;

        return that;
    }
});
