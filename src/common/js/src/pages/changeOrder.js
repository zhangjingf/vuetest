/**
 * 订单改签页面
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var parseNode = require("lib/dom/parseNode");
    var URL = require("lib/util/URL");
    var queryToJson = require("lib/json/queryToJson");
    var webBridge = require("sea/webBridge");
    var storageMessager = require("lib/evt/storageMessager");
    var util = require("sea/utils");
    var showMessage = require("sea/showMessage");
    var header = require("sea/changeOrder/header");
    var orderAmount = require("sea/changeOrder/orderAmount");
    var countdown = require("sea/changeOrder/countdown");

    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_orderAmount = null;
    var m_countdown = null;

    //---------------事件定义----------------
    var evtFuncs = {
        payType: function (ev) {
            m_orderAmount.payOrder(ev.data);
        },
        timeChange: function (ev) {
            console.log(ev.data);
        },
        getCountTime: function () {
            var timeChange= m_countdown.timeChange();
                m_orderAmount.timeChange(timeChange);
        }
    }

    //---------------子模块定义---------------
    var modInit = function () {
        m_header = header(nodeList.header, opts);
        m_header.init();

        m_orderAmount = orderAmount(nodeList.orderAmount, opts);
        m_orderAmount.init();

        m_countdown = countdown(nodeList.countdown, opts);
        m_countdown.init();

    }

    //-----------------绑定事件---------------
    var bindEvents = function () {
        m_orderAmount.bind("getCountTime",evtFuncs.getCountTime);
    }

    //-----------------自定义函数-------------
    var custFuncs = {
        initView: function() {
            window.localStorage.setItem('outstandingOrderUrl',util.getCurrentURL());
            if(opts["orderChangeError"]) {
                showMessage(opts["orderChangeError"], function () {
                    storageMessager.send('outstandingOrderUrl',{'orderNo':opts["url"]["orderNo"]});
                    webBridge.close();
                });
            } else {
                storageMessager.send('outstandingOrderUrl','');
            }
            if(opts["url"]["from"] !='myOrder') {
                webBridge.close(3,3);
            }
        }
}
    //-----------------初始化----------------
    var init = function (_opts) {
        opts = _opts;
        opts.url= queryToJson(URL.parse(location.href)["query"]);
        nodeList = {
            header: queryNode("#m_header"),
            countdown: queryNode("#order_countdown"),
            orderAmount: queryNode("#order_amount")
        };
        modInit();
        bindEvents();
        custFuncs.initView();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});