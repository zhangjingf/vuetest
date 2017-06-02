/**
 * 倒计时
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase(); 

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        //---------------事件定义----------------
        var evtFuncs = {

        }

        //---------------子模块定义---------------
        var modInit = function() {

        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            countDown:function (node, string, s) {
                var timer = null;
                var year = string.substr(0, 4);
                var month = string.substr(4, 2);
                var day = string.substr(6, 2);
                var hour = string.substr(8, 2);
                var minute = string.substr(10, 2);
                var second = string.substr(12, 2) || "00";
                var current = new Date();
                current.setFullYear(year, parseInt(month) - 1, day);
                current.setHours(hour, minute, second);
                function countStart() {
                    var now = new Date();
                    var count = Math.floor(((current.getTime() + s * 1000) - now.getTime()) / 1000);
                    if (count <= 0/* || count > s*/) {
                        node.innerHTML = "0分0秒";
                        return;
                    }

                    var min = Math.floor(count / 60);
                    var sec = count % 60;
                    //sec = sec < 10 ? "0" + sec : sec;
                    node.innerHTML = min + "分" + sec + "秒";
                    timer = setTimeout(countStart, 950);
                    if (min == 0 && sec == 0) {
                        clearTimeout(timer);
                        timer = null;
                    }
                }
                countStart();
            },
            getCountDownState: function () {
                if(nodeList.time.innerHTML == '0分0秒') {
                    return true;
                } else {
                    return false;
                }
                return nodeList.time.innerHTML;
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
            custFuncs.countDown(nodeList.time,opts["orderTime"],14*60);
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.getCountDownState = custFuncs.getCountDownState;
        return that;
    }
});
