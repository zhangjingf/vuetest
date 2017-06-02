/**
 * 电子券绑定 模块
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var ajax = require("lib/io/ajax");
    var webBridge = require("sea/webBridge");
    var confirm = require("sea/dialog/confirm");
    var touch = require("touch");
    var storageMessager = require("lib/evt/storageMessager");
    var showMessage = require("sea/showMessage");

    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var userId = null;
        var userInfo = null;

        //---------------事件定义----------------
        var evtFuncs = {
            bindEleTicket : function () {
                custFuncs.bindEleTicket();
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.bindBtn, "tap", evtFuncs.bindEleTicket);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            bindEleTicket: function() {
                if(that.isLock()){
                    return;
                }
                //var defer = when.defer();
                var couponNo = nodeList.couponNo.value;
                var tip = null;
                /*a)  couponno:电子券号*/
                var param = {
                    "couponno": couponNo
                };
                that.lock();
                ajax({
                    "url": opts["bindTicketUrl"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function(res) {
                        that.unLock();
                        if (res["status"] == 0) {
                            //console.error("获取城市影院列表失败:" + res["head"]["errMsg"]);
                            showMessage(res["msg"]);
                            //defer.reject(res["head"]["errMsg"]);
                            return;
                        }
                        console.log(res);


                        tip = confirm(res.msg, {//"会员绑卡成功"
                            "title": "温馨提示",
                            "OKText": "继续绑定",
                            "cancelText": "返回列表",
                            "OK": function () {
                                nodeList.couponNo.value = "";
                            },
                            "cancel": function () {
                                storageMessager.send("eleTicketChange");
                                webBridge.close();
                                //webBridge.openUrl(res["data"]["url"], "self");
                            }
                        });
                        tip.init();
                        tip.show();
                        //defer.resolve();
                    },
                    "onError": function(req) {
                        console.error("网络连接失败:" + req.status);
                        //defer.reject("网络连接失败:" + req.status);
                    }
                });
                //return defer.promise;
            }

        }

        //-----------------初始化----------------
        var init = function(_data) {
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