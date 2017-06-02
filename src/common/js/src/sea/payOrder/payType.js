/**
 *
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var ajax = require("lib/io/ajax");
    var closest = require("lib/dom/closest");
    var webBridge = require("sea/webBridge");
    var showMessage = require("sea/showMessage");
    var when = require("lib/util/when");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var countType = 0;
        var prevType = -1;
        var countDownTime = '0分0秒';

        //---------------事件定义----------------
        var evtFuncs = {
            selectPayType: function(ev) {
                /*
                 * 0----虚拟会员
                 * 1----尊享卡
                 * 2----影城会员卡
                 * 3----电子券
                 * 4----优惠券
                 * */
                var typeNode = closest(ev.target, "[data-type]", node);

                if (typeNode == null) { return; }

                var type = parseInt(typeNode.getAttribute("data-type"), 10);

                prevType = type;
                if (type == 1) {
                    nodeList.iconGuiCard.classList.add('selected');
                }
                custFuncs.checkOvertime()
                    .then(function() {
                        switch (type) {
                            case 0:
                                that.fire("payGui", {
                                    index: 0,
                                    cardNo: typeNode.getAttribute('data-status'),
                                    url: typeNode.getAttribute('data-href'),
                                    title: typeNode.getAttribute('data-title')
                                });
                                break;
                            case 1:
                                if (opts["guimemberSataus"] == "0") { /*无尊享卡*/
                                    that.fire("payGui", {
                                        index: 1,
                                        cardNo: typeNode.getAttribute('data-card'),
                                        url: typeNode.getAttribute("data-href"),
                                        guiStatus: typeNode.getAttribute("data-guistatus"),
                                        title: typeNode.getAttribute('data-title')
                                    });
                                }
                                if (opts["guimemberSataus"] == "1") { /*有尊享卡*/
                                    that.fire("payGui", {
                                        index: 1,
                                        cardNo: typeNode.getAttribute('data-card'),
                                        url: typeNode.getAttribute("data-href"),
                                        title: typeNode.getAttribute('data-title')
                                    });
                                }
                                break;
                            case 2:
                                that.fire("payGui", {
                                    index: 2,
                                    cardNo: typeNode.getAttribute('data-card'),
                                    url: typeNode.getAttribute('data-href'),
                                    title: typeNode.getAttribute('data-title')
                                });
                                break;
                            case 3:
                                that.fire("payGui", {
                                    //index: -1
                                    index: 3,
                                    url: typeNode.getAttribute('data-href'),
                                    title: typeNode.getAttribute('data-title')

                                });
                                break;
                            case 4:
                                that.fire("payGui", {
                                    //index: -1
                                    index: 4,
                                    url: typeNode.getAttribute('data-href'),
                                    title: typeNode.getAttribute('data-title')
                                });
                                break;
                            default:
                                return;
                        }
                    });
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
                touch.on(node, "tap", "[data-type]", evtFuncs.selectPayType);
                //touch.on(node, "tap", "[node-name=vMember]", evtFuncs.jumpPage);
            }
            //-----------------自定义函数-------------
        var custFuncs = {
            /*检测订单是否超时*/
            checkOvertime: function() {
                that.fire("getCountDownTime", '要获取倒计时时间了');
                if (countDownTime == "0分0秒") {
                    var defer = when.defer();
                    var param = {
                        "orderNo": opts["orderNo"]
                    };
                    ajax({
                        "url": opts["checkOrderApi"],
                        "method": "post",
                        "data": param,
                        "onSuccess": function(res) {
                            if (res["status"] != '1') {
                                showMessage(res["msg"]);
                                defer.reject();
                                return;
                            }
                            if (res["data"]["status"] == 1) { /*未支付*/
                                showMessage("订单已超时!", function() {
                                    webBridge.close(1);
                                    //webBridge.openUrl(opts["urlShowTime"]+"&cancelOrder");
                                    //webBridge.openUrl(opts["urlShowTime"]+'&from=payOrder&notbackpressed');/*跳到排期页面*/
                                });
                                defer.reject();
                                return;
                            }
                        },
                        "onError": function(req) {
                            console.log("网络连接失败（" + req.status + ")");
                            defer.reject("网络连接失败（" + req.status + ")");
                        }
                    });
                    return defer.promise;
                } else { 
                    /*时间没有过期*/
                    var deferNoOutTime = when.defer();
                    deferNoOutTime.resolve();
                    return deferNoOutTime.promise;
                }
            },
            /*取消样式*/
            cancelStyle: function() {
                nodeList.iconGuiCard.classList.remove('selected');
            },
            /*刷新变量countType*/
            flushCountType: function() {
                prevType = -1;
            },
            getCountDownTime: function(data) {
                countDownTime = data;
            }
        };

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.cancelStyle = custFuncs.cancelStyle;
        that.flushCountType = custFuncs.flushCountType;
        that.getCountDownTime = custFuncs.getCountDownTime; //获取倒计时时间
        return that;
    }
});