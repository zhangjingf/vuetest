/**
 * 锁座下单
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
        var seatStr ='';
        var selectGoodsAttr = [];
        var selectGoodsString = '';
        var m_loading = null;

        //---------------事件定义----------------
        var evtFuncs = {
            placeOrder: function() {
                if(that.isLock()) {
                    return;
                }
                seatStr ='';
                selectGoodsString = '';
                if (custFuncs.arrLength(selectGoodsAttr) > 0) {
                    for (var key in selectGoodsAttr) {
                        selectGoodsString += key.split("_")[0]+ '_' +selectGoodsAttr[key] + '|';
                    }
                    selectGoodsString = selectGoodsString.substring(0,selectGoodsString.length-1);
                }
                each(opts["seatArr"].split(","), function (item) {
                    var cell = opts["sectionNo"]+'|'+item+',';
                    seatStr +=cell;
                })
                seatStr = seatStr.substr(0,seatStr.length-1);
                var param = null;
                if(!opts["actNo"]) {
                    param = {
                        "sendType": "1",
                        "orderType": "1",
                        "cardActId": opts["cardActId"],
                        "showNo": opts["showNo"],       //排期编号
                        "goods": selectGoodsString,       //排期编号
                        "seats": seatStr,   //场次号
                        "CinemaPrice":opts["CinemaPrice"],
                        "cardType": opts["cardType"],
                        "isBack":opts["isBack"],
                        "isChange":opts["isChange"]
                    };
                } else {
                    param = {
                        "sendType": "1",
                        "orderType": "2",
                        "areaNo" : opts["areaNo"]? opts["areaNo"]:"",
                        "cardActId": opts["cardActId"],
                        "actNo": opts["actNo"],
                        "showNo": opts["showNo"],       //排期编号
                        "goods": selectGoodsString,       //排期编号
                        "seats": seatStr,   //场次号
                        "CinemaPrice":opts["CinemaPrice"],
                        "cardType": opts["cardType"],
                        "isBack":opts["isBack"],
                        "isChange":opts["isChange"]
                    };
                }
                that.lock();
                m_loading.show();
                ajax({
                    "url": opts["pageInt"]["placeOrder"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        m_loading.hide();
                        //返回2，进入排队页面
                        if(res["status"]==2) {
                            webBridge.openUrl(res["data"]["url"]);
                            return;
                        }
                        if (res["status"] != 1) {
                            showMessage(res["msg"]);
                            return;
                        }
                        webBridge.openUrl(res["data"]+'&notbackpressed&userCardActPrice='+opts["userCardActPrice"], 'blank');
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
                selectGoodsAttr = data;
                if(custFuncs.arrLength(selectGoodsAttr) > 0) {
                    node.innerHTML = "选好了，继续&nbsp>";
                }
                else  {
                    node.innerHTML = "直接购票&nbsp>";
                }
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
        return that;
    }
});