/**
 * 确认选择会员特惠
 *
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var userCardAct = opts["isUserCardAct"] == '1' ? 1 : 0;    //是否选择会员特惠;

        //---------------事件定义----------------
        var evtFuncs = {
            radioCardAct: function (ev) {
                var hasSelected = nodeList.radioBox.classList.toggle('checked');
                userCardAct = hasSelected ? 1 : 0;
                that.fire('userCardAct', {"userCardAct": userCardAct});
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(node, "tap", evtFuncs.radioCardAct);
        }

        //-----------------自定义函数-------------
        var custFuncs = {}

        //-----------------初始化----------------
        var init = function (_data) {
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