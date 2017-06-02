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
    var each = require("lib/util/each");
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
        select: function (ev) {
            var isPush = ev.target.classList.toggle("active");
            var name = ev.target.innerHTML;
            if (isPush) {
                if (typeData.length < 3) {
                    typeData.push(name);
                } else {
                    typeData.push(name);
                    var typeDataFirst = typeData[0];
                    each(pageNode.list.childNodes, function (item) {
                        if (item.nodeType == 1 && item.innerHTML == typeDataFirst) {
                            item.classList.remove("active");
                            typeData.shift();
                        }
                    })
                }
            } else {
                for (var i = 0; i < typeData.length; i++) {
                    if (typeData[i] == name) {
                        typeData.splice(i, 1);
                    }
                }
            }
        }
    }

    //---------------子模块定义---------------
    var modInit = function () {
    }

    //-----------------绑定事件---------------
    var bindEvents = function () {
        touch.on(pageNode.list, "tap", "div", evtFuncs.select);

        webBridge.clickRightEnsure = function () {
            custFuncs.clickRight();
        }
    }

    //-----------------自定义函数-------------
    var custFuncs = {
        clickRight: function () {
            if (that.isLock()) {
                return;
            }
            that.lock();
            ajax({
                "url": opts["setDataUrl"],
                "method": "post",
                "data": {
                    "watchingLove": typeData.length > 0 ? typeData.join(',') : '-1'
                },
                "onSuccess": function (res) {
                    that.unLock();
                    if (res["status"] == 0) {
                        toast(res.msg);
                        console.log(res.msg);
                        return;
                    }
                    toast(res.msg);
                    if(typeData.length > 0) {
                        storageMessager.send("yyHobby", {hobby: typeData.join(',')});
                    } else {
                        storageMessager.send("yyHobby", {hobby: ''});
                    }
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
        typeData = opts["typeData"] ? JSON.parse(opts["typeData"]) : [];
        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});