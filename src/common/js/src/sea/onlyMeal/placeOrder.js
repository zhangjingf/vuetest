/**
 * 单独卖品支付
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var ajax = require("lib/io/ajax");
    var showMessage = require("sea/showMessage");
    var webBridge = require("sea/webBridge");
    var each = require("lib/util/each");
    var loading = require("sea/dialog/loading");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var url =null;
        var selectGoodsAttr = [];
        var selectGoodsString = '';
        var selectedCinemaNo = '';
        var isSnacksBack = opts["pageInt"]["isSnacksBack"];
        var m_loading = null;
        var isLogin = false;

        //---------------事件定义----------------
        var evtFuncs = {
            placeOrder: function() {
                if(that.isLock()) {
                    return;
                }

                if(isLogin == false) {
                    custFuncs.isLogin();
                    return;
                }


                selectGoodsString = '';
                if (custFuncs.arrLength(selectGoodsAttr) > 0) {
                    for (var key in selectGoodsAttr) {
                        selectGoodsString += key.split("_")[0]+ '_' +selectGoodsAttr[key] + '|';
                    }
                    selectGoodsString = selectGoodsString.substring(0,selectGoodsString.length-1);
                }
                var param = {
                    "cinemaNo": selectedCinemaNo,
                    "goods": selectGoodsString,
                    "isSnacksBack": isSnacksBack
                };
                that.lock();
                m_loading.show();
                ajax({
                    "url": opts["pageInt"]["placeOrder"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        m_loading.hide();
                        if (res["status"] != 1) {
                            showMessage(res["msg"]);
                            return;
                        }
                        webBridge.openUrl(res["data"]["url"]+'&notbackpressed');
                    },
                    "onError": function (res) {
                        that.unLock();
                        m_loading.hide();
                        console.error("网络连接失败" + res.status );
                    }
                });
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
            m_loading = loading();
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(node, "tap", evtFuncs.placeOrder)
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            arrLength: function count(o) {
                var t = typeof o;
                if (t == 'string') {
                    return o.length;
                } else if (t == 'object') {
                    var n = 0;
                    for (var i in o) {
                        n++;
                    }
                    return n;
                }
                return false;
            },
            getSelectMeal: function (data) {
                selectGoodsAttr = data.selectGoodsAttr;
                selectedCinemaNo = data.selectedCinemaNo;
                if(custFuncs.arrLength(selectGoodsAttr) > 0) {
                    node.style.display = "block"
                }
                else  {
                    node.style.display = "none"
                }
            },
            isLogin: function () {
                ajax({
                    "url": opts["pageInt"]["isLogin"],
                    "method": "get",
                    "data": {},
                    "onSuccess": function (res) {
                        if (res["status"] != 1) {
                            return;
                        }
                        if(res["data"]["status"] ==2) {
                            isLogin = true;
                            evtFuncs.placeOrder();
                            return;
                        }else {
                            webBridge.openUrl(res["data"]["url"]);
                        }
                    },
                    "onError": function (res) {
                        console.error("网络连接失败(" + res.status + ")");
                    }
                });
            },
            changeCinema: function (nacksBack) {
                isSnacksBack = nacksBack;
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
        that.getSelectMeal = custFuncs.getSelectMeal;
        that.changeCinema = custFuncs.changeCinema;
        return that;
    }
});