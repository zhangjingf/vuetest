define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var className = require("lib/dom/className");
    var ajax = require("lib/io/ajax");
    var toast = require("sea/toast");
    var touch = require("touch");
    var modifyVipbirthday = require("sea/dialog/modifyVipbirthday");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_dialog = null;
        var flag = false;

        //---------------事件定义----------------
        var evtFuncs = {}

        //---------------子模块定义---------------
        var modInit = function () {
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.submit, "tap", custFuncs.submit);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            submit: function () {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                if ( (opts["statusBtn"] != 1) || flag ) {
                    return;
                }
                ajax({
                    "url": opts["dobirthday"],
                    "method": "post",
                    "onSuccess": function (res) {
                        that.unLock();
                        flag = true;
                        if ((res["status"] != 1) ) {
                            toast(res["msg"], 1000);
                            return;
                        }
                        if( res["data"] == null) {
                            return;
                        }
                        m_dialog = modifyVipbirthday('<img src="./images/vipBirthday.png"/>');
                        m_dialog.init();
                        m_dialog.show();
                        nodeList.submit.innerHTML = "已领取";
                        className.add(node, "action");
                    },
                    "onError": function (req) {
                        console.log("网络连接失败（" + req.status + ")");
                        that.unLock();
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