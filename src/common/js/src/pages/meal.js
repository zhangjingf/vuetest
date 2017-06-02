/**
 * 卖品选择页
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var mealPackage = require("sea/meal/mealPackage");
    var placeOrder = require("sea/meal/placeOrder");
    var header = require("sea/header");
    var URL = require("lib/util/URL");
    var queryToJson = require("lib/json/queryToJson");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_mealPackage = null;
    var m_header = null;
    var m_placeOrder = null;

    //---------------事件定义----------------
    var evtFuncs = {
        selectMeal: function (ev) {
            m_placeOrder.getSelectMeal(ev.data.data);
            //console.log(ev.data.data);
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }

        m_mealPackage = mealPackage(nodeList.mealPackage, opts);
        m_mealPackage.init();

        m_placeOrder = placeOrder(nodeList.placeOrder, opts);
        m_placeOrder.init();

    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        m_mealPackage.bind("selectMeal",evtFuncs.selectMeal)
    }

    //-----------------自定义函数-------------
    var custFuncs = {
    }
    //-----------------初始化----------------
    var init = function(_opts) {
        opts = queryToJson(URL.parse(location.href)["query"]);
        opts.pageInt = _opts;

        nodeList = {
            mealPackage: queryNode("#meal_package"),
            header: queryNode("#m_header"),
            placeOrder: queryNode("#m_placeOrder")
        }

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});