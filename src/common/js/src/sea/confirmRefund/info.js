/**
 *订单详情
 *
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var ajax = require("lib/io/ajax");
    var webBridge = require("sea/webBridge");
    var loading = require("sea/dialog/loading");
    var showMessage = require("sea/showMessage");
    var closest = require("lib/dom/closest");
    var className = require("lib/dom/className");
    var each = require("lib/util/each");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_loading = null;

        //---------------事件定义----------------
        var evtFuncs = {
            changeRefundType: function (ev) {
                var refundTypeNode = closest(ev.target, "[data-type]", nodeList.refundTypeAll);
                var refundType = parseInt(refundTypeNode.getAttribute("data-type"), 10);
                className.toggle(refundTypeNode.lastElementChild,"selected");

            },
            confirmRefund: function () {
                var RefundTypeArr =nodeList.choice;
                var content ='';
                each(RefundTypeArr, function (item) {
                    if(className.has(item,"selected")){
                        content+= item.getAttribute("data-content")+'_';
                    }
                });
                content = content.substr(0,content.length-1);
                if(content=='') {
                    showMessage("请至少选择一项退款原因！");
                    return;
                }
                custFuncs.confirmRefund(content);
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
            touch.on(nodeList.refundType,"tap",evtFuncs.changeRefundType);
            touch.on(nodeList.confirmRefund,"tap",evtFuncs.confirmRefund);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            confirmRefund: function (content) {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                m_loading.show();
                var param = {
                    "orderNo": opts["orderNo"],
                    "cinemaNo":  opts["cinemaNo"],
                    "integralNum": opts["integralNum"],
                    "orderPrice": opts["orderPrice"],
                    "curPayChannel" : opts["curPayChannel"],
                    "backDesc": content
                };
                if(opts["isSeller"] == '1') {
                    param['isSeller'] = '1';
                }
                ajax({
                    "url": opts["orderBack"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        m_loading.hide();
                        if (res["status"] != 1) {
                            showMessage(res.msg);
                            return;
                        }
                        webBridge.openUrl(res["data"]["url"]);
                    },
                    "onError": function (req) {
                        that.unLock();
                        m_loading.hide();
                        console.error("网络连接失败:" + req.msg);
                    }
                });
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
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