/**
 * 电子券支付 模块
 * 电子券验证
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var className = require("lib/dom/className");
    var ajax = require("lib/io/ajax");

    var touch = require("touch");
    var closest = require("lib/dom/closest");
    var webBridge = require("sea/webBridge");
    var appendQuery = require("lib/str/appendQuery");
    var each = require("lib/util/each");
    var loading = require("sea/dialog/loading");
    var showMessage = require("sea/showMessage");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var useableTicket = "";
        var ticketNos = "";
        var m_loading = null;
        //---------------事件定义----------------
        var evtFuncs = {
            inputNum: function () {
                var text = nodeList.inputNo.value;
                if (text.length > 11 && text.length < 21) {
                    className.remove(nodeList.addMark, "add");
                    className.add(nodeList.addMark, "well");
                } else {
                    className.add(nodeList.addMark, "add");
                    className.remove(nodeList.addMark, "well");
                }
            },
            addMark: function() {
                if (!className.has(nodeList.addMark, "well")) {
                    return;
                }
                className.add(nodeList.addMark, "add");
                className.remove(nodeList.addMark, "well");
                className.remove(nodeList.btn, "m-pay-bt-gray");
                var ticketNo = nodeList.inputNo.value;
                nodeList.inputNo.value = "";
                var html = '<div class="row" node-name="myTicket" data-ticketNo="' + ticketNo + '">\
                                <div class="number">' + ticketNo + '</div>\
                                <div class="state">未知</div>\
                                <div class="type">电子券待验证</div>\
                                <div class="btn" node-name="del">﹣</div>\
                            </div>';
                nodeList.list.innerHTML += html;
                nodeList = parseNode(node);


                className.remove(nodeList.btn, 'im-pay');
                nodeList.btn.innerHTML = "验证";
                className.add(nodeList.tipFirst, "hidden");
                className.add(nodeList.tipSecond, "show");
                nodeList.tipSecond.innerHTML = '可用电子券 <em node-name="ticketAmount">0</em>张,其中<em>显示可用状态</em>的将用于本次支付';
            },
            del: function (ev) {
                var target = ev.target;
                var pNode = closest(target, "[node-name=del]", node);
                if (pNode == null) {
                    return;
                }
                pNode = pNode.parentNode;
                var parNode = parseNode(pNode);
                var nodeStatusRemark = parNode.statusRemark.innerHTML;
                var ppNode = pNode.parentNode;
                pNode.remove();
                nodeList = parseNode(node);
                /* 将电子券删除到没有的情况 */
                if (nodeList.myTicket == undefined || nodeList.myTicket.length == 0 || ppNode.childNodes.length == 0) {
                    className.add(nodeList.btn, "m-pay-bt-gray");
                    nodeList.btn.innerHTML = "验证";
                    className.remove(nodeList.btn, "im-pay");
                    nodeList.tipSecond.innerHTML = '可用电子券 <em node-name="ticketAmount">0</em>张,其中<em>显示可用状态</em>的将用于本次支付';
                    return ;
                }
                if (nodeStatusRemark == "正常") {
                    nodeList.btn.innerHTML = "验证";
                    className.remove(nodeList.btn, "im-pay");
                    nodeList.tipSecond.innerHTML = '请点击验证,进行验证!';
                }
            },
            checkTicket: function(){
                if (className.has(nodeList.btn, "m-pay-bt-gray")) {
                    return ;
                }
                if (className.has(nodeList.btn, "im-pay")) {
                    custFuncs.loadPay(useableTicket);
                } else {
                    var ticketNosNew = "";
                    if (nodeList.myTicket instanceof Array) {
                        each(nodeList.myTicket, function (item, index) {
                            ticketNosNew += item.getAttribute("data-ticketNo")+",";
                        });
                    } else {
                        ticketNosNew += nodeList.myTicket.getAttribute("data-ticketNo")+',';
                    }
                    /* 处理点击验证了，还点击验证 */
                    if (ticketNos == ticketNosNew) {
                        showMessage("你现在输入的电子券不可以哦~，请输入<br/>新的电子券再试试吧");
                        return;
                    } else {
                        ticketNos = ticketNosNew;
                        custFuncs.loadCheckData(ticketNos);
                    }
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
            touch.on(nodeList.inputNo, "input", evtFuncs.inputNum);
            touch.on(nodeList.addMark, "tap", evtFuncs.addMark);
            touch.on(nodeList.list, "tap", "[node-name=del]", evtFuncs.del);
            touch.on(nodeList.btn, "tap", evtFuncs.checkTicket);

        }

        //-----------------自定义函数-------------
        var custFuncs = {
            /* 展示选中的电子券 */
            showTicket : function (param) {
                ticketNos = "";
                className.add(nodeList.tipFirst, "hidden");
                className.add(nodeList.tipSecond, "show");
                className.remove(nodeList.btn, "m-pay-bt-gray");
                var arr = param.split(',');
                var html = "";
                for (var i = 1; i<arr.length; i++ ) {
                    html += '<div class="row" node-name="myTicket" data-ticketNo="' + arr[i] + '">\
                                <div class="number">' + arr[i] + '</div>\
                                <div class="state">未知</div>\
                                <div class="type" node-name="statusRemark">电子券待验证</div>\
                                <div class="btn" node-name="del">﹣</div>\
                            </div>'
                }
                nodeList.list.innerHTML = html;
                nodeList = parseNode(node);
                nodeList.btn.innerHTML = "验证";
                className.remove(nodeList.btn, "im-pay");
                nodeList.tipSecond.innerHTML = '可用电子券 <em node-name="ticketAmount">0</em>张,其中<em>显示可用状态</em>的将用于本次支付';
            },
            /* 验证电子券 */
            loadCheckData : function (ticketNos) {
                if(that.isLock()){
                    return;
                }
                ticketNos = ticketNos.substr(0, ticketNos.length-1);
                var param = {
                    "orderNo": opts["orderNo"],
                    "tickets": ticketNos
                };
                that.lock();
                ajax({
                    "url": opts["checkEleTicketUrl"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function(res) {
                        that.unLock();
                        if (res["status"] == 0) {
                            console.error( res["msg"]);
                            showMessage(res["msg"]);
                            return;
                        }
                        var html = "";
                        var ticketNumber = 0;/*可使用的电子券数目*/
                        useableTicket = "";/*可使用的电子券号*/
                        /*验证电子券*/
                        each(res["data"].items, function (item, index) {
                            if (item.status == 1) {
                                useableTicket += item.ticketNo +',';
                                ticketNumber ++;
                            }
                            html += '<div class="row" node-name="myTicket" data-ticketStatus="'+ item.status +'" data-ticketNo="' + item.ticketNo + '">\
                                        <div class="number">' + item.ticketNo + '</div>\
                                        <div class="state">' + item.showType + '</div>\
                                        <div class="type" node-name="statusRemark">' + item.statusRemark + '</div>\
                                        <div class="btn" node-name="del">﹣</div>\
                                    </div>';
                        });
                        if (ticketNumber != 0) {
                            nodeList.btn.innerHTML = '立即使用';
                            className.add(nodeList.btn, 'im-pay');
                        } else {
                            nodeList.btn.innerHTML = '验证';
                            className.remove(nodeList.btn, 'im-pay');
                        }
                        useableTicket = useableTicket.substr(0,useableTicket.length-1);/*可以使用的电子券号码*/
                        /*对用户补价的提示*/
                        var ticketPrice = parseFloat(res["data"].spreadPrice).toFixed(2);/*电影票补差价*/
                        var sellPrice = parseFloat(res["data"].sellPrice).toFixed(2);/*卖品补差价*/
                        var htmlbc = "";
                        if ((res["data"].spreadPrice + res["data"].sellPrice) > 0.00) {/*需要补差*/
                            if (ticketPrice > 0.00) {
                                /*票价需要补差*/
                                htmlbc = '可用电子券 <em node-name="ticketAmount">' + ticketNumber + '</em>张,其中<em>显示可用状态</em>的将用于本次支付</br>\
                                          使用电子券后，还需要补差价<em>' + ticketPrice + '元</em>';
                            }
                            if (sellPrice > 0.00) {
                                /*卖品需要补差*/
                                htmlbc = '可用电子券 <em node-name="ticketAmount">' + ticketNumber + '</em>张,其中<em>显示可用状态</em>的将用于本次支付</br>使用电子券支付后，您还需要补差价，其中:</br>\
                                          对影票补差价:<em>' + ticketPrice + '元</em></br>\
                                          对卖品补差价:<em>' + sellPrice + '元</em></br>\
                                          您这笔订单共需要补差价:<em>' + parseFloat((res["data"].spreadPrice + res["data"].sellPrice).toFixed(2)) + '元</em>';
                            }
                        } else {
                            /*不需要补差*/
                            htmlbc = '可用电子券 <em node-name="ticketAmount">' + ticketNumber + '</em>张,其中<em>显示可用状态</em>的将用于本次支付';
                        }
                        nodeList.tipSecond.innerHTML = htmlbc;
                        nodeList.list.innerHTML = html;
                        nodeList = parseNode(node);
                    },
                    "onError": function(req) {
                        console.error("网络连接失败:" + req.status);
                    }
                });
            },
            /*电子券支付*/
            loadPay : function (unusedTicket) {
                if(that.isLock()) {
                    return ;
                }
                var param = {
                    "orderNo": opts["orderNo"],
                    "tickets": unusedTicket
                };

                that.lock();
                m_loading.show();
                ajax({
                    "url": opts["payEleTicketUrl"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function(res) {
                        that.unLock();

                        that.fire('payed');
                        m_loading.hide();
                        if (res["status"] != "1") {
                            showMessage(res["msg"]);
                            console.error( res["msg"]);
                            return;
                        }

                        if (res["data"]["orderStatus"] == "3") {//已支付
                            webBridge.openUrl(appendQuery(res["data"]["url"], {
                                "orderno": res["data"]["orderNo"]
                            }) ,"blank", {
                                "title": "支付结果_pay/result",
                                "style": "4"
                            });
                        } else {
                            webBridge.openUrl(appendQuery(res["data"]["url"], {
                                "payment": res["data"]["spreadPrice"],
                                "orderTime": res["data"]["orderTime"],
                                "orderPrice": res["data"]["orderPrice"],
                                "orderNo": res["data"]["orderNo"],
                                "orderno": res["data"]["orderNo"],
                                "chargePrice": res["data"]["cmcc_ChargePrice"],
                                "payType": "CouponTicketPay",
                                "notbackpressed":''
                            }), "blank", {
                                "title": "支付订单_pay/type",
                                "controllertype": "payment"
                            });
                        }
                    },
                    "onError": function(req) {
                        that.unLock();
                        m_loading.hide();
                        that.fire('payed');
                        console.error("网络连接失败:" + req.status);
                    }
                });
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
        that.showTicket = custFuncs.showTicket;

        return that;
    }
});