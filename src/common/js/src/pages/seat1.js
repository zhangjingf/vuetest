/**
 *选座页面
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var showMessage = require("sea/showMessage");
    var confirm = require("sea/dialog/confirm");
    var storageMessager = require("lib/evt/storageMessager");
    var queryToJson = require("lib/json/queryToJson");
    var URL = require("lib/util/URL");
    var webBridge = require("sea/webBridge");


    var seatList = require("sea/seat1/seatList");
    var seatSelected = require("sea/seat1/seatSelected");
    var header = require("sea/header");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_seatList = null;
    var m_header = null;
    var m_seatSelected = null;

    //---------------事件定义----------------
    var evtFuncs = {
        cancelSeat: function(event) {
            m_seatList.cancelSeat(event.data.value);
        },
        changeSelectedSeat: function (ev) {
            m_seatSelected.updateSelectedSeat(ev.data.seatArr);
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }

        m_seatList = seatList(nodeList.seatList, opts);
        m_seatList.init();

        m_seatSelected = seatSelected(nodeList.seatSelected, opts);
        m_seatSelected.init();


    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        storageMessager.bind("userChanged",m_seatList.updateIslogin);
        m_seatList.bind("changeSelectedSeat",evtFuncs.changeSelectedSeat);
        m_seatSelected.bind("cancelSeat",evtFuncs.cancelSeat);
    }

    //-----------------自定义函数-------------
    var custFuncs = {
            initView: function() {
                if(opts["statusSeat"] == "1") {
                    if(localStorage.getItem("noTap") != "true") {
                        var dialog = confirm('您选择的是' + opts["tips"] + '的场次 <br>请您仔细核对，祝观影愉快', {
                            "OKText": "不再提示",
                            "cancelText": "我知道了",
                            "OK": function () {
                                localStorage.setItem("noTap","true");
                            }
                        });
                        dialog.init();
                        dialog.show();
                    }
                } else {
                    var dialog = showMessage("该场次暂未排座位，请稍后重试!", {
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
    var init = function(_opts) {
        opts = _opts || {};
        opts.url = queryToJson(URL.parse(location.href)["query"]);
        nodeList = {
            header: queryNode("#m_header"),
            seatList: queryNode("#m_seatList"),
            seatSelected: queryNode("#m_seatSelected")
        }
        if(opts["statusSeat"] == '1') {
            modInit();
            bindEvents();
        }
        custFuncs.initView();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});
