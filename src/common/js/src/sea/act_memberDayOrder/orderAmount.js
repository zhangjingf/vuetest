/**
 *
 *支付跳转
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var each = require("lib/util/each");
    var showMessage = require("sea/showMessage");
    var ajax = require("lib/io/ajax");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    var loading = require("sea/dialog/loading");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var payOrderUrl = null;/*跳转支付地址*/
        var m_loading = null;
        var couponNum = null;/*购买优惠票数*/

        //---------------事件定义----------------
        var evtFuncs = {
            payOrder: function () {
                if(payOrderUrl) {
                    webBridge.openUrl(payOrderUrl+"&couponNum="+couponNum);
                } else {
                    showMessage("请选择支付方式！");
                }

            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_loading = loading();
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(node, "tap", evtFuncs.payOrder);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            payOrder: function (data) {
                /*去支付链接由这个函数置换，*/
                if(!data) {
                    payOrderUrl = null;
                }
                if(data.hasOwnProperty("href")) {
                    payOrderUrl = data.href;
                }else if (data.hasOwnProperty("src")){
                    webBridge.openUrl(data.src);
                    return;
                }
            },
            couponNum: function (data) {
                couponNum = data;
            }
        };

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            data = _data;
            couponNum = opts["pageInt"]["couponNum"];
            modInit();
            bindEvents();
        }
        //-----------------暴露各种方法-----------
        that.init = init;
        that.payOrder = custFuncs.payOrder;
        that.couponNum = custFuncs.couponNum;
        return that;
    }
});
