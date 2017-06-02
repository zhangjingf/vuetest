/**
 * 我的钱包 选择卡
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");

    var showMessage = require("sea/showMessage");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            /*/!*虚拟会员卡*!/
            openXNCard: function () {
                webBridge.openUrl("virtualMemberFill.html", "blank");
            },
            /!*影城会员卡*!/
            openYCPage: function () {
                webBridge.openUrl("bindCinemaCard.html", "blank");
            },
            /!*尊享卡*!/
            openZXPage: function () {
                webBridge.openUrl("bindGuiCard.html", "blank");
            },
            /!*电子券*!/
            openEleTicket: function () {
                webBridge.openUrl("myTicket.html", "blank");
            },
            /!*优惠券*!/
            openCoupon: function () {
                webBridge.openUrl("myCoupon.html", "blank");
            }*/
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------事件绑定---------------
        var bindEvents = function() {
            /*touch.on(nodeList.virtualCard, "tap", evtFuncs.openXNCard);
            touch.on(nodeList.ycCard, "tap", evtFuncs.openYCPage);
            touch.on(nodeList.zxCard, "tap", evtFuncs.openZXPage);
            touch.on(nodeList.eleTicket, "tap", evtFuncs.openEleTicket);
            touch.on(nodeList.coupon, "tap", evtFuncs.openCoupon);*/
        }

        //---------------自定义函数---------------
        var custFuncs = {}

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});