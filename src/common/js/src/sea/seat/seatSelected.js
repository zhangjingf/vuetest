/**
 *座位选择
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var each = require("lib/util/each");
    var touch = require("touch");
    var showMessage = require("sea/showMessage");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            cancelSeat: function(ev) {
                var seatDataset = {};
                for(key in ev.target.dataset) {
                    seatDataset[key] = ev.target.dataset[key];
                }
                if(seatDataset.row) {
                    that.fire("cancelSeat", {
                        "value": seatDataset.row + '|' + seatDataset.column
                    })
                } else {
                    that.fire("getOneKeySeat", {
                        "number": seatDataset.number
                    })
                }
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.selected, "tap", "span", evtFuncs.cancelSeat);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            updateSeat: function(arr) {
                var html = '';
                if (arr.length <= 0) {
                    nodeList.seatListTitle.innerHTML = "推荐选座";
                    html = '<span data-type="recommend" data-number="1">1人</span><span data-type="recommend" data-number="2">2人</span><span data-type="recommend" data-number="3">3人</span><span data-type="recommend" data-number="4">4人</span>';
                } else {
                    nodeList.seatListTitle.innerHTML = "已选选座";
                    each(arr, function(item) {
                        var row = item.split("|")[0];
                        var column = item.split("|")[1];
                        html += '<span node-name="select_seat" data-row="' + row + '" data-column="' + column + '">' + row + '排' + column + '座 X</span>'
                    })
                }
                nodeList.selected.innerHTML = html;
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
        that.updateSeat = custFuncs.updateSeat;
        return that;
    }
});
