/**
 * 自定义票纸
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var webBridge = require("sea/webBridge");
    var storageMessager = require("lib/evt/storageMessager");
    var ajax = require("lib/io/ajax");
    var toast = require("sea/toast");
    var touch = require("touch");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var url = null;

        //---------------事件定义----------------
        var evtFuncs = {
            submitTxt: function(ev) {
                var txt = nodeList.input.value;
                if( txt.length > 16) {
                    toast("输入文字超过16个字");
                    return;
                } 
                if(txt <= 0) {
                    toast("请输入内容");
                    return;
                }
                custFuncs.customPaper(txt);
            },
            clearTxt1: function(ev) {
                if(nodeList.input.value) {
                    nodeList.input.value = "";
                }   
            },
            clearTxt2: function(ev) {
                if(nodeList.input.value) {
                    nodeList.input.value = "";
                }
                var txt = " ";
                custFuncs.customPaper(txt);   
            },
            txtNum: function(ev) {
                var txt = nodeList.input.value;
                function showKeyPress(evt) {
                    evt = (evt) ? evt : window.event;
                    return checkSpecificKey(evt.keyCode);
                }
                function checkSpecificKey(keyCode) {
                    var specialKey = "^;";
                    var realkey = String.fromCharCode(keyCode);
                    var flg = false;
                    flg = (specialKey.indexOf(realkey) >= 0);
                    if (flg) {
                    toast('请勿输入特殊字符: ' + realkey);
                    return false;
                    }
                    return true;
                }
                document.onkeypress = showKeyPress;
                showKeyPress(txt);
                if(txt.length > 16) {
                    var txtArr = txt.split("")
                    for(var i = 16;i < txt.length;i++) {
                        txtArr[i] = " ";
                    }
                    toast("输入文字超过限制", 500, function() {
                        nodeList.input.value = txtArr.join("").split(" ")[0];
                    });
                } 
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.submit, "tap", evtFuncs.submitTxt);
            touch.on(nodeList.clear, "tap", evtFuncs.clearTxt1);
            touch.on(nodeList.input, "input", evtFuncs.txtNum);
            if(nodeList.delete) {
                touch.on(nodeList.delete, "tap", evtFuncs.clearTxt2);
            }
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            customPaper: function(txt) {
                var param = {
                    "orderNo" : opts["url"]["orderNo"],
                    "customText": txt
                }
                ajax({
                    "url": opts["setcustomticket"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function(res) {
                        if(res["status"] != 1) {
                            toast(res["msg"]);
                            return;
                        }
                        storageMessager.send("customTicketPaper",{'txt':txt});
                        toast( (txt == " " ? "删除成功" : res["msg"]), 1000, function(){
                            if(opts.url.from == "order") {
                                webBridge.close();
                            } else {
                                webBridge.openUrl(res["data"]["url"] + "&from=payResult");
                            }
                        });   
                    },
                    "onError": function(req) {
                        console.error("网络连接失败(" + res.status + ")");
                    }
                });
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
            evtFuncs.txtNum();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        return that;
    }
});