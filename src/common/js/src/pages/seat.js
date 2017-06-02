/**
 *选座页面
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var header = require("sea/header");
    var alert = require("sea/dialog/alert");
    var confirm = require("sea/dialog/confirm");
    var webBridge = require("sea/webBridge");
    var storageMessager = require("lib/evt/storageMessager");
    var util = require("sea/utils");

    var seatList = require("sea/seat/seatList");
    var seatSelected = require("sea/seat/seatSelected");
    var seatPay = require("sea/seat/seatPay");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_seatList = null;
    var m_seatPay = null;
    var m_header = null;
    var m_seatSelected = null;

    //---------------事件定义----------------
    var evtFuncs = {
        updateSeat: function (event) {
            m_seatSelected.updateSeat(event.data.value);
            m_seatPay.updateNum(event.data.value);
        },
        cancelSeat: function (event) {
            m_seatList.cancelSeat(event.data.value);
            console.log(event.data.value)
        },
        changeUserData: function (ev) {
            if (ev.data.changeData == 'true') {
                webBridge.openUrl(util.getCurrentURL(),'self');
            }
        },
        getOneKeySeat: function (ev) {
            m_seatList.getOneKeySeat(ev.data.number);
        }
    }

    //---------------子模块定义---------------
    var modInit = function () {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }

        m_seatList = seatList(nodeList.seatList, opts);
        m_seatList.init();

        m_seatSelected = seatSelected(nodeList.seatSelected, opts);
        m_seatSelected.init();

        m_seatPay = seatPay(nodeList.seatPay, opts);
        m_seatPay.init();

        //virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function () {
        m_seatList.bind("updateSeat", evtFuncs.updateSeat);
        m_seatSelected.bind("cancelSeat", evtFuncs.cancelSeat);
        m_seatSelected.bind("getOneKeySeat", evtFuncs.getOneKeySeat);
        storageMessager.bind("changeUserData", evtFuncs.changeUserData);
    }

    //-----------------自定义函数-------------
    var custFuncs = {
        initView: function () {
            if (opts["statusSeat"] == "1") {
                if (localStorage.getItem("noTap") != "true") {
                    var dialog = confirm('您选择的是' + opts["tips"] + '的场次 <br>请您仔细核对，祝观影愉快', {
                        "OKText": "不再提示",
                        "cancelText": "我知道了",
                        "OK": function () {
                            localStorage.setItem("noTap", "true");
                        }
                    });
                    dialog.init();
                    dialog.show();
                    /*showMessage('你选择的是' + opts["tips"] + '的场次 <br>请您仔细核对，祝观影愉快');*/
                }
            } else {
                var dialog = alert("该场次暂未排座位，请稍后重试!", {
                    "OK": function () {
                        webBridge.close();
                    }
                });
                dialog.init();
                dialog.show();
            }
        }
    }
    //-----------------初始化----------------
    var init = function (_opts) {
        opts = _opts || {};
        nodeList = {
            seatList: queryNode("#seat_list"),
            header: queryNode("#m_header"),
            seatSelected: queryNode("#seat_selected"),
            seatPay: queryNode("#m_seatPay")
        }
        if (opts["statusSeat"] == 1) {
            modInit();
            bindEvents();
        }
        custFuncs.initView();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});
