/**
 * 影院详情 模块
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var each = require("lib/util/each");
    var touch = require("touch");
    var webBridge = require("sea/webBridge");
    var showMessage = require("sea/showMessage");

    //---------- require end -------------

    //-------------全局变量 --------------\
    var telNumber = null;

    return function(node, opts) {

        //-------------模块扩展--------------
        var that = compBase();
        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var mapData = null;

        //---------------事件定义----------------
        var evtFuncs = {
            intoMap : function () {
                mapData = {cinemaName:opts["cinemaName"],cinemaAddress:opts["address"],latlng:opts["latlng"]};
                webBridge.showCinemaMap(mapData, function (res) {
                    showMessage(res);
                });
            },

            showRoute: function(ev) {
                showMessage(ev.target.innerHTML);
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.cinemaAddrOut, "tap", evtFuncs.intoMap);
            touch.on(nodeList.cinemaTraOut, 'tap', evtFuncs.showRoute);
        }

        //-----------------自定义函数-------------
        var custFuncs = {}

        //--------8---------初始化----------------
        var init = function(_data) {
            data = _data;
            nodeList = parseNode(node);

            modInit();
            bindEvents();
        }

        //--------9---------暴露各种方法-----------
        that.init = init;

        return that;
    }
});