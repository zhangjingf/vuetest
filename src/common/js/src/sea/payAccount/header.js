/**
 * 子页面顶部功能，仅有一个返回连接
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
  /*  var URL = require("lib/util/URL");
    var queryToJson = require("lib/json/queryToJson");*/
    var storageMessager = require("lib/evt/storageMessager");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    var showMessage = require("sea/showMessage");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var isPaying = false;


        //---------------事件定义----------------
        var evtFuncs = {
            back: function(ev) {
                if (isPaying) {
                    showMessage('正在支付中，请稍后');
                    return;
                }
                //storageMessager.send("cancelActivity", opts["cardActId"]);
                /*if (opts["virtualDiscountAmount"] >= 1) {//用户还有活动优惠票数， 必须释放
                    storageMessager.send("cancelActivity", opts["cardActId"]);
                }*///不取消
                //storageMessager.send("cancelStyle");
                storageMessager.send("changeUserData",{'changeData':'false','cancelFavorable':true});
                //storageMessager.send("cancelFavorable", true);/*取消会员优惠  并改变样式*/
                webBridge.close();
            },
            reload: function () {
                webBridge.reload();
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.back, "tap", evtFuncs.back);
            if(nodeList.reload) {
                touch.on(nodeList.reload, "tap", evtFuncs.reload);
            }
            webBridge.onBackPressed = function () {
                evtFuncs.back();
                var isIPhone = navigator.appVersion.match(/iphone/gi);
                if (isIPhone) {
                    return "turnBackSucceed";
                }
            };
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            paying: function() {
                isPaying = true;
            },

            payed: function() {
                isPaying = false;
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            //opts = queryToJson(URL.parse(location.href)["query"]);
            nodeList = parseNode(node);
            data = _data;


            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.paying = custFuncs.paying;
        that.payed = custFuncs.payed;

        return that;
    }
});
