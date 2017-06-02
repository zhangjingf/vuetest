/**
 *
 *  约影爱好
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var webBridge = require("sea/webBridge");
    var ajax = require("lib/io/ajax");
    var toast = require("sea/toast");
    var storageMessager = require("lib/evt/storageMessager");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var pageNode = null;
    var typeData = [];

    //---------------事件定义----------------
    var evtFuncs = {
        clear: function () {
            pageNode.weChatNumber.value = '';
        },
        inputWeChat: function () {
            if (pageNode.weChatNumber.value.length > 12) {
                pageNode.weChatNumber.value = pageNode.weChatNumber.value.substr(0, 12);
                toast("最多输入12个字");
            }
        }
    }

    //---------------子模块定义---------------
    var modInit = function () {
    }

    //-----------------绑定事件---------------
    var bindEvents = function () {
        touch.on(pageNode.clear, "tap", evtFuncs.clear);
        pageNode.weChatNumber.addEventListener("input", evtFuncs.inputWeChat);

        webBridge.clickRightEnsure = function () {
            custFuncs.clickRight();
        }
    }

    //-----------------自定义函数-------------
    var custFuncs = {
        clickRight: function () {
            var _WeiXin = pageNode.weChatNumber.value;
            if (_WeiXin.length < 1) {
                toast("微信号不能为空");
                return;
            }
            if (that.isLock()) {
                return;
            }
            that.lock();
            ajax({
                "url": opts["setDataUrl"],
                "method": "post",
                "data": {
                    "WeiXin": _WeiXin
                },
                "onSuccess": function (res) {
                    that.unLock();
                    if (res["status"] == 0) {
                        toast(res.msg);
                        console.log(res.msg);
                        return;
                    }
                    toast(res.msg);
                    storageMessager.send("yyWeChat", {WeiXin: _WeiXin});
                    setTimeout(function () {
                        webBridge.close();
                        var isIPhone = navigator.appVersion.match(/iphone/gi);
                        if (isIPhone) {
                            return "turnBackSucceed";
                        }
                    }, 800)
                },
                "onError": function (req) {
                    that.unLock();
                    console.error("操作失败，状态码：" + req["status"]);
                }
            })
        }
    }

    //-----------------初始化----------------
    var init = function (_opts) {
        opts = _opts || {};

        nodeList = {
            main: queryNode("#m_main")
        }
        pageNode = parseNode(nodeList.main);
        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});