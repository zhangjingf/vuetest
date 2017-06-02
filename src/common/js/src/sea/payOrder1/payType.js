/**
 *选择支付方式
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var closest = require("lib/dom/closest");
    var webBridge = require("sea/webBridge");
    var each = require("lib/util/each");
    var showMessage = require("sea/showMessage");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var payOrderUseDataPackage = JSON.parse(opts["payOrderUseDataPackage"]);
        var payType = 0;//第三方支付

        //---------------事件定义----------------
        var evtFuncs = {
            selectPayType: function (ev) {
                /*
                 * 0----虚拟会员
                 * 1----尊享卡
                 * 2----影城会员卡
                 * 3----电子券
                 * 4----优惠券
                 * */
                var typeNode = closest(ev.target, "[data-type]", node);
                if (typeNode == null) {
                    return;
                }
                var type = parseInt(typeNode.getAttribute("data-type"), 10);//优惠支付方式
                var hasCard = parseInt(typeNode.getAttribute("data-hasCard"), 10);//1有卡，0无卡；
                if ((hasCard == '0' || hasCard == '2')) {
                    webBridge.openUrl(typeNode.getAttribute('data-href'));

                } else if (hasCard == '1') {
                    var childrenNodes = parseNode(typeNode);
                    //payType = payType == type ? 0 : type;//有bug
                    if (type == 2 && (payOrderUseDataPackage["guiCardInfo"]["cardPayment"] == 0 || payOrderUseDataPackage["guiCardInfo"]["cardPayment"]== '')) {
                        //该尊享卡不支持改影院
                        showMessage(payOrderUseDataPackage["guiCardInfo"]["statusRemark"]);
                        return;
                    }
                    each(nodeList.radioBox, function (item) {
                        if (item == childrenNodes.radioBox) {
                            return;
                        }
                        item.classList.remove("checked");
                    });
                    var _checkFlg = childrenNodes.radioBox.classList.toggle("checked");//操作后存在checked返回true，不存在返回false，
                    if(_checkFlg) {
                        payType = type;
                    } else  {
                        payType = 0;
                    }
                    that.fire('payType', {"payType": payType});
                }

            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(node, "tap", "[data-type]", evtFuncs.selectPayType);
        }
        //-----------------自定义函数-------------
        var custFuncs = {
            reloadShowData: function (data) {
                if (data == 1) {
                    //有选择会员特惠
                    if (payOrderUseDataPackage["virtualCardInfo"]["hasCard"] == '1' && payOrderUseDataPackage["virtualCardInfo"]["isAct"] == '1') {
                        nodeList.saveMoneyA.innerHTML = '省' + (payOrderUseDataPackage["virtualCardInfo"]["actDiscount"] ? payOrderUseDataPackage["virtualCardInfo"]["actDiscount"] : 0 ) + '元';
                    };
                    if (payOrderUseDataPackage["guiCardInfo"]["hasCard"] == '1' && payOrderUseDataPackage["guiCardInfo"]["isAct"] == '1') {
                        nodeList.saveMoneyB.innerHTML = '省' + (payOrderUseDataPackage["guiCardInfo"]["actDiscount"] ? payOrderUseDataPackage["guiCardInfo"]["actDiscount"] : 0) + '元';
                    };
                    if (payOrderUseDataPackage["memberCardInfo"]["hasCard"] == '1' && payOrderUseDataPackage["memberCardInfo"]["isAct"] == '1') {
                        nodeList.saveMoneyC.innerHTML = '省' + (payOrderUseDataPackage["memberCardInfo"]["actDiscount"] ? payOrderUseDataPackage["memberCardInfo"]["actDiscount"] : 0) + '元';
                    };

                } else {
                    //没有有选择会员特惠
                    if (payOrderUseDataPackage["virtualCardInfo"]["hasCard"] == '1') {
                        nodeList.saveMoneyA.innerHTML = '省' + (payOrderUseDataPackage["virtualCardInfo"]["discount"] ? payOrderUseDataPackage["virtualCardInfo"]["discount"] : 0 ) + '元';
                    };
                    if (payOrderUseDataPackage["guiCardInfo"]["hasCard"] == '1') {
                        nodeList.saveMoneyB.innerHTML = '省' + (payOrderUseDataPackage["guiCardInfo"]["discount"] ? payOrderUseDataPackage["guiCardInfo"]["discount"] : 0) + '元';
                    };
                    if (payOrderUseDataPackage["memberCardInfo"]["hasCard"] == '1') {
                        nodeList.saveMoneyC.innerHTML = '省' + (payOrderUseDataPackage["memberCardInfo"]["discount"] ? payOrderUseDataPackage["memberCardInfo"]["discount"] : 0) + '元';
                    };
                }
            }
        };

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.reloadShowData = custFuncs.reloadShowData;
        return that;
    }
});