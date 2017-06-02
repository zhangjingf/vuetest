/**
 * 支付结果页面
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var payResult = require("sea/payResult/payResult");
    var webBridge = require('sea/webBridge');
    var ajax = require("lib/io/ajax");
    var alertPower = require("sea/payResult/alertPower");
    var touch = require("touch");
    var virtualLink = require("lib/util/virtualLink");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_payResult = null;

    //---------------事件定义----------------
    var evtFuncs = {
        payPowerLink: function () {
            webBridge.openUrl(nodeList.m_payPower.getAttribute("data-href"));
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        m_payResult = payResult(nodeList.m_payResult, opts);
        m_payResult.init();
        virtualLink('data-src');

    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        if(nodeList.m_payPower) {
            touch.on(nodeList.m_payPower,"tap",evtFuncs.payPowerLink);
        }

    }

    //-----------------自定义函数-------------
    var custFuncs = {
        initView: function () {
            webBridge.close(2);
            ajax({
                "url": opts["getmemberprivilegememo"],
                "method": "post",
                "onSuccess": function (res) {
                    if (res["status"] != 1) {
                        console.log(res["msg"]);
                        return;
                    }
                    if (res["data"]["isOver"] != '1'  && (parseInt(res["data"]["SendMaxNum"]) > parseInt(res["data"]["hasConvertAmount"]))) {
                        if(res["data"]["privilegeNeedNum"] == 0) {
                            var dialog = alertPower('已购满'+res["data"]["BuyAmount"]+'张票，可获赠'+res["data"]["SendNum"]+'张优惠观影券<br>观影券将在观影结束后24小时内<br>发放到您的钱包，<span node-name="link">查看详情>>' , {'linkUrl':opts["linkUrl"]});
                            dialog.init();
                            dialog.show();
                        } else {
                            nodeList.m_payPower.style.display = 'inherit';
                            nodeList.m_payPower.innerHTML = '<div>再购买'+res["data"]["privilegeNeedNum"]+'张即可获得优惠观影券 ></div>';
                        }
                    }
                },
                "onError": function (req) {
                    that.unLock();
                    console.error("网络连接失败:" + req["status"]);
                }
            });
        }
    }

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts;
     /*   opts.url = queryToJson(URL.parse(location.href)["query"]);    getmemberprivilegememo*/
        nodeList = {
            m_payResult: queryNode("#m_payResult"),
            m_payPower: queryNode("#m-payPower")
        }

        modInit();
        bindEvents();

        custFuncs.initView();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});