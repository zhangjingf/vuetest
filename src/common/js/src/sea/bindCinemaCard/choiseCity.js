/**
 * 我的钱包绑定影城会员卡 选择城市弹层
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var parseNode = require("lib/dom/parseNode");
    var insertNode = require("lib/dom/insertNode");
    var className = require("lib/dom/className");
    var modal = require("lib/layer/modal");
    var each = require("lib/util/each");
    var touch = require("touch");
    //---------- require end -------------
    var TMPL = '<div class="title">选择城市</div>\
                <div class="list-word" node-name="list"></div>\
                <div class="footer"><div node-name="ok">取消</div></div>';

    return function(opts) {
        var that = modal();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var node = null;
        var superMethod = {
            init: that.init
        };

        //---------------事件定义----------------
        var evtFuncs = {
            "ok": function(ev) {
                that.hide("ok");
            },
            selectCity : function (e) {
                if (e.target.tagName == 'DIV') {
                    var curCityName = e.target.innerText;
                    var curCityNo = e.target.getAttribute("data-no");
                    that.fire("change",{
                        "cityNo": curCityNo,
                        "cityName": curCityName
                    });
                    that.hide();
                }
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.list, "tap", "[node-name=selected]", evtFuncs.selectCity);
            touch.on(nodeList.ok, "tap", evtFuncs.ok);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            initView: function() {
                /*<div node-name="selected" data-no="440300">广东省-深圳市</div>*/
                className.remove(data, "hidden");
                insertNode(nodeList.list, data, "beforeend");
                nodeList = parseNode(node);
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-mode-one";

            nodeList = parseNode(node);
            data = _data;
            custFuncs.initView();

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        return that;
    }
});