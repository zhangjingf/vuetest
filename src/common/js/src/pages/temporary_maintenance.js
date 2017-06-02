/**
 * 卖品选择页
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var parseNode = require("lib/dom/parseNode");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var parseBody = null;

    //---------------事件定义----------------
    var evtFuncs = {
        back:function(){
            webBridge.close();
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {

    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        touch.on(parseBody.back,"tap",evtFuncs.back);
    }

    //-----------------自定义函数-------------
    var custFuncs = {
    }
    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts;
        nodeList = {
            body: queryNode("#p_body")
        };
        parseBody = parseNode(nodeList.body);
        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});