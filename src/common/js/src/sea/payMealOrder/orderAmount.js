/**
 *
 *单独卖品支付订单所有支付方式都在这个函数处理
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var each = require("lib/util/each");
    var showMessage = require("sea/showMessage");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    //var ajax = require('lib/io/ajax');
    var loading = require("sea/dialog/loading");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var payTypeUrl = null;/*影城支付方式的支付链接*/
        var payOrderUrl = null;/*第三方支付的支付订单链接*/
        var m_loading = null;
        var countTime = '0分0秒';/*倒计时时间*/

        //---------------事件定义----------------
        var evtFuncs = {
            payOrder: function (ev) {
                that.fire("getCountTime",{});
                if(countTime=='0分0秒') {
                    showMessage("订单超时!");
                    return;
                }
                webBridge.openUrl(nodeList.payOrder.getAttribute("data-href"));
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
            touch.on(nodeList.payOrder, "tap", evtFuncs.payOrder);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            payOrder: function (data) {
                /*去支付链接由这个函数置换，*/
                that.fire("getCountTime",{});
                if(countTime=='0分0秒') {
                    showMessage("订单已超时!");
                    return;
                }
                switch(data.payType) {
                    case "cinemaMemberCard" :/*影城会员卡*/
                        webBridge.openUrl(data.payOrderUrl);

                        break;
                    case 'virtualMemberCard':/*虚拟会员卡*/
                        webBridge.openUrl(data.payOrderUrl);
                        break;
                    default :/*空值处理,其他处理*/

                        return;
                }
            },
            timeChange: function (count) {
                /*获取倒计时时间*/
                countTime = count;
                //console.log(countTime)
            }
        };

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            payOrderUrl = nodeList.payOrder.getAttribute("data-href");/*第三方支付地址*/
            data = _data;
            modInit();
            bindEvents();
        }
        //-----------------暴露各种方法-----------
        that.init = init;
        that.payOrder = custFuncs.payOrder;
        that.timeChange = custFuncs.timeChange;
        return that;
    }
});
