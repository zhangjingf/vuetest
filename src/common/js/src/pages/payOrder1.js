/**
 * 订单支付
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var webBridge = require("sea/webBridge");
    var storageMessager = require("lib/evt/storageMessager");
    var parseNode = require("lib/dom/parseNode");
    var queryToJson = require("lib/json/queryToJson");
    var URL = require("lib/util/URL");
    var virtualLink = require("lib/util/virtualLink");
    var util = require("sea/utils");


    var header = require("sea/payOrder1/header");
    var countDown = require("sea/payOrder1/countdown");
    var cardAct = require("sea/payOrder1/cardAct");
    var payType = require("sea/payOrder1/payType");
    var orderAmount = require("sea/payOrder1/orderAmount");

    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;

    var m_header = null;
    var m_payType = null;
    var m_orderAmount = null;
    var m_countDown = null;
    var m_cardAct = null;

    //---------------事件定义----------------
    var evtFuncs = {
        //各种绑卡充值操作刷新页面
        changeUserData: function (ev) {
            if (ev.data.changeData == 'true') {
                webBridge.openUrl(util.getCurrentURL(),'self');
            }
        },
        userCardAct: function (ev) {
            m_payType.reloadShowData(ev.data.userCardAct);
            m_orderAmount.changeUserCardAct(ev.data.userCardAct);

        },
        payType: function (ev) {
            m_orderAmount.changePayInfo(ev.data.payType);
        },
        payOrder: function (ev) {
            m_orderAmount.getCountDownState(m_countDown.getCountDownState());
        },
        //通知返回按钮返回是否需要取消会员特惠
        cancelcardAct: function (ev) {
            m_header.cancelcardAct(ev.data);
        }
    }

    //---------------子模块定义---------------
    var modInit = function () {
        m_header = header(nodeList.header, opts);
        m_header.init();

        if (nodeList.cardAct) {
            m_cardAct = cardAct(nodeList.cardAct, opts);
            m_cardAct.init();
        }

        m_countDown = countDown(nodeList.countDown, opts);
        m_countDown.init();

        m_payType = payType(nodeList.payType, opts);
        m_payType.init();

        m_orderAmount = orderAmount(nodeList.orderAmount, opts);
        m_orderAmount.init();

        virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function () {
        storageMessager.bind("changeUserData", evtFuncs.changeUserData);
        if (nodeList.cardAct) {
            m_cardAct.bind('userCardAct', evtFuncs.userCardAct);//切换选择会员特惠
        }
        m_payType.bind('payType', evtFuncs.payType);//切换选择会员特惠
        m_orderAmount.bind('payOrder',evtFuncs.payOrder);//获取倒计时是否过期状态
        m_orderAmount.bind('cancelcardAct',evtFuncs.cancelcardAct);//获取倒计时是否过期状态

        webBridge.onBackPressed = function () {
            m_header.onBackPressed();
            var isIPhone = navigator.appVersion.match(/iphone/gi);
            if (isIPhone) {
                return "turnBackSucceed";
            }
        }
    }

    //-----------------自定义函数-------------
    var custFuncs = {
        initView: function () {
            webBridge.close(2);
            window.localStorage.setItem('outstandingOrderUrl', util.getCurrentURL()); //存储url用于二次支付
            storageMessager.send('outstandingOrderUrl', '');//通知订单列表刷新页面
        }
    }
    //-----------------初始化----------------
    var init = function (_opts) {
        opts = _opts;
        opts.url = queryToJson(URL.parse(location.href)["query"]);
        nodeList = {
            header: queryNode("#m_header"),
            countDown: queryNode("#m_countdown"),
            cardAct: queryNode("#m_cardAct"),
            payType: queryNode("#m_payType"),
            orderAmount: queryNode("#m_orderAmount")
        };
        modInit();
        bindEvents();
        custFuncs.initView();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});