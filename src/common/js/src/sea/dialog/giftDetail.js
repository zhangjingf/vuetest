/**
 * 礼包详情弹层
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var modal = require("lib/layer/modal");
    var merge = require("lib/json/merge");
    var touch = require("touch");
    var each = require('lib/util/each');
    //---------- require end -------------
    var TMPL = '<p class="receive" node-name="status"></p>\
                <div class="icon-sign-gift-name"></div>\
                <p class="condition" node-name="condition"><span>*领取条件：连续签到</span><span node-name="num">7</span><span>天</span></p>\
                <div class="container" node-name="container">\
                </div>\
                <div class="btn"><div class="icon-sign-btn1" node-name="close">我知道了</div></div>';

    return function(opts) {
        var that = modal();

        opts = opts || {};

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var node = null;
        var superMethod = {
            init: that.init
        };

        //---------------事件定义----------------
        var evtFuncs = {
            close: function() {
                that.hide();
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.close, "tap", evtFuncs.close);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            initContent: function() {
                nodeList.status.innerHTML = opts.status == "1" ? '' : '';
                if (opts.whereDay) {
                    nodeList.num.innerHTML = opts.whereDay;
                }
                else {
                    nodeList.condition.style.display = 'none';
                }

                var html = '';
                each(opts.gift, function(gift, key, source) {
                    html += '<div class="item">\
                                <img src="' + gift.pdImgUrl + '" alt="礼品图片">\
                                <p>' + gift.pdName + '</p>\
                            </div>';
                })
                nodeList.container.innerHTML = html;
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-gift-info";
            nodeList = parseNode(node);
            data = _data;

            custFuncs.initContent();

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});