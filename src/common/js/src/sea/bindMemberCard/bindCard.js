/**
 * 绑定会员卡
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var ajax = require("lib/io/ajax");
    var trim = require("lib/str/trim");
    var confirm = require("sea/dialog/confirm");
    var webBridge = require("sea/webBridge");
    var showMessage = require("sea/showMessage");
    var storageMessager = require("lib/evt/storageMessager");
    var touch = require("touch");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;

        //---------------事件定义----------------
        var evtFuncs = {
            bindCard:function() {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                var cardNo = trim(nodeList.cardNo.value);//"9991200000010","9990001"
                var cardPwd = trim(nodeList.passwd.value);//"321654","010203"
                if (cardNo.length <= 0) {
                    showMessage("卡号不能为空，请重新输入");
                    that.unLock();
                    return;
                }
                if (cardPwd.length <= 0) {
                    showMessage("密码不能为空，请重新输入");
                    that.unLock();
                    return;
                }
                var param = {
                    "cinemaNo": opts["cinemaNo"],
                    "cinemaName": opts["cinemaName"],    //"中影影城"
                    "linkNo": opts["linkNo"],
                    "cardNo": cardNo,
                    "cardPwd": cardPwd,
                    "type": 2
                };
                console.log(param);
                ajax({
                    "url": opts["userCardBind"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        var tip = null;
                        if(res["status"] != 1){
                            showMessage(res["msg"]);
                            return;
                        }
                        tip = confirm("会员卡绑定成功", {//"会员绑卡成功"
                            "title": "温馨提示",
                            "OKText": "继续绑定",
                            "cancelText": "返回列表",
                            "OK": function() {
                                that.fire("continueBindMemberCard");
                                custFuncs.cardReset();
                            },
                            "cancel": function() {
                                //storageMessager.send("bindCard");
                                storageMessager.send("changeUserData",{'changeData':'true'});
                                webBridge.close();
                            }
                        });
                        tip.init();
                        tip.show();
                    },
                    "onError": function(req) {
                        that.unLock();
                        console.log("请求失败，http status:" + req.msg);
                    }
                });


            }
        }

        //---------------子模块定义---------------
        var modInit = function () {}

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.bindCard, "tap", evtFuncs.bindCard);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            cardReset: function() {
                nodeList.cardNo.value = "";
                nodeList.passwd.value = "";
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