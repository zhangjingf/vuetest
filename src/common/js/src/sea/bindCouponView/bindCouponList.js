/**
 * 我的优惠券列表
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var ajax = require("lib/io/ajax");
    var encodeHTML = require("lib/str/encodeHTML");
    var appendQuery = require("lib/str/appendQuery");
    var closest = require("lib/dom/closest");
    var webBridge = require("sea/webBridge");
    var when = require("lib/util/when");
    var each = require("lib/util/each");
    var swiper = require("swiper");
    var touch = require("touch");

    var showMessage = require("sea/showMessage");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_swiper = null;
        var userId = null;

        //---------------事件定义----------------
        var evtFuncs = {
            jumpPage : function (ev) {
                var target = ev.target;
                var getNode = closest(target, "[node-name=instructions]", node);
                if (getNode == null) {
                    return;
                }
                var status = getNode.getAttribute("data-status");
                if (status == 1) {
                    webBridge.openUrl(appendQuery("ticketExplain.html"), "blank");
                    return;
                }
                webBridge.openUrl(appendQuery("ticketExplainUsed.html"), "blank");
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {}

        //-----------------自定义函数-------------
        var custFuncs = {
            initView: function () {
                custFuncs.getUserCouponList()
                    .then(function () {
                        var defer = when.defer();

                        custFuncs.initSwiper();
                        custFuncs.swiperTo(0);

                        defer.resolve();
                        return defer.promise;
                    });
            },
            initSwiper: function() {
                if (m_swiper == null) {
                    m_swiper = new swiper(".eleTicket-swiper", {
                        "speed": 500,
                        "swipeHandler": ".tabs"
                    });
                }
            },
            swiperTo : function (slideTo) {
                m_swiper.slideTo(slideTo);
            },
            getUserCouponList : function () {
                var defer = when.defer();
                webBridge.getUserState(function (res) {
                    userId = res["data"]["userId"];

                    var param = ajaxParam.create("queryUserCouponList", {
                        "userId": userId,
                        "mobile": data
                    });

                    ajax({
                        "url": ajaxParam.getUrl(),
                        "method": "post",
                        "data": param,
                        "onSuccess": function(res) {
                            if (res["head"]["errCode"] != 0) {
                                console.error("获取城市影院列表失败:" + res["head"]["errMsg"]);
                                showMessage(res["head"]["errMsg"]);
                                defer.reject(res["head"]["errMsg"]);
                                return;
                            }
                            custFuncs.showTicket(res["body"]["CouponNos"]);

                            defer.resolve();
                        },
                        "onError": function(req) {
                            console.error("网络连接失败:" + req.status);
                            defer.reject("网络连接失败:" + req.status);
                        }
                    });

                });
                return defer.promise;
            },
            /*loadCouponList : function () {
             var defer = when.defer();
             var param = ajaxParam.create("queryUserCouponList", {
             "userId": userId,
             "mobile": data
             });

             ajax({
             "url": ajaxParam.getUrl(),
             "method": "post",
             "data": param,
             "onSuccess": function(res) {
             if (res["head"]["errCode"] != 0) {
             console.error("获取城市影院列表失败:" + res["head"]["errMsg"]);
             showMessage(res["head"]["errMsg"]);
             defer.reject(res["head"]["errMsg"]);
             return;
             }
             custFuncs.showTicket(res["body"]["CouponNos"]);

             defer.resolve();
             },
             "onError": function(req) {
             console.error("网络连接失败:" + req.status);
             defer.reject("网络连接失败:" + req.status);
             }
             });

             return defer.promise;
             },*/
            showTicket : function (ticketsList) {
                /*{
                 "CouponNo": "071329836930",
                 "LimitDate": "2015-10-29至2016-10-31",
                 "CouponName": "蓝海积分商城",
                 "Status": 1,
                 "UseTime": "",
                 "UrlDetails": "http://172.16.34.3:8024/CouponRuleInfo.aspx?couponNo=071329836930",
                 "Source": 3,
                 "exchangeType": "2D,3D,IMAX2D,IMAX3D",
                 "useChange": "不限",
                 "valiCiname": "",
                 "valFilm": "",
                 "ShowTypeName": ""
                 }*/
                var unusedHtml = "";
                var usedHtml = "";
                each(ticketsList, function (item, index) {
                    if (item.Status == 1) {
                        unusedHtml +=  '<li>\
                                            <div class="m-ticket">\
                                                <div class="top blue"></div>\
                                                <div class="content">\
                                                    <div class="icon-blue">\
                                                        <i class="icon-ticket"></i>\
                                                        <div class="use-blue">未使用</div>\
                                                    </div>\
                                                    <div class="column">\
                                                        <div class="number">电子券号："' + item.CouponNo + '"</div>\
                                                        <div class="valid">有效日期："' + encodeHTML(item.LimitDate) + '"</div>\
                                                        <div class="type">兑换类型：\
                                                            <span class="color-blue">"' + item.exchangeType + '"</span>\
                                                        </div>\
                                                        <div class="channel">使用渠道："' + encodeHTML(item.useChange) + '"</div>\
                                                    </div>\
                                                </div>\
                                                <div class="instructions bg-blue" node-name="instructions" data-status="' + item.Status + '">使用说明</div>\
                                            </div>\
                                        </li>';
                    } else {
                        usedHtml += '<li>\
                                            <div class="m-ticket">\
                                                <div class="top blue"></div>\
                                                <div class="content">\
                                                    <div class="icon-blue">\
                                                        <i class="icon-ticket"></i>\
                                                        <div class="use-blue">未使用</div>\
                                                    </div>\
                                                    <div class="column">\
                                                        <div class="number">电子券号："' + item.CouponNo + '"</div>\
                                                        <div class="valid">验证时间："' + item.UseTime + '"</div>\
                                                        <div class="type">验证影院：\
                                                            <span class="color-blue">"' + encodeHTML(item.valiCiname) + '"</span>\
                                                        </div>\
                                                        <div class="channel">兑换影片："' + encodeHTML(item.valFilm) + '"</div>\
                                                    </div>\
                                                </div>\
                                                <div class="instructions bg-blue" node-name="instructions" data-status="' + item.Status + '">使用说明</div>\
                                            </div>\
                                        </li>';
                    }
                })
                nodeList.orderUnused.innerHTML = unusedHtml;
                nodeList.orderUsed.innerHTML = usedHtml;
                nodeList = parseNode(node);
                touch.on(nodeList.instructions, "tap", evtFuncs.jumpPage);
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);

            data = _data;

            custFuncs.initView();
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.swiperTo = custFuncs.swiperTo;
        that.initView = custFuncs.initView;

        return that;
    }
});