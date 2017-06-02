/**
 * 设置页面
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var confirm = require("sea/dialog/confirm");
    var webBridge = require("sea/webBridge");
    var loading = require("sea/dialog/loading");
    var ajax = require("lib/io/ajax");
    var showMessage = require("sea/showMessage");
    var storageMessager = require("lib/evt/storageMessager");
    var modifyPasswd = require("sea/dialog/modifyPasswd");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_loading = null;

        //---------------事件定义----------------
        var evtFuncs = {
            clearCache: function () {
                var m_dialog = confirm("清除缓存可能会重新加载数据，确定<br/>要请除缓存吗？", {
                    "OK": function () {
                        webBridge.clearCache();
                    }
                });
                m_dialog.init();
                m_dialog.show();
            },
            logout: function () {
                var m_tip = confirm("是否确认退出？", {
                    "OK": function () {
                        custFuncs.logout();
                    }
                });
                m_tip.init();
                m_tip.show();
            },
            changePasswd: function () {
             var dialog = modifyPasswd(opts);
             dialog.init();
             dialog.bind("logout", evtFuncs.logout);
             dialog.show();
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
            touch.on(nodeList.clearCache, "tap", evtFuncs.clearCache);
            touch.on(nodeList.logout, "tap", evtFuncs.logout);
            touch.on(nodeList.changePasswd, "tap", evtFuncs.changePasswd);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            logout: function () {
                if (that.isLock()) {
                    return;
                }

                that.lock();
                m_loading.show();
                ajax({
                    "url": opts["logout"],
                    "method": "post",
                    "onSuccess": function (res) {
                        that.unLock();
                        m_loading.hide();
                        if (res.status != 1) {
                            showMessage(res.msg);
                            return;
                        }

                        storageMessager.send("userChanged");
                        window.frames[0].postMessage(localStorage.getItem("lib/evt/storageMessager"), location.protocol + '//jf.omnijoi.cn/');
                        webBridge.close(1);
                    },
                    "onError": function (req) {
                        that.unLock();
                        m_loading.hide();
                        console.error("操作失败，状态码为：" + req["status"])
                    }
                });
            },
            changeMobileNumber: function (mobile) {
                nodeList.mobile.innerHTML = mobile;
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
        that.changeMobileNumber = custFuncs.changeMobileNumber;

        return that;
    }
});