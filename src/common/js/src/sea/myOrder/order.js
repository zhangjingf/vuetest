/**
 *
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var closest = require("lib/dom/closest");
    var each = require("lib/util/each");
    var swiper = require("swiper");
    var ajax = require("lib/io/ajax");
    var showMessage = require("sea/showMessage");
    var notice = require("sea/dialog/notice");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    var util = require("sea/utils");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_swiper = null;
        var countDown = 15;
        //---------------事件定义----------------
        var evtFuncs = {
            cancelOrder: function(ev) {
                var li = closest(ev.target, "[data-orderNo]", node);
                var orderNo = li.getAttribute("data-orderNo");
                var exchangeFlag = ev.target.getAttribute("data-exchangeFlag");
                custFuncs.cancelOrder(orderNo,exchangeFlag);

            },
            payOrder: function(ev) {
                if(nodeList.overTime[0].innerHTML == "0分0秒") {
                    showMessage("订单已超时");
                    webBridge.openUrl(util.getCurrentURL(), 'self');
                    return;
                }
                var li = closest(ev.target, "[data-orderNo]", node);
                var orderNo = li.getAttribute("data-orderNo");
                if (eval('/' + orderNo + '/').test(localStorage.getItem("outstandingOrderUrl"))) {
                    webBridge.openUrl(localStorage.getItem("outstandingOrderUrl")+"&from=myOrder", "black");
                }
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            if (nodeList.cancelOrder) {
                touch.on(nodeList.cancelOrder, "tap", evtFuncs.cancelOrder);
                touch.on(nodeList.payOrder, "tap", evtFuncs.payOrder);
            }
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            initSwiper: function() {
                m_swiper = new swiper(".order-swiper", {
                    "speed": 500,
                    "touchMoveStopPropagation": false,
                    "autoHeight": true,
                    "onSlideChangeStart": function() {
                        that.fire("slideChange", {
                            "index": m_swiper.activeIndex
                        });
                    }
                });
            },
            slideChange: function(index) {
                m_swiper.slideTo(index);
            },

            cancelOrder: function(orderNo,exchangeFlag) {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                var param = {
                    "orderNo": orderNo,
                    "exchangeFlag": exchangeFlag
                };
                ajax({
                    "url": opts["cancelOrder"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function(res) {
                        that.unLock();
                        if (res["status"] != 1) {
                            showMessage(res["msg"]);
                            return;
                        }
                        each(nodeList.waitPay, function (item) {
                            item.remove();
                        })
                        var showNotice = notice(res["msg"]);
                        showNotice.init();
                        showNotice.show();
                        setTimeout(showNotice.hide,2000);
                        that.fire("publish",res["data"]);

                    },
                    "onError": function(req) {
                        that.unLock();
                        console.error("网络连接失败:" + req.msg);
                    }
                });
            },
            initView: function () {
                custFuncs.initSwiper();
                if(nodeList.overTime) {
                    custFuncs.countDown();
                }
            },
            countDown: function () {
                var timeDifference = countDown*60;
                var _lastDate = parseInt(nodeList.overTime[0].getAttribute("data-overTime").substr(0,2))*60+parseInt(nodeList.overTime[0].getAttribute("data-overTime").substr(2,2));
                timeDifference = timeDifference - _lastDate;
                if(timeDifference<=0) {
                    nodeList.time.innerHTML = '0分0秒';
                    return;
                }
                var _countDown = setInterval(function () {
                    var _str = '';
                    timeDifference--;
                    _str += Math.floor(timeDifference/60)+'分';
                    _str += timeDifference%60+'秒';
                    if(timeDifference>=0) {
                        each(nodeList.overTime, function (item) {
                            item.innerHTML = _str;
                        })
                        //nodeList.overTime.innerHTML = _str;
                    } else {
                        window.clearInterval(_countDown);
                    }
                },1000)
            }
        }


        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
            custFuncs.initView();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.swiper = custFuncs.slideChange;
        that.cancelOrder = custFuncs.cancelOrder;
        return that;
    }
});
