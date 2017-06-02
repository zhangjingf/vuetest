/**
 * 排期页面 弹出各种会员价
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    //var modal = require("lib/layer/modal");
    var merge = require("lib/json/merge");
    var winSize = require("lib/util/winSize");
    var setStyle = require("lib/dom/setStyle");
    var className = require("lib/dom/className");
    var modal = require("sea/dialog/modals");
    var touch = require("touch");
    //---------- require end -------------
    var TMPL = '<div class="title">\
                    <span node-name="title"></span>\
                    <div class="close" node-name="close">\
                        <div class="horizontal"></div>\
                        <div class="vertical"></div>\
                    </div>\
                </div>\
                <div class="body" node-name="body"></div>';

    return function(content, opts) {
        var that = modal();

        content = content || "提示内容";
        opts = merge({
            "title": "温馨提示",
            "OKText": "我知道了",
            "OK": function() {}
        }, opts || {});

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var node = null;
        var superMethod = {
            init: that.init
        };

        //---------------事件定义----------------
        var evtFuncs = {
            /*"ok": function(ev) {
                opts["OK"]();
                that.hide("ok");
            }*/
            close: function (ev) {
                that.hide();
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            //touch.on(nodeList.ok, "tap", evtFuncs.ok);
            touch.on(nodeList.close, "tap", evtFuncs.close);
        }

        //-----------------自定义函数-------------
        var custFuncs = {}

        //-----------------初始化----------------
        var init = function(_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-mode-preferentialList";

            nodeList = parseNode(node);
            data = _data;
            var arrPrices = data.prices.split(',');
            nodeList.title.innerHTML = opts["title"];

            /*var linkHtml = '<ul class="perfer-item-list">\
                                        <li class="prefer-item" data-url='+data.url+'>\
                                            <span class="prefer-title">虚拟会员</span>\
                                            <span class="prefer-price">\
                                                <span class="price-rmb-icon">¥</span>\
                                                <span class="price">'+parseFloat(arrPrices[0])+'</span>\
                                                <span class="sprite ico-back-s"></span>\
                                            </span>\
                                        </li>\
                                        <li class="prefer-item" data-url='+data.url+'>\
                                            <span class="prefer-title">影城会员卡</span>\
                                            <span class="prefer-price">\
                                                <span class="price-rmb-icon">¥</span>\
                                                <span class="price">'+parseFloat(arrPrices[1])+'</span>\
                                                <span class="sprite ico-back-s"></span>\
                                            </span>\
                                        </li>\
                                        <li class="prefer-item" data-url='+data.url+'>\
                                            <span class="prefer-title">尊享卡</span>\
                                            <span class="prefer-price">\
                                                <span class="price-rmb-icon">¥</span>\
                                                <span class="price">'+parseFloat(arrPrices[2])+'</span>\
                                                <span class="sprite ico-back-s"></span>\
                                            </span>\
                                        </li>\
                                    </ul>';*/
            var arrCardName = ['虚拟会员','影城会员卡','尊享卡'];
            var cardHtml = "";
            if (parseInt(data.status)) {/*status 0不需要弹框  1有三种优惠  2有两种优惠*/
                for (var i = 0 ; i < arrPrices.length; i++) {
                    if (parseFloat(arrPrices[i]) != 0) {
                        cardHtml += '<li class="prefer-item" data-url='+data.url+'>\
                                            <span class="prefer-title">'+ arrCardName[i] +'</span>\
                                            <span class="prefer-price">\
                                                <span class="price-rmb-icon">¥</span>\
                                                <span class="price">'+parseFloat(arrPrices[i])+'</span>\
                                                <span class="sprite ico-back-s"></span>\
                                            </span>\
                                        </li>';
                    }
                }
            }

            nodeList.body.innerHTML = '<ul class="perfer-item-list">'+ cardHtml +'</ul>';
            //nodeList.content.innerHTML = content;
            //nodeList.ok.innerHTML = opts["OKText"];

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        return that;
    }
});