/**
 *
 *座位图
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var each = require("lib/util/each");
    var webBridge = require("sea/webBridge");
    var className = require("lib/dom/className");
    var touch = require("touch");
    var showMessage = require("sea/showMessage");
    var ajax = require("lib/io/ajax");
    var zoom = require("IScrollZoom");
    var confirm = require("sea/dialog/confirm");
    var toast = require("sea/toast");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_zoom = null;
        var mObserv = window.MutationObserver || window.WebKitMutationObserver;
        var seatArr = [];
        var newSeatArr = [];
        var isLogin = false;
        var scollWidth = null;
        var startSelectedSeat = JSON.parse(opts.appStartInfoStr);
        var isPlaySound = true;
        var seatHeader = null;  //解析其他模块的节点
        var startIndex = 0;

        //---------------事件定义----------------
        var evtFuncs = {
            selectSeat: function (ev) {
                if (opts["isGoldSeat"] == '1' && opts["isCanBuyGold"] == '0' && (ev.target.getAttribute("data-areaflag") == "1")) {
                    var _text = '';
                    var _canBuyMemberArr = opts["canBuyMemberStr"].split("_");
                    var _typeArr = _canBuyMemberArr[0].split("");
                    var _vArr = _canBuyMemberArr[1].split("");
                    var _stringArr = ['海洋会员、尊享卡会员、影城会员卡', "海洋会员", "尊享卡会员", "影城会员卡"];
                    if (_canBuyMemberArr[0] != '-9') {
                        for (var i = 0; i < _typeArr.length; i++) {
                            _text += _stringArr[parseInt(_typeArr[i])] + '、';
                        }
                        _text = _text.substring(0, _text.length - 1);
                    }
                    if (_canBuyMemberArr[1] != '-9' && _canBuyMemberArr[0] != '-9') {
                        _text += '及';
                    }
                    if (_canBuyMemberArr[1] != '-9') {
                        for (var k = 0; k < _vArr.length; k++) {
                            _text += 'v' + _vArr[k] + '、';
                        }
                        _text = _text.substring(0, _text.length - 1);
                        _text += '等级会员';
                    }
                    var canNotBuy = confirm('您选择的是黄金区域座位，黄金区域仅限' + _text + '可优先购买。请先进行开卡绑卡~', {
                        "OKText": "以后再说",
                        "cancelText": "去开卡/绑卡",
                        "cancel": function () {
                            webBridge.openUrl(opts["myWallet"]);
                        }
                    });
                    canNotBuy.init();
                    canNotBuy.show();
                    return;
                }
                if (isLogin == false) {
                    custFuncs.isLogin(ev.target);
                    return;
                }
                custFuncs.selectSeat(ev.target);
                custFuncs.updateSeat(seatArr);
            },
            scollSeat: function () {
                requestAnimationFrame(function () {
                    nodeList.row_number.style.transform = 'translateX(' + (-m_zoom.x) / m_zoom.scale + 'px)' + 'translateZ(0px)';
                });
            },
            soundSwitch: function (ev) {
                isPlaySound = !isPlaySound;
                className.toggle(ev.target, "icon-seatSoundOn", "icon-seatSoundOff");
                if (isPlaySound == false) {
                    seatHeader.sound.pause();
                } else {
                    seatHeader.sound.play
                    ();
                }

            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_zoom = new zoom('#seat_list', {
                zoom: true,
                scrollX: true,
                scrollY: true,
                wheelAction: 'zoom',
                mouseWheel: false,
                //scrollbars: true,
                fixedScrollbar: true,
                //startX: scollWidth,
                zoomMax: 1.8,
                zoomMin: 0.8
                //zoomStart:  初始化缩放
                /*   hScrollbar:true,//隐藏水平方向上的滚动条
                 vScrollbar:true //隐藏垂直方向上的滚动条*/
            });
            m_zoom.scrollTo(scollWidth, 0, 300);
            m_zoom.on('scrollEnd', function () {
                evtFuncs.scollSeat()
            })
        };

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.seat_cell, "tap", "span", evtFuncs.selectSeat);
            var observ = new mObserv(evtFuncs.scollSeat);
            observ.observe(nodeList.seat_bigCell, {
                attributes: true,
                childList: false,
                characterData: false
            });
            if (seatHeader.soundSwitch) {
                touch.on(seatHeader.soundSwitch, "tap", evtFuncs.soundSwitch);
            }
        };

        //-----------------自定义函数-------------
        var custFuncs = {
            //选座操作
            selectSeat: function (target) {
                var result = custFuncs.checkSeat(target);
                var row = target.parentNode.getAttribute("data-row");
                var column = target.getAttribute("data-column");
                if (className.has(target, "ico-seat-MC") || className.has(target, "ico-seat-MD")) {
                    if (seatArr.length < 4) {
                        switch (result) {
                            case 0:
                                seatArr.push(row + '|' + column);
                                if (startSelectedSeat.length > 0) {
                                    seatHeader.startSeat.style.display = 'inherit';
                                    if (isPlaySound) {
                                        if (startSelectedSeat.length == 1) {
                                            seatHeader.sound.play();
                                        } else {
                                            if (seatArr.length < startSelectedSeat.length) {
                                                startIndex = seatArr.length;
                                            } else {
                                                startIndex = seatArr.length % startSelectedSeat.length;
                                            }
                                            seatHeader.sound.firstElementChild.src = startSelectedSeat[startIndex].voiceSavePath;
                                            seatHeader.sound.src = startSelectedSeat[startIndex].voiceSavePath;
                                            seatHeader.words.innerHTML = startSelectedSeat[startIndex].voiceWords;
                                            seatHeader.sound.play();
                                        }
                                    }
                                }
                                custFuncs.changeState(target);
                                break;
                            case 1:
                                if (seatArr.length >= 3) {
                                    showMessage("最多支持选择四个座位");
                                    break;
                                }
                                custFuncs.changeState(target);
                                var column_2 = column.match(/\d+/g)[0];
                                var column_3 = column.match(/\d+/g)[1];
                                seatArr.push(row + '|' + column_2);
                                seatArr.push(row + '|' + column_3);

                                if (startSelectedSeat.length > 0) {
                                    seatHeader.startSeat.style.display = 'inherit';
                                    if (isPlaySound) {
                                        if (startSelectedSeat.length == 1) {
                                            seatHeader.sound.play();
                                        } else {
                                            if (seatArr.length < startSelectedSeat.length) {
                                                startIndex = seatArr.length;
                                            } else {
                                                startIndex = seatArr.length % startSelectedSeat.length;
                                            }
                                            seatHeader.sound.firstElementChild.src = startSelectedSeat[startIndex].voiceSavePath;
                                            seatHeader.sound.src = startSelectedSeat[startIndex].voiceSavePath;
                                            seatHeader.words.innerHTML = startSelectedSeat[startIndex].voiceWords;
                                            seatHeader.sound.play();
                                        }
                                    }
                                }


                                break;
                            case -1:
                                showMessage("请连续选择座位，不要留下单个的空闲座位");
                                break;
                        }
                    }
                    else {
                        showMessage("最多支持选择四个座位");
                        return;
                    }
                }
                else if (className.has(target, "ico-seat-MA") || className.has(target, "ico-seat-ME") || className.has(target, "ico-seat-MSA")) {
                    if (startSelectedSeat.length > 0) {
                        seatHeader.sound.pause();
                    }
                    switch (result) {
                        case -3:
                            custFuncs.changeState(target);

                            /*情侣座取消操作*/
                            each(seatArr, function (item, index) {
                                if (item == row + '|' + column)
                                    seatArr.splice(index, 1);
                            })
                            break;
                        case  -4:
                            custFuncs.changeState(target);
                            custFuncs.changePreState(target);
                            var preCol = target.previousElementSibling.getAttribute("data-column");
                            newSeatArr = [];
                            for (var i = seatArr.length - 1; i >= 0; i--) {
                                if (seatArr[i] != (row + '|' + preCol) && seatArr[i] != (row + '|' + column)) {
                                    newSeatArr.push(seatArr[i]);
                                }
                            }
                            seatArr = newSeatArr;
                            break;
                        case  -5:
                            custFuncs.changeState(target);
                            custFuncs.changeNextState(target);
                            var nextCol = target.nextElementSibling.getAttribute("data-column");
                            newSeatArr = [];

                            for (var i = seatArr.length - 1; i >= 0; i--) {
                                if (seatArr[i] != (row + '|' + nextCol) && seatArr[i] != (row + '|' + column)) {
                                    newSeatArr.push(seatArr[i]);
                                }
                            }
                            seatArr = newSeatArr;
                            break;
                        case -6:
                            custFuncs.changeState(target);
                            var column_2 = column.match(/\d+/g)[0];
                            var column_3 = column.match(/\d+/g)[1];
                            newSeatArr = [];
                            for (var i = seatArr.length - 1; i >= 0; i--) {
                                if (seatArr[i] != (row + '|' + column_2) && seatArr[i] != (row + '|' + column_3)) {
                                    newSeatArr.push(seatArr[i]);
                                }
                            }
                            seatArr = newSeatArr;
                            break;
                    }
                    if (seatArr.length <= 0 && seatHeader.startSeat) {
                        seatHeader.startSeat.style.display = 'none';
                    }
                }
            },

            checkSeat: function (seat) {
                var row = seat.parentNode;
                var seatRow = "";
                var cellIndex = parseInt(seat.getAttribute("data-cell"), 10);
                /*
                 * 0 走廊
                 * 1 未选
                 * 2 已售
                 * 3 已选
                 *
                 * */
                each(row.childNodes, function (item, index) {
                    if (item.nodeType != 1) {
                        return;
                    }
                    if (className.has(item, "zl")) {
                        seatRow += "0";
                    }
                    else if (className.has(item, "ico-seat-MC")) {
                        seatRow += "1";
                    }
                    else if (className.has(item, "ico-seat-MB") || className.has(item, "ico-seat-MF")) {
                        seatRow += "2";
                    }
                    else if (className.has(item, "ico-seat-MA") || className.has(item, "ico-seat-MSA")) {
                        seatRow += "3";
                    }
                    else if (className.has(item, "ico-seat-MD")) {
                        seatRow += "4";
                    }
                    else if (className.has(item, "ico-seat-ME")) {
                        seatRow += "5";
                    }
                });

                var emptyIndex = seatRow.indexOf("0");

                if (emptyIndex != -1) {
                    if (emptyIndex > cellIndex) {
                        seatRow = seatRow.substr(0, emptyIndex);
                    } else {
                        var tmpSeatRow = seatRow.substr(0, cellIndex + 1);
                        var lastEmptyIndex = tmpSeatRow.lastIndexOf("0");
                        var startIndex = lastEmptyIndex + 1;
                        cellIndex -= startIndex;
                        seatRow = seatRow.substr(startIndex);
                        emptyIndex = seatRow.indexOf(0);

                        if (emptyIndex != -1) {
                            seatRow = seatRow.substr(0, emptyIndex);
                        }
                    }
                }
                // 选中
                var ch = seatRow.charAt(cellIndex);

                if (ch == 1) {
                    if (/^[^1]*11[^1]*$/.test(seatRow)) {
                        return 0;
                    }

                    if (seatRow.charAt(cellIndex - 1) == "1" && seatRow.charAt(cellIndex + 1) == "1") {
                        if (seatRow.charAt(cellIndex + 2) != 1) {
                            return -1;
                        } else if (seatRow.charAt(cellIndex - 2) != "1") {
                            return -1;
                        }
                    }
                } else if (ch == 3) {
                    /*
                     * 0 走廊
                     * 1 未选
                     * 2 已售
                     * 3 已选
                     * 4 情侣座未选
                     * 5 情侣座已选
                     *
                     * */

                    /*if (seatRow.charAt(cellIndex - 1) != "1" && seatRow.charAt(cellIndex + 1) != "1") {

                     if (seatRow.charAt(cellIndex - 2) == "1" || seatRow.charAt(cellIndex + 2) == "1") {
                     return false;
                     }
                     }*/
                    if (seatRow.charAt(cellIndex - 1) == "3" && seatRow.charAt(cellIndex + 1) != "3") {
                        if (seatRow.charAt(cellIndex - 2) == "1" && seatRow.charAt(cellIndex - 3) == "3") {
                            return -4;
                        }

                    }
                    else if (seatRow.charAt(cellIndex + 1) == "3" && seatRow.charAt(cellIndex - 1) != "3") {
                        if (seatRow.charAt(cellIndex + 2) == "1" && seatRow.charAt(cellIndex + 3) == "3") {
                            return -5;
                        }
                    }
                    else if (seatRow.charAt(cellIndex - 1) == "3" && seatRow.charAt(cellIndex + 1) == "3") {
                        if (seatRow.charAt(cellIndex - 2) == "1") {
                            return -4;
                        }
                        else if (seatRow.charAt(cellIndex + 2) == "1") {
                            return -5;
                        }
                    }

                    return -3;

                }
                else if (ch == 4) {
                    /*情侣座选座*/
                    return 1;

                }
                else if (ch == 5) {
                    /*情侣座取消 */
                    return -6;
                }
                return 0;
            },

            updateSeat: function (arr) {
                that.fire("updateSeat", {
                    "value": arr
                })
            },
            cancelSeat: function (string) {
                var row = string.split("|")[0];
                var column = string.split("|")[1];
                var target = null;
                var rowLine = null;
                each(nodeList.seat_cell.childNodes, function (item) {
                    if (item.nodeType != "1") {
                        return;
                    }
                    if (item.getAttribute("data-row") == row) {
                        rowLine = item;
                    }
                });
                /*情侣座选座，通过下边的选中座位按钮取消fire值找不到对应的节点，判断操作两次*/
                each(rowLine.childNodes, function (item) {
                    if (item.nodeType != "1") {
                        return;
                    }
                    if (/\_/.test(item.getAttribute("data-column"))) {

                        var column_2 = item.getAttribute("data-column").match(/\d+/g)[0];
                        var column_3 = item.getAttribute("data-column").match(/\d+/g)[1];

                        if (column_2 == column || column_3 == column) {
                            target = item;
                            custFuncs.selectSeat(target);
                            return;
                        }
                    }
                    if (item.getAttribute("data-column") == column) {
                        target = item;
                        custFuncs.selectSeat(target);
                    }

                });
                custFuncs.updateSeat(seatArr);
            },

            changeState: function (seat) {
                if (className.has(seat, "ico-seat-MC")) {
                    className.remove(seat, "ico-seat-MC");
                    if (seat.getAttribute("data-areaflag") == '1') {
                        className.add(seat, "ico-seat-MSA");
                    } else {
                        className.add(seat, "ico-seat-MA");
                    }
                }
                else if (className.has(seat, "ico-seat-MD")) {
                    className.remove(seat, "ico-seat-MD");
                    className.add(seat, "ico-seat-ME");
                }
                else if (className.has(seat, "ico-seat-MA")) {
                    className.remove(seat, "ico-seat-MA");
                    className.add(seat, "ico-seat-MC");
                }
                else if (className.has(seat, "ico-seat-MSA")) {
                    className.remove(seat, "ico-seat-MSA");
                    className.add(seat, "ico-seat-MC");
                }
                else if (className.has(seat, "ico-seat-ME")) {
                    className.remove(seat, "ico-seat-ME");
                    className.add(seat, "ico-seat-MD");
                }
                if (startSelectedSeat.length > 0) {
                    if (className.has(seat, "ico-seat-ME") || className.has(seat, "ico-seat-MD") || className.has(seat, "ico-seat-MC")) {
                        className.remove(seat, "startIconSeat");
                        seat.style.background = '';
                    } else {
                        seat.style.background = 'url("' + startSelectedSeat[startIndex]["imgUrl"] + '")';
                        className.add(seat, "startIconSeat");
                    }
                }

            },
            changePreState: function (seat) {
                if (className.has(seat.previousElementSibling, "ico-seat-MA")) {

                    className.remove(seat.previousElementSibling, "ico-seat-MA");
                    className.add(seat.previousElementSibling, "ico-seat-MC");
                }
                else if (className.has(seat.previousElementSibling, "ico-seat-MSA")) {

                    className.remove(seat.previousElementSibling, "ico-seat-MSA");
                    className.add(seat.previousElementSibling, "ico-seat-MC");
                }
                else if (className.has(seat.previousElementSibling, "ico-seat-ME")) {

                    className.remove(seat.previousElementSibling, "ico-seat-ME");
                    className.add(seat.previousElementSibling, "ico-seat-MD");
                }
                if (startSelectedSeat.length > 0) {
                    if (!(className.has(seat.previousElementSibling, "ico-seat-MD")) && className.has(seat.previousElementSibling, "startIconSeat")) {
                        className.remove(seat.previousElementSibling, "startIconSeat");
                        seat.previousElementSibling.style.background = '';
                    } else {
                        seat.previousElementSibling.style.background = 'url("' + startSelectedSeat[startIndex]["imgUrl"] + '")';
                        className.add(seat.previousElementSibling, "startIconSeat");
                    }
                }
            },
            changeNextState: function (seat) {
                if (className.has(seat.nextElementSibling, "ico-seat-MA")) {
                    className.remove(seat.nextElementSibling, "ico-seat-MA");
                    className.add(seat.nextElementSibling, "ico-seat-MC");

                } else if (className.has(seat.nextElementSibling, "ico-seat-MSA")) {
                    className.remove(seat.nextElementSibling, "ico-seat-MSA");
                    className.add(seat.nextElementSibling, "ico-seat-MC");
                }
                else if (className.has(seat.nextElementSibling, "ico-seat-ME")) {
                    className.remove(seat.nextElementSibling, "ico-seat-ME");
                    className.add(seat.nextElementSibling, "ico-seat-MD");
                }

                if (startSelectedSeat.length > 0) {
                    if (!(className.has(seat.nextElementSibling, "ico-seat-MD")) && className.has(seat.nextElementSibling, "startIconSeat")) {
                        className.remove(seat.nextElementSibling, "startIconSeat");
                        seat.nextElementSibling.style.background = '';
                    } else {
                        seat.nextElementSibling.style.background = 'url("' + startSelectedSeat[startIndex]["imgUrl"] + '")';
                        className.add(seat.nextElementSibling, "startIconSeat");
                    }
                }
            },
            centerLine: function () {
                var width = nodeList.seat_cell.offsetWidth;
                if (nodeList.seat_bigCell.offsetWidth > document.body.clientWidth) {
                    scollWidth = -((nodeList.seat_bigCell.offsetWidth - document.body.clientWidth) / 2 + 20);
                } else {
                    scollWidth = 0;
                }
                nodeList.centerLine.style.left = (width / 2 + (nodeList.seat_cell.style.paddingLeft - 4)) + 'px';
                nodeList.centerLine.style.height = nodeList.seat_cell.offsetHeight + 'px';
                nodeList.centerLine.style.display = "initial";

            },
            isLogin: function (target) {
                ajax({
                    "url": opts["isLogin"],
                    "method": "get",
                    "data": {},
                    "onSuccess": function (res) {
                        if (res["status"] != 1) {
                            return;
                        }
                        if (res["data"]["status"] == 2) {
                            isLogin = true;
                            custFuncs.selectSeat(target);
                            custFuncs.updateSeat(seatArr);
                            return;
                        } else {
                            webBridge.openUrl(res["data"]["url"], "blank", {
                                "title": "_user/loginview",
                                "style": "3"
                            });
                        }
                    },
                    "onError": function (res) {
                        console.error("网络连接失败(" + res.status + ")");
                    }
                });
            },
            superSeat: function () {
                if (node.querySelectorAll("[data-areaflag='1']").length > 0) {
                    var _nodeArr = Array.prototype.slice.call(node.querySelectorAll("[data-areaflag='1']"));
                    var _width = 0;
                    var _height = 0;
                    var _top = _nodeArr["0"].offsetTop;
                    var _left = _nodeArr["0"].offsetLeft;
                    var topNode = _nodeArr["0"];
                    var leftNode = _nodeArr["0"];
                    var lastRightNode = null;
                    var lastBottomNode = null;
                    each(_nodeArr, function (res) {
                        //console.log(res.getAttribute("data-cell"))
                        if (_width < parseInt(res.getAttribute("data-cell"))) {
                            _width = parseInt(res.getAttribute("data-cell"));
                            lastRightNode = res;
                        }
                        if (_height < res.offsetTop) {
                            _height = res.offsetTop;
                            lastBottomNode = res;
                        }
                        if (_top > res.offsetTop) {
                            _top = res.offsetTop
                            topNode = res;
                        }
                        if (_left > res.offsetLeft) {
                            _left = res.offsetLeft
                            leftNode = res;
                        }
                    });
                    nodeList.superSeat.style.top = topNode.offsetTop + (2 * parseInt(document.documentElement.getAttribute("data-dpr"))) + 'px';
                    nodeList.superSeat.style.left = leftNode.offsetLeft + nodeList.seat_cell.offsetLeft - 2 + 'px';
                    nodeList.superSeat.style.width = lastRightNode.offsetLeft + lastRightNode.offsetWidth - leftNode.offsetLeft + 6 + 'px';
                    nodeList.superSeat.style.height = lastBottomNode.parentElement.offsetTop + lastBottomNode.parentElement.offsetHeight - _nodeArr["0"].offsetTop + 6 + 'px';
                    nodeList.superSeat.style.display = 'inherit';
                }

            },
            getOneKeySeat: function (number) {
                if(that.isLock()) {
                    return;
                }
                that.lock();
                ajax({
                    "url": opts["getOneKeySeat"],
                    "method": "post",
                    "data": {
                        "cinemaNo": opts["cinemaNo"],
                        "showNo": opts["showNo"],
                        "selectCount": number
                    },
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res["status"] != 1) {
                            toast(res.msg);
                            return;
                        }
                        if(opts["isGoldSeat"] == '1' && opts["isCanBuyGold"] == '1') {
                            custFuncs.selectedSeat(res.data.oneKeyResult1);
                        } else {
                            custFuncs.selectedSeat(res.data.oneKeyResult2);
                        }
                    },
                    "onError": function (res) {
                        console.error("网络连接失败(" + res.status + ")");
                        that.unLock();
                    }
                });
            },
            selectedSeat: function (object) {
                if(object.length <= 0) {
                    toast('哎呀，系统找不到最佳座位了，请自行选择');
                    return;
                }
                var _seatRowDomList = {};
                each(object, function (item) {
                    if (!_seatRowDomList[item.ShowRowNo]) {
                        _seatRowDomList[item.ShowRowNo] = nodeList.seat_cell.querySelector("[data-row='" + item["ShowRowNo"] + "']");
                    }
                    custFuncs.changeState(_seatRowDomList[item.ShowRowNo].querySelector("[data-column='" + item["ShowColNo"] + "']"));
                    seatArr.push(item.ShowRowNo + '|' + item.ShowColNo);
                });
                custFuncs.updateSeat(seatArr);
            }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            seatHeader = parseNode(document.querySelector("#seat_header"));
            data = _data;
            custFuncs.centerLine();
            custFuncs.superSeat();
            evtFuncs.scollSeat();
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.cancelSeat = custFuncs.cancelSeat;
        that.getOneKeySeat = custFuncs.getOneKeySeat;
        return that;
    }
});