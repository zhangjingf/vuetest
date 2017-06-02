/**
 * UI模块模板，本文件不做任何事情，只是定义了一个模块的规范
 * PCWeb可以使用addEvent
 * Mobile轻按、长按之类的事件使用touch.js比较好
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    var toast = require("sea/toast");
    var swiper = require("swiper");
    var alert = require("sea/dialog/alert");
    var ajax = require("lib/io/ajax");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_swiper = null;

        //---------------事件定义----------------
        var evtFuncs = {
            checkRule: function(ev) {
                var _target = null;
                if (ev.target.nodeName == "I") {
                    _target = ev.target;
                } else {
                    _target = ev.target.firstElementChild;
                }
                _target.classList.toggle("icon-seaVIPChecked");
            },
            openSeaCard: function(ev) {
                //网银开通海洋会员卡
                if (!nodeList.checkboxIcon.classList.contains('icon-seaVIPChecked')) {
                    toast('请阅读并同意开卡协议');
                    return;
                };
                webBridge.openUrl(ev.target.getAttribute("data-href"));
            },
            reChargeSeaCard: function() {
                //    充值卡开通海洋会员卡
                if (nodeList.userId.value.length < 1) {
                    toast('充值账号不能为空');
                    return;
                };
                if (nodeList.cardNumber.value.length < 1) {
                    toast('充值卡号不能为空');
                    return;
                };
                if (nodeList.password.value.length < 1) {
                    toast('密码不能为空');
                    return;
                };
                custFuncs.chargeCardOpen();
            },
            userTip: function() {
                var tip = alert("可使用渠道：App、官网、终端机、微信<br/>同一场次影片每卡限购6张优惠票", {
                    'title': '使用须知'
                });
                tip.init();
                tip.show();

            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
            m_swiper = swiper(node, {
                "speed": 400,
                "touchMoveStopPropagation": false,
                "autoHeight": true,
                "onSlideChangeStart": function(ev) {
                    that.fire("slideChange", {
                        "index": m_swiper.activeIndex
                    });
                    if (ev.activeIndex == 1) {
                        nodeList.footer.style.display = "none";
                    } else {
                        nodeList.footer.style.display = "block";
                    }

                }
            });
        }

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.checkbox, "tap", evtFuncs.checkRule);
            touch.on(nodeList.openSeaCard, "tap", evtFuncs.openSeaCard);
            touch.on(nodeList.reChargeSeaCard, "tap", evtFuncs.reChargeSeaCard);
            touch.on(nodeList.userTip, "tap", evtFuncs.userTip);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            switchSlide: function(index) {
                m_swiper.slideTo(index);
            },
            chargeCardOpen: function () {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                ajax({
                    "url": opts["card"],
                    "method": 'POST',
                    "data": {
                        "fillCardNo": nodeList.cardNumber.value,
                        "fillPwd": nodeList.password.value,
                        "mobile": nodeList.userId.value
                    },
                    "onSuccess": function(res) {
                        that.unLock();
                        if (res.status != '1') {
                            toast(res.msg);
                            return;
                        }
                        webBridge.openUrl(opts["seaCardResult"]+ '&packageFlag=' + res["data"]["packageFlag"] +'&from='+opts["url"]["from"]);
                    },
                    "onError": function(req) {
                        that.unLock();
                        toast("网络连接失败: " + req.status);
                    }
                })
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
        that.switch = custFuncs.switchSlide;


        return that;
    }
});