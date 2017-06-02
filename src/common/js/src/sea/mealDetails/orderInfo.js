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
    //var each = require("lib/util/each");
    var loading = require("sea/dialog/loading");
    var showMessage = require("sea/showMessage");
    //var dialogRemind = require("sea/orderDetails/dialogRemind");
    //var jsonToQuery = require("lib/json/jsonToQuery");

    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_loading = null;

        //---------------事件定义----------------
        var evtFuncs = {
            refund: function (ev) {
                //	退票
                custFuncs.backChangeRule("0");
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_loading = loading('加载中，请稍后');
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            if (!!nodeList.refund) {
                touch.on(nodeList.refund, "tap", evtFuncs.refund);
            }
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            backChangeRule: function (actionType) {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                m_loading.show();
                var param = {
                    "isSeller":'1',
                    "actionType":actionType,
                    "orderNo": opts["orderNo"],
                    "cinemaNo":  opts["cinemaNo"],
                    "orderPrice": opts["orderPrice"]
                }
                ajax({
                    "url": opts["backChangeRule"],
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