/**
 * 修改头像
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var queryNode = require("lib/dom/queryNode");
    var modal = require("lib/layer/modal");
    var contains = require("lib/dom/contains");
    var each = require("lib/util/each");
    var clone = require("lib/json/clone");
    var ajax = require("lib/io/ajax");
    var scrollMonitor = require("lib/dom/scrollMonitor");
    var userFace = require("sea/userFace");
    var webBridge = require("sea/webBridge");
    var storageMessager = require("lib/evt/storageMessager");
    var showMessage = require("sea/showMessage");
    var touch = require("touch");
    //---------- require end -------------
    var TMPL = '<div class="title">修改头像</div>\
                <div class="list" node-name="list"></div>\
                <div class="footer">\
                    <div class="borderright" node-name="cancel">取消</div>\
                    <div node-name="ok">确认</div>\
                </div>';

    return function (opts) {
        var that = modal();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var node = null;
        var m_monitor = null;
        var superMethod = {
            init: that.init,
            show: that.show
        };

        //---------------事件定义----------------
        var evtFuncs = {
            ok: function (ev) {
                if (that.isLock()) {
                    return;
                }
                var em = queryNode("em.icon-checked", nodeList.list);
                var index = 0;

                if (em != null) {
                    var imageSrc = em.previousElementSibling.src;
                    var pnode = em.parentNode;
                    while (!pnode.hasAttribute("data-index") && contains(nodeList.list, pnode)) {
                        pnode = pnode.parentNode;
                    }

                    if (!pnode.hasAttribute("data-index")) {
                        return;
                    }

                    index = pnode.getAttribute("data-index");
                } else {

                    that.hide();
                    return;
                }

                that.lock();

                that.hide();
                that.fire("modifyFace", {
                    "imageSrc": imageSrc
                });
                var param = {
                    "imageNo": index,
                };

                ajax({
                    "url": opts["modify"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res["status"] == 0) {
                            that.fire("modifyFace", {
                                "imageSrc": null
                            });

                            showMessage(res["msg"], function () {
                                that.show();
                            });
                            return;
                        }

                        storageMessager.send("myDataChange");
                        showMessage(res["msg"]);
                    },
                    "onError": function(req) {
                        that.unLock();
                        console.error("操作失败，状态码为：" + req["status"]);
                    }
                });
            },
            cancel: function () {
                that.hide("cancel");
            },
            select: function (ev) {
                var em = queryNode("em.icon-checked", nodeList.list);
                var target = ev.target;
                var pnode = target;
                var span = null;

                while (!pnode.hasAttribute("data-index") && contains(nodeList.list, pnode)) {
                    pnode = pnode.parentNode;
                }

                if (!pnode.hasAttribute("data-index")) {
                    return;
                }

                span = queryNode("span", pnode);

                if (em) {
                    em.parentNode.removeChild(em);
                } else {
                    em = document.createElement("EM");
                    em.className = "icon-checked";
                }

                span.appendChild(em);
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.ok, "tap", evtFuncs.ok);
            touch.on(nodeList.cancel, "tap", evtFuncs.cancel);
            touch.on(nodeList.list, "tap", "div", evtFuncs.select);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            initView: function () {
                var html = "";
                var indexs = userFace.getFaceIndexs();
                var url = null;

                each(indexs, function (index) {
                    index = parseInt(index, 10);
                    html += '<div data-index="' + index + '"' + (index == opts["imageNo"] ? ' class="checked"' : '') + '><span><img src="' + userFace.getUrlByIndex(0) + '" data-url="' + userFace.getUrlByIndex(index) + '"/>' + (index == opts["imageNo"] ? '<em class="icon-checked"></em>' : '') + '</span></div>';
                });

                nodeList.list.innerHTML = html;
            },
            initMonitor: function () {
                superMethod.show.call(that);
                m_monitor = scrollMonitor(nodeList.list, {
                    "selector": "[data-url]",
                    "change": function (list) {
                        for (var i = 0; i < list.length; i++) {
                            list[i].src = list[i].getAttribute("data-url");
                            list[i].removeAttribute("data-url");
                        }
                    }
                });

                m_monitor.init();
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            node.innerHTML = TMPL;
            node.className = "m-mode-one m-modify-face";

            nodeList = parseNode(node);
            data = _data;
            custFuncs.initView();

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.show = custFuncs.initMonitor;

        return that;
    }
});