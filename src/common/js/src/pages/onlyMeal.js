/**
 * 单独卖品
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
   // var webBridge = require("sea/webBridge");
    var queryToJson = require("lib/json/queryToJson");
    var URL = require("lib/util/URL");
    var mealPackage = require("sea/onlyMeal/mealPackage");
    var placeOrder = require("sea/onlyMeal/placeOrder");
    var changeShop = require("sea/onlyMeal/changeShop");
    var storageMessager = require("lib/evt/storageMessager");
    var confirm = require("sea/dialog/confirm");
    var header = require("sea/header");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_mealPackage = null;
    var m_header = null;
    var m_placeOrder = null;
    var m_changeShop = null;
    var cinema = null;

    //---------------事件定义----------------
    var evtFuncs = {
        selectMeal: function (ev) {
            m_placeOrder.getSelectMeal(ev.data);
            //console.log(ev.data);
        },
        cinemaMealInfo:function(ev) {
            cinema = ev.data.cinema;
            m_placeOrder.changeCinema(ev.data.isSnacksBack);
            m_mealPackage.cinemaMealInfo(ev.data.cinema);
        },
        initOnlyMeal: function () {
            m_mealPackage.cinemaMealInfo(cinema);
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

        m_changeShop = changeShop(nodeList.changeShop, opts);
        m_changeShop.init();

    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        m_mealPackage.bind("selectMeal",evtFuncs.selectMeal);
        m_changeShop.bind("changeShop",evtFuncs.cinemaMealInfo);
        storageMessager.bind("cancelMealOrder",evtFuncs.initOnlyMeal);
    }

    //-----------------自定义函数-------------
    var custFuncs = {
    }
    //-----------------初始化----------------
    var init = function(_opts) {
        opts = queryToJson(URL.parse(location.href)["query"]);
        opts.pageInt = _opts;
        cinema = opts.pageInt["cinemaNo"];
        nodeList = {
            mealPackage: queryNode("#meal_package"),
            header: queryNode("#m_header"),
            placeOrder: queryNode("#m_placeOrder"),
            changeShop: queryNode("#m_changeShop")
        };
        modInit();
        bindEvents();
        if(localStorage.getItem("onlyMealNoTip")!=='1') {
            var dialog = confirm('您正在购买<span style="color:#f91717; vertical-align:baseline; font-weight: bold;">' + opts["pageInt"]["tips"] + '</span></br>的观影美食，请您仔细核对。</br>页面左上角可以切换影城。', {
                "OKText": "不再提示",
                "cancelText": "我知道了",
                "OK": function () {
                    localStorage.setItem("onlyMealNoTip","1");
                }
            });
            dialog.init();
            dialog.show();
        }
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});