/**
 *选座完成，确认下一步
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var webBridge = require("sea/webBridge");
    var appendQuery = require("lib/str/appendQuery");
    var each = require("lib/util/each");
    var ajax = require("lib/io/ajax");
    var showMessage = require("sea/showMessage");
    var queryToJson = require("lib/json/queryToJson");
    var URL = require("lib/util/URL");
    var loading = require("sea/dialog/loading");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var seatStr = "";
        var seatArr = [];
        var url = null;
        var m_loading = null;

        //---------------事件定义----------------
        var evtFuncs = {
            seatNext: function() {
                if(document.querySelector("[node-name='sound']")) {
                    document.querySelector("[node-name='sound']").pause();
                }
                var seatArrString = '';
                seatStr= '';
                //改签判断选择座位是否相等,改签不选择卖品
                if(url["seatNum"] && (seatArr.length != parseInt(url["seatNum"]))) {
                    showMessage('您的本次改签包含'+url["seatNum"]+'个座位，请选择'+url["seatNum"]+'个座位');
                    return;
                }
                each(seatArr, function (item,index) {
                    if(index < seatArr.length-1) {
                        seatArrString += item + ',';
                        seatStr += opts["sectionNo"]+'|'+item+',';
                    }
                    else {
                        seatArrString += item;
                        seatStr += opts["sectionNo"]+'|'+item;
                    }
                });

                //没有卖品或者是改签的订单直接下单
                if (opts["statusMeal"] == '1' && !url["seatNum"]) {//有卖品
                    webBridge.openUrl(appendQuery(opts["PayUrl"], {
                        "sectionNo": opts["sectionNo"],
                        "seatArr": seatArrString,
                        "actNo": url["actNo"],
                        "cardActId": url["cardActId"],
                        "CinemaPrice":opts["CinemaPrice"],
                        "cardType": opts["cardType"],
                        "userCardActPrice":url["userCardActPrice"]
                    }), 'blank');
                } else {
                    var param = null;
                    if(that.isLock()){
                        return;
                    }
                    if(!url["actNo"]) {
                        param = {/*actNo 为空 不是活动跳过来的*/
                            "sendType": "1",
                            "orderType": "1",
                            "cardActId": url["cardActId"],
                            "showNo": opts["showNo"],       //排期编号
                            "seats": seatStr,                //场次号
                            "CinemaPrice":opts["CinemaPrice"],
                            "cardType": opts["cardType"],
                            "isBack":url["isBack"],
                            "isChange":url["isChange"]
                        };
                    } else {
                        param = {
                            "sendType": "1",
                            "areaNo" : url["areaNo"]? url["areaNo"]:"",
                            "orderType": "2",
                            "cardActId": url["cardActId"],
                            "actNo": url["actNo"],
                            "showNo": opts["showNo"],       //排期编号
                            "seats": seatStr,                //场次号
                            "CinemaPrice":opts["CinemaPrice"],
                            "cardType": opts["cardType"],
                            "isBack":url["isBack"],
                            "isChange":url["isChange"]
                        };
                    }
                    //改签下单增加参数
                    if(!!url["seatNum"]){
                        param["orderNoBack"] =url["orderNo"];
                        param["orderNoBackPrice"] =url["orderNoBackPrice"];
                        param["goods"] =url["goods"];
                        param["integralNum"] =url["integralNum"];
                    }
                    that.lock();
                    m_loading.show();
                    ajax({
                        "url": opts["placeOrder"],
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
                            webBridge.openUrl(
                                appendQuery(res["data"], {
                                    "userCardActPrice":url["userCardActPrice"]
                                }), 'blank');
                        },
                        "onError": function (res) {
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
            touch.on(nodeList.price, "tap", evtFuncs.seatNext);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            updateNum: function(arr) {
                if (arr.length > 0) {
                    seatArr = arr;
                    nodeList.price.style.display = "block";
                    nodeList.price.innerHTML = '确定 <span>¥</span>&nbsp;' + parseFloat(opts["prices"])* arr.length;
                } else {
                    nodeList.price.style.display = "none";
                }
            }
        }


        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            url = queryToJson(URL.parse(location.href)["query"]);
            data = _data;
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.updateNum = custFuncs.updateNum;
        return that;
    }
});
