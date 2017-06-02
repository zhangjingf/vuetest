/**
 * 定时器
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var setStyle = require("lib/dom/setStyle");
    var compBase = require("lib/comp/base");
    var touch = require("touch");
    var merge = require("lib/json/merge");

    //---------- require end -------------
    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var data = null;
        var timer = null;
        var totalSecond = null;
        var config = {
            isMinute: true,
            time: 120,//分钟
            change: function(){},
            end: function(){}
        }

        //---------------事件定义----------------
        var evtFuncs = {}

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {}


        //-----------------自定义函数-------------
        var custFuncs = {
            formatTime: function(total){
                var hour = 0, minute = 0, second = 0;
                var toTwo = function(number){
                    if(number < 10) return "0" + number;
                    return number;
                };
                if(total <= 0){
                    data.change(toTwo(hour), toTwo(minute), toTwo(second), total);
                    data.end();//结束
                    custFuncs.destroyTimer();
                    return;
                }
                if(Math.floor(total / 60) > 0){
                    minute = Math.floor(total / 60);
                }
                if(Math.floor(minute / 60) > 0){
                    hour = Math.floor(minute / 60);
                    minute -= hour * 60;
                }
                second = total - hour * 3600 - minute * 60;
                data.change(toTwo(hour), toTwo(minute), toTwo(second), total);
            },
            createTimer: function(){
                timer = setInterval(function(){
                    custFuncs.formatTime(--totalSecond);
                }, 1000);
            },
            destroyTimer: function(){
                clearInterval(timer);
            },
            convert: function(time){
                if(!isNaN(time)){
                    return parseInt(data.isMinute ? time * 60 : time);
                }else{
                    var arr = time.split(":");
                    if(arr.length == 2){
                        return parseInt(arr[0]) * 60 + parseInt(arr[1]);
                    }else if(arr.length == 3){
                        return parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60 + parseInt(arr[2]);
                    }
                    return 0;
                }
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            data = merge(config, _data || {});
            totalSecond = custFuncs.convert(data.time);

            modInit();
            bindEvents();
            custFuncs.createTimer();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});