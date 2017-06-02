/**
 * 我的钱包绑定影城会员卡 选择影院弹层
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var parseNode = require("lib/dom/parseNode");
    var ajax = require("lib/io/ajax");
    var modal = require("lib/layer/modal");
    var each = require("lib/util/each");
    var touch = require("touch");
    var showMessage = require("sea/showMessage");
    //---------- require end -------------
    var TMPL = '<div class="title">选择影院</div>\
                <div class="list-word" node-name="list"></div>\
                <div class="footer"><div node-name="ok">取消</div></div>';

    return function(node, opts) {
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
            selectCinema : function (e) {
                if (e.target.tagName == 'DIV') {
                    var curCinemaName = e.target.innerText;
                    var curCinemaNo = e.target.getAttribute("data-cinema-no");
                    var curLinkNo = e.target.getAttribute("data-link-no");
                    that.fire("seleCinema",{
                        "cinemaNo": curCinemaNo,
                        "cinemaName": curCinemaName,
                        "linkNo": curLinkNo
                    });
                    that.hide();
                }
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.list, "tap",  "[node-name=cinema]", evtFuncs.selectCinema);
            touch.on(nodeList.ok, "tap", evtFuncs.ok);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            initView: function() {
                var html = "";
/*                each(data.cinemas, function (item, index) {
                    if (item.cityNo == data.cityNo) {
                        each(item.cinemas, function (items, index) {
                            html += '<div node-name="cinema" data-link-no="'+items.linkNo+'" data-cinema-no="' + items.cinemaNo + '">'+ items.cinemaName +'</div>';
                        });
                    }
                });*/
                ajax({
                    "url": opts["searchCityUrl"]+"&cityNo="+data.cityNo,
                    "onSuccess": function(res) {
                        if (res["status"] == 0) {
                            console.error( res["msg"]);
                            showMessage(res["msg"]);
                            return;
                        }
                        each(res["data"]["cinemas"], function (items, index) {
                            html += '<div node-name="cinema" data-link-no="'+items.linkNo+'" data-cinema-no="' + items.cinemaNo + '">'+ items.cinemaName +'</div>';
                        });
                        nodeList.list.innerHTML = html;
                        nodeList = parseNode(node);
                    },
                    "onError": function(res) {
                        console.error("网络连接失败:" + res.status);
                    }
                });

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