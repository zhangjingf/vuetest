/**
 * 绑定会员卡 模块
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var alert = require("sea/dialog/alert");
    var confirm = require("sea/dialog/confirm");
    var ajax = require("lib/io/ajax");
    var each = require("lib/util/each");
    var webBridge = require("sea/webBridge");
    var storageMessager = require("lib/evt/storageMessager");
    var choiseCity = require("sea/bindCinemaCard/choiseCity");
    var choiseCinema = require("sea/bindCinemaCard/choiseCinema");
    var touch = require("touch");

    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_choiseCity = null;
        var m_choiseCinema = null;

        var seleCityName = null;    /*选择的城市名称*/
        var seleCityNo = null;      /*选择的城市编号*/
        var seleCinemaName = null;  /*选择的影院名称*/
        var seleCinemaNo = null;    /*选择的影院编号*/
        var linkNo = null;          /*选择的影院的链接号*/
        //---------------事件定义----------------
        var evtFuncs = {
            selectCity : function () {
                custFuncs.showCity();
            },
            selectCinema : function () {
                if (seleCityNo == null) {
                    var dialog = alert("请先选择城市，再选择影院!");
                    dialog.init();
                    dialog.show();
                } else {
                    m_choiseCinema.init({"cityNo": seleCityNo});
                    m_choiseCinema.show();
                }
            },
            findCinema: function (ev) {
                if (seleCityNo == null || seleCityNo != ev.data.cityNo) {
                    seleCityName = ev.data.cityName;
                    seleCityNo = ev.data.cityNo;
                    nodeList.city.innerHTML = ev.data.cityName;
                    nodeList.cinema.innerHTML = "";
                }
            },
            deterCinema: function (ev) {
                seleCinemaName = ev.data.cinemaName;
                seleCinemaNo = ev.data.cinemaNo;
                linkNo = ev.data.linkNo;
                nodeList.cinema.innerHTML = ev.data.cinemaName;
            },
            bindCard: function () {
                /*webBridge.getUserState(
                    function (res) {
                        userId = res["data"]["userId"];
                        custFuncs.bindCard();
                    }
                );*/
                custFuncs.bindCard();
            }





        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_choiseCity = choiseCity(nodeList.selectCity, opts);
            m_choiseCinema = choiseCinema(nodeList.selectCinema, opts);
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.selectCity, "tap", evtFuncs.selectCity);
            touch.on(nodeList.selectCinema, "tap", evtFuncs.selectCinema);
            touch.on(nodeList.bindCard, "tap", evtFuncs.bindCard);
            m_choiseCity.bind("change", evtFuncs.findCinema);
            m_choiseCinema.bind("seleCinema", evtFuncs.deterCinema);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            /*展示城市*/
            showCity: function () {
                m_choiseCity.init(nodeList.userSelectCity);
                m_choiseCity.show();
            },
            /*会员卡绑定*/
            bindCard: function () {
                if(that.isLock()){
                    return;
                }
                var cardNo = nodeList.cardNo.value;
                var cardPsd = nodeList.pwd.value;
                /*a)cinemaNo:影院编号
                 b)cinemaName ：影院名称
                 c)linkNo ：影院链接号
                 d)cardNo ：会员卡号
                 e)cardPwd ： 会员卡密码*/
                var param = {
                    "cinemaNo": seleCinemaNo,
                    "cinemaName": seleCinemaName,
                    "linkNo": linkNo,
                    "cardNo": cardNo,
                    "cardPwd": cardPsd,
                    "type": 1
                };
                that.lock();
                ajax({
                    "url": opts["bindCinemaCardUrl"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        var tip = null;
                        if(res["status"] == 0){
                            console.error("绑定失败：" + res["msg"]);
                            tip = alert(res["msg"], {
                                "title": "温馨提示",
                                "OKText": "我知道了"
                            });
                            tip.init();
                            tip.show();
                        }else{
                            var inputList = node.getElementsByTagName("INPUT");
                            for (var i = 0; i < inputList.length; i++) {
                                inputList[i].style.visibility = "hidden";
                            }
                            tip = confirm("会员卡绑定成功", {//"会员绑卡成功"
                                "title": "温馨提示",
                                "OKText": "继续绑定",
                                "cancelText": "返回列表",
                                "OK": function () {
                                    nodeList.cardNo.value = "";
                                    nodeList.pwd.value = "";
                                    nodeList.city.innerHTML = "";
                                    nodeList.cinema.innerHTML = "";
                                    seleCityNo = null;
                                    for (var i = 0; i < inputList.length; i++) {
                                        inputList[i].style.visibility = "visible";
                                    }
                                },
                                "cancel": function () {
                                    storageMessager.send("changeUserData",{'changeData':'true'});
                                    webBridge.close();
                                    //webBridge.openUrl(res["data"]["url"], "_self");
                                    /*webBridge.close();
                                    webBridge.openUrl(res["data"]["url"], "_blank");*/
                                }
                            });
                            tip.init();
                            tip.show();
                        }
                    },

                    "onError": function(res) {
                        that.unLock();
                        console.log("请求失败，http status:" + res.status)
                    }
                });
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;

        return that;
    }
})