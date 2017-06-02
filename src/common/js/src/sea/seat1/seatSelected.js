/**
 *座位选择
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var each = require("lib/util/each");
    var touch = require("touch");
    var showMessage = require("sea/showMessage");
    var closest = require("lib/dom/closest");
    var loading = require("sea/dialog/loading");
    var webBridge = require("sea/webBridge");
    var appendQuery = require("lib/str/appendQuery");
    var ajax = require("lib/io/ajax");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_loading = null;
        var seatsArr = [];

        //---------------事件定义----------------
        var evtFuncs = {
            cancelSeat: function(ev) {
                var seatNode = closest(ev.target, "div", nodeList.selectedSeat);
                var row = seatNode.getAttribute("data-row");
                var column = seatNode.getAttribute("data-column");
                if (row == null) {
                    return;
                }
                that.fire("cancelSeat", {
                    "value": row + '|' + column
                })
            },
            nextStep: function() {
                //   三种情况，1、锁座下单   2、跳转卖品页面   3、改签下单
                var seatArrString = '';
                var seatStr = '';
                //改签判断选择座位是否相等,改签不选择卖品
                if (opts["url"]["seatNum"] && (seatsArr.length != parseInt(opts["url"]["seatNum"]))) {
                    showMessage('您的本次改签包含' + opts["url"]["seatNum"] + '个座位，请选择' + opts["url"]["seatNum"] + '个座位');
                    return;
                }
                each(seatsArr, function(item, index) {
                    if (index < seatsArr.length - 1) {
                        seatArrString += item + ',';
                        seatStr += opts["sectionNo"] + '|' + item + ',';
                    } else {
                        seatArrString += item;
                        seatStr += opts["sectionNo"] + '|' + item;
                    }
                });

                //没有卖品或者是改签的订单直接下单
                if (opts["statusMeal"] == '1' && !opts["url"]["seatNum"]) { //有卖品
                    webBridge.openUrl(appendQuery(opts["PayUrl"], {
                        "sectionNo": opts["sectionNo"],
                        "seatArr": seatArrString,
                        "actNo": opts["url"]["actNo"],
                        "cardActId": opts["url"]["cardActId"],
                        "CinemaPrice": opts["CinemaPrice"],
                        "cardType": opts["cardType"],
                        "userCardActPrice": opts["url"]["userCardActPrice"]
                    }), 'blank');
                } else {
                    var param = null;
                    if (that.isLock()) {
                        return;
                    }
                    if (!opts["url"]["actNo"]) {
                        param = {
                            /*actNo 为空 不是活动跳过来的*/
                            "sendType": "1",
                            "orderType": "1",
                            "cardActId": opts["url"]["cardActId"],
                            "showNo": opts["showNo"], //排期编号
                            "seats": seatStr, //场次号
                            "CinemaPrice": opts["CinemaPrice"],
                            "cardType": opts["cardType"],
                            "isBack": opts["url"]["isBack"],
                            "isChange": opts["url"]["isChange"]
                        };
                    } else {
                        param = {
                            "sendType": "1",
                            "areaNo": opts["url"]["areaNo"] ? opts["url"]["areaNo"] : "",
                            "orderType": "2",
                            "cardActId": opts["url"]["cardActId"],
                            "actNo": opts["url"]["actNo"],
                            "showNo": opts["showNo"], //排期编号
                            "seats": seatStr, //场次号
                            "CinemaPrice": opts["CinemaPrice"],
                            "cardType": opts["cardType"],
                            "isBack": opts["url"]["isBack"],
                            "isChange": opts["url"]["isChange"]
                        };
                    }
                    //改签下单增加参数
                    if (!!opts["url"]["seatNum"]) {
                        param["orderNoBack"] = opts["url"]["orderNo"];
                        param["orderNoBackPrice"] = opts["url"]["orderNoBackPrice"];
                        param["goods"] = opts["url"]["goods"];
                        param["integralNum"] = opts["url"]["integralNum"];
                    }
                    that.lock();
                    m_loading.show();
                    ajax({
                        "url": opts["placeOrder"],
                        "method": "post",
                        "data": param,
                        "onSuccess": function(res) {
                            that.unLock();
                            m_loading.hide();
                            //返回2，进入排队页面
                            if (res["status"] == 2) {
                                webBridge.openUrl(res["data"]["url"]);
                                return;
                            }
                            if (res["status"] != 1) {
                                showMessage(res["msg"]);
                                return;
                            }
                            webBridge.openUrl(res["data"] + '&userCardActPrice=' + opts["url"]["userCardActPrice"]);
                        },
                        "onError": function(res) {
                            that.unLock();
                            m_loading.hide();
                            console.error("网络连接失败(" + res.status + ")");
                        }
                    });
                }
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
            touch.on(nodeList.selectedSeat, "tap", "div", evtFuncs.cancelSeat);
            touch.on(nodeList.nextStep, "tap", evtFuncs.nextStep);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            updateSelectedSeat: function(seatArr) {
                seatsArr = seatArr; //全局变量保存选择座位数组
                var seatSelectedHtml = '';
                if (seatArr.length <= 0) {
                    seatSelectedHtml = '<div><span>未选</span></div>';
                    nodeList.nextStep.classList.remove("show");
                } else {
                    each(seatArr, function(item) {
                        var row = item.split("|")[0];
                        var column = item.split("|")[1];
                        seatSelectedHtml += '<div data-row="' + row + '" data-column="' + column + '"><span>' + row + '排' + column + '座<i class="icon-seat-x2"></i></span></div>'
                    })
                    if (opts["url"]["seatNum"]) {
                        nodeList.nextStep.innerHTML = '确认改签';
                    }
                    nodeList.nextStep.classList.add("show");
                }
                nodeList.selectedSeat.innerHTML = seatSelectedHtml;
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
        that.updateSelectedSeat = custFuncs.updateSelectedSeat;
        return that;
    }
});