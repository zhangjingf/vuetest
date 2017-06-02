/**
 * 确认弹层
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    //var modal = require("lib/layer/modal");
    var modal = require("sea/dialog/modals");
    var merge = require("lib/json/merge");
    var touch = require("touch");
    var ajax = require("lib/io/ajax");
    var showMessage = require("sea/showMessage");
    //---------- require end -------------
    var TMPL = '<div><div class="title">修改性别</div><div class="cancel" node-name="cancel"></div></div>' +
               '<div class="body"><div class="active" node-name="sex" data-sex="1">男</div><div node-name="sex" data-sex="0">女</div></div>';

    return function(opts) {
        var that = modal();
        opts = merge({
            "cancelText": "取消",
            "OK": function() {},
            "cancel": function() {}
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
            "ok": function(ev) {
                opts["OK"]();
                that.hide("ok");
            },
            "cancel": function(ev) {
                opts["cancel"]();
                that.hide("cancel");
            },
            sex: function (ev) {
                var sex = ev.target.getAttribute("data-sex");
                custFuncs.setSex(sex);
                that.hide("ok");
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            //touch.on(nodeList.ok, "tap", evtFuncs.ok);
            touch.on(nodeList.cancel, "tap", evtFuncs.cancel);
            touch.on(nodeList.sex, "tap", evtFuncs.sex);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            setSex: function (sex) {
                if(that.isLock()) {
                    return;
                }
                that.lock();
                var param = {
                    "sex": sex
                };
                ajax({
                    "url": opts["modify"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res["status"] == 0) {
                            return;
                        }
                        showMessage(res["msg"]);
                        that.fire("changeSex",{"sex":sex=='0'?'女':'男'});
                    },
                    "onError": function(req) {
                        that.unLock();
                        console.error("操作失败，状态码：" + req["status"]);
                    }
                });
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-selected-sex";
            nodeList = parseNode(node);
            data = _data;
            nodeList.cancel.innerHTML = opts["cancelText"];

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
});