/**
 * 修改各种信息
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var contains = require("lib/dom/contains");
    var isEmpty = require("lib/str/isEmpty");
    var encodeHTML = require("lib/str/encodeHTML");
    var showMessage = require("sea/showMessage");
    var webBridge = require("sea/webBridge");
    var storageMessager = require("lib/evt/storageMessager");
    var modifyNickname = require("sea/dialog/modifyNickname");
    var modifyFaceWay = require("sea/dialog/modifyFaceWay");
    var touch = require("touch");
    var loading = require("sea/dialog/loading");
    var dateSelect = require("sea/myData/modalDateSelect");
    var modifySelectedSex = require("sea/dialog/modifySelectedSex");
    var ajax = require("lib/io/ajax");
    var toast = require("sea/toast");
    //var yyScollOpt = require("sea/dialog/yyScollOpt");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var user = null;
        var m_dateSelect = null;
        var m_sexSelect = null;
        var m_loading = null;

        //---------------事件定义----------------
        var evtFuncs = {
            action: function (ev) {
                var target = ev.target;

                while (!target.hasAttribute("action-type") && contains(node, target)) {
                    target = target.parentNode;
                }

                if (!target.hasAttribute("action-type")) {
                    return;
                }

                var atype = target.getAttribute("action-type");

                switch (atype) {
                    case "face":
                        custFuncs.modifyFaceWay();
                        break;
                    case "nickname":
                        custFuncs.modifyNickname();
                        break;
                    case "sex":
                        custFuncs.changeSex();
                        break;
                    case "birthday":
                        custFuncs.selectDate();
                        break;
                    case "city":
                        webBridge.openUrl(opts["cities"], 'blank');
                        break;
                    case "profession":
                        custFuncs.changeProfession();
                }
            },
            modifyNickname: function (ev) {
                var user = ev.data;
                var oldNickname = nodeList.nickname.innerHTML;
                nodeList.nickname.innerHTML = isEmpty(user["nickname"]) ? oldNickname : encodeHTML(user["nickname"]);
            },
            modifyFace: function (ev) {
                var user = ev.data;
                var oldSrc = nodeList.face.src;
                nodeList.face.src = isEmpty(user["imageSrc"]) ? oldSrc : user["imageSrc"];
            },
            changeSex: function (ev) {
                nodeList.sex.innerHTML = ev.data.sex;
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            /*  m_tip = confirm("是否确认退出？", {
             "OK": function () {
             evtFuncs.logout();
             }
             });
             m_tip.init();
             */

            m_sexSelect = modifySelectedSex(user);
            m_sexSelect.init();

            m_loading = loading();
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(node, "tap", "[action-type]", evtFuncs.action);
            //m_dateSelect.bind("changeBirthday", evtFuncs.changeBirthday);
            m_sexSelect.bind("changeSex", evtFuncs.changeSex);
            webBridge.saveBase64ToImg = custFuncs.saveBase64ToImg;
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            modifyFaceWay: function () {
                var dialog = modifyFaceWay(user);
                dialog.init();
                dialog.bind("modifyFaceWay", evtFuncs.modifyFace);
                dialog.show();
            },
            modifyNickname: function () {
                var dialog = modifyNickname(user);
                dialog.init();
                dialog.bind("modifyNickname", evtFuncs.modifyNickname);
                dialog.show();
            },
            changeSex: function () {
                m_sexSelect.show();
            },
            selectDate: function () {
                if (opts["qid"] == '1') {
                    showMessage("生日只能修改一次");
                    //return;
                }
                m_dateSelect = dateSelect({
                        'modify': user["modify"],
                        'selectedDate': nodeList.birthday.innerHTML
                    }
                );
                m_dateSelect.init();
                m_dateSelect.show({"afterAnimate": m_dateSelect.initiScroll});
            },
            changeHobby: function (txt) {
                nodeList.like.innerText = txt;
            },
            changeWeChat: function (txt) {
                nodeList.weChat.innerText = txt;
            },
            changeProfession: function () {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                ajax({
                    "url": opts["getList"],
                    "method": "post",
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res["status"] == 0) {
                            toast(res.msg);
                            console.log(res.msg);
                            return;
                        }
                        var changeZY = yyScollOpt(res["data"], {
                            "type": 1,
                            "OK": function () {
                                var choiceInfo = changeZY.getChoice();
                                ajax({
                                    "url": opts["setDataUrl"],
                                    "method": "post",
                                    "data": {
                                        "profession": choiceInfo.name
                                    },
                                    "onSuccess": function (res) {
                                        that.unLock();
                                        if (res["status"] == 0) {
                                            toast(res.msg);
                                            console.log(res.msg);
                                            return;
                                        }
                                        nodeList.profession.innerText = choiceInfo.name;
                                        toast(res.msg);
                                    },
                                    "onError": function (req) {
                                        that.unLock();
                                        console.error("操作失败，状态码：" + req["status"]);
                                    }
                                })
                            }
                        });
                        changeZY.init();
                        changeZY.show({"afterAnimate": changeZY.initSwiper});
                    },
                    "onError": function (req) {
                        that.unLock();
                        console.error("操作失败，状态码：" + req["status"]);
                    }
                })
            },
            saveBase64ToImg: function (res) {
                var imgSrc = 'data:image/png;base64,' + res;
                if (that.isLock()) {
                    return;
                }
                that.lock();
                ajax({
                    "url": opts["modify"],
                    "method": "post",
                    "data": {
                        "imageOriginal": imgSrc,
                        "imgage640": imgSrc
                    },
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res["status"] == 0) {
                            toast(res.msg);
                            return;
                        }
                        storageMessager.send("myDataChange");
                        nodeList.face.src = imgSrc;
                        toast(res.msg);
                    },
                    "onError": function (req) {
                        that.unLock();
                        console.error("操作失败，状态码：" + req["status"]);
                    }
                })
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            data = _data;
            user = opts;
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.changeHobby = custFuncs.changeHobby;
        that.changeWeChat = custFuncs.changeWeChat;

        return that;
    }
});