/**
 * 两种支付结果
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var webBridge = require("sea/webBridge");
    var showMessage = require("sea/showMessage");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            goIndex: function (ev) {
                if(nodeList.goIndex.getAttribute("data-form") == "memberDay") {
                    /*webBridge.openUrl(nodeList.goIndex.getAttribute("data-href"),"self",
                        {"title":"会员日活动_memberday/index",
                          "style":"5",
                          "controllertype":"share"
                        }
                    );*/
                    webBridge.openUrl(nodeList.goIndex.getAttribute("data-href")+'&from=actPayResult',"blank");/*返回活动页面*/
                    //webBridge.close(2);
                } else {
                    webBridge.popToSelectedController("homePage");
                }

            },
            goOrder: function () {
                /*var href = nodeList.goOrder.getAttribute("data-href");
                webBridge.openUrl(href+'&form=payResult',"blank",{
                    "title": "我的影票_order/order"
                });*/
                var href = nodeList.goOrder.getAttribute("data-href");
                webBridge.openUrl(href+'&form=payResult',"blank");/*查看钱包*/
                //webBridge.close(1);
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {

        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            if(!!nodeList.goIndex) {
                touch.on(nodeList.goIndex, "tap", evtFuncs.goIndex);
            }
            if(!!nodeList.goOrder) {
                touch.on(nodeList.goOrder, "tap", evtFuncs.goOrder);
            }
            webBridge.onBackPressed = function() {
                evtFuncs.goOrder();
                var isIPhone = navigator.appVersion.match(/iphone/gi);
                if (isIPhone) {
                    return "turnBackSucceed";
                }
            }
        }

        //-----------------自定义函数-------------
        var custFuncs = {
           /* initView: function () {
                if(opts["url"]["from"]=='applePay') {
                    nodeList.applePay.style.display = "inherit";
                    nodeList.payment.innerHTML = opts["url"]["payment"];
                }
            }*/
        }

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
            //custFuncs.initView();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});