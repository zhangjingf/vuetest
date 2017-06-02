/**
 *
 *座位图
 * 座位图放大缩小为了防止iphone放大变模糊，在一开始就用放大的尺寸写页面，然后在初始化的时候缩小到需要的尺寸，
 *
 */
define(function(require, exports, module) {
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
    var utils = require("sea/utils");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_seatZoom = null;
        var isLogin = false;
        var zoomOnce = true;
        var seatArr = [];

        //---------------事件定义----------------
        var evtFuncs = {
            selectSeat: function(ev) {
                if (opts["isLogin"] != '1') {
                    webBridge.openUrl(opts["loginUrl"]);
                    return;
                }
                if (ev.target.classList.contains("empty") || ev.target.classList.contains("icon-seat-mC") || ev.target.classList.contains("icon-seat-mC2")) {
                    /*走廊,已选座位不做操作*/
                    return;
                }
                var colNode = ev.target;
                if(zoomOnce) {
                    nodeList.rowNumber.style.display = 'none';
                    nodeList.seatLoading.style.display = '';
                    nodeList.seatLoading.style.display.opacity = '.3';
                    m_seatZoom.zoom(1, colNode.offsetLeft, colNode.offsetTop, 1);
                    var _ScrollX = m_seatZoom.maxScrollX;
                    var _ScrollY = m_seatZoom.maxScrollY;
                    if (-ev.target.offsetLeft > _ScrollX) {

                        _ScrollX = -ev.target.offsetLeft;
                    }
                    if (-ev.target.offsetTop + 80 > 0) {
                        _ScrollY = 0;
                    } else if (-ev.target.offsetTop + 80 > _ScrollY) {
                        _ScrollY = -ev.target.offsetTop + 50;
                    }
                    var transitionEvent = custFuncs.whichTransitionEvent(nodeList.seatList);
                    transitionEvent && nodeList.seatList.addEventListener(transitionEvent, function () {
                        if(zoomOnce) {
                            m_seatZoom.scrollTo(_ScrollX, _ScrollY, 500);
                            nodeList.rowNumber.style.display = 'inline-block';
                            nodeList.seatLoading.style.display = 'none';
                            zoomOnce = false;
                        }

                    });
                }

                custFuncs.selectSeat(colNode);
            },
            fiexdRowNumber: function() {
                requestAnimationFrame(function() {
                    nodeList.rowNumber.style.transform = 'translateX(' + (-m_seatZoom.x) / m_seatZoom.scale + 'px)' + 'translateZ(0px)';
                });

            }
        }

        //---------------子模块定义---------------
        var modInit = function() {
            m_seatZoom = new zoom(nodeList.seatList, {
                zoom: true,
                scrollX: true,
                scrollY: true,
                 //wheelAction: 'zoom',
                 //mouseWheel: true, //发布时设为false
                fixedScrollbar: true,
                zoomMax: 1.8,
                zoomMin: .3
            });
        };

        //-----------------绑定事件---------------
        var bindEvents = function() {
            touch.on(nodeList.seats, "tap", "i", evtFuncs.selectSeat);
            var mObserv = window.MutationObserver || window.WebKitMutationObserver;
            var observ = new mObserv(evtFuncs.fiexdRowNumber);
            observ.observe(nodeList.listWrap, {
                attributes: true,
                childList: false,
                characterData: false
            });
        };

        //-----------------自定义函数-------------
        var custFuncs = {
            //选座操作
            selectSeat: function(colNode) {
                /*
                 *       1 可选情侣座
                 *       0 可选单座位
                 *       -1 不可选
                 *       -2 取消本座位
                 *       -3 取消本座位跟前边座位
                 *       -4 取消本作为跟后边座位
                 *       -5 取消情侣座
                 */
                var result = custFuncs.checkSeat(colNode);
                var rowNumber = colNode.parentNode.getAttribute("data-row");
                var colNumber = colNode.getAttribute("data-column");
                if ((seatArr.length > 2 && result == 1) || (seatArr.length == 4 && result == 0) || (seatArr.length >= 4 && result >= 0)) {
                    showMessage("最多支持选择四个座位");
                    return;
                }
                if (result == 1) {
                    seatArr.push(rowNumber + '|' + colNumber.match(/\d+/g)[0]);
                    seatArr.push(rowNumber + '|' + colNumber.match(/\d+/g)[1]);
                } else if (result == 0) {
                    seatArr.push(rowNumber + '|' + colNumber);
                } else if (result == -1) {
                    showMessage("请连续选择座位，不要留下单个的空闲座位");
                } else if (result == -2) {
                    var _index = seatArr.indexOf(rowNumber + '|' + colNumber);
                    seatArr.splice(_index, 1);
                } else if (result == -3) {
                    var prevSeat = rowNumber + '|' + colNode.previousElementSibling.getAttribute("data-column");
                    for (var i = seatArr.length; i > 0; i--) {
                        if ((seatArr[i - 1] == prevSeat) || (seatArr[i - 1] == rowNumber + '|' + colNumber)) {
                            seatArr.splice(i - 1, 1);
                        }
                    }
                } else if (result == -4) {
                    var nextSeat = rowNumber + '|' + colNode.nextElementSibling.getAttribute("data-column");
                    for (var i = seatArr.length; i > 0; i--) {
                        if ((seatArr[i - 1] == nextSeat) || (seatArr[i - 1] == rowNumber + '|' + colNumber)) {
                            seatArr.splice(i - 1, 1);
                        }
                    }
                } else if (result == -5) {
                    for (var i = seatArr.length; i > 0; i--) {
                        if ((seatArr[i - 1] == rowNumber + '|' + colNumber.match(/\d+/g)[0]) || (seatArr[i - 1] == rowNumber + '|' + colNumber.match(/\d+/g)[1])) {
                            seatArr.splice(i - 1, 1);
                        }
                    }
                } else {
                    console.log("不存在的返回值");
                }
                custFuncs.changeSeatState(colNode, result);
                that.fire('changeSelectedSeat', { 'seatArr': seatArr });
            },

            checkSeat: function(colNode) {
                /*
                 * 0 走廊
                 * 1 未选
                 * 2 已售
                 * 3 已选
                 * 4 情侣座 未选
                 * 5 情侣座 已选
                 * */
                var rowNode = colNode.parentElement;
                var cellIndex = -1;
                var seatRow = '';
                each(rowNode.childNodes, function(item, index) {
                    if (item.nodeType != 1) {
                        return;
                    }
                    if (item == colNode) {
                        cellIndex = item.getAttribute("data-cell");
                    }
                    if (item.classList.contains("empty")) {
                        seatRow += "0";
                    } else if (item.classList.contains("icon-seat-mB")) {
                        seatRow += "1";
                    } else if (item.classList.contains("icon-seat-mC") || item.classList.contains("icon-seat-mC2")) {
                        seatRow += "2";
                    } else if (item.classList.contains("icon-seat-mA") || item.classList.contains("icon-seat-mA3")) {
                        seatRow += "3";
                    } else if (item.classList.contains("icon-seat-mB2")) {
                        seatRow += "4";
                    } else if (item.classList.contains("icon-seat-mA2")) {
                        seatRow += "5";
                    }
                });
                var emptyIndex = seatRow.indexOf("0");
                if (emptyIndex != -1) {
                    if (emptyIndex > cellIndex) {
                        seatRow = seatRow.substr(0, emptyIndex);
                    } else {
                        var tmpSeatRow = seatRow.substr(0, parseInt(cellIndex) + 1);
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
                // 选中座位索引
                var ch = seatRow.charAt(cellIndex);
                /*
                 * return
                 *
                 *       1 可选情侣座
                 *       0 可选单座位
                 *       -1 不可选
                 *       -2 取消本座位
                 *       -3 取消本座位跟前边座位
                 *       -4 取消本作为跟后边座位
                 *       -5 取消情侣座
                 * */
                //普通座位选择
                if (ch == 1) {
                    if (/^[^1]*11[^1]*$/.test(seatRow)) {
                        //当前作为段只有两个连续空位，可选
                        return 0;
                    }

                    if (seatRow.charAt(cellIndex - 1) == '1' && seatRow.charAt(cellIndex + 1) == '1') {
                        if (seatRow.charAt(cellIndex + 2) != 1) {
                            return -1;
                        } else if (seatRow.charAt(cellIndex - 2) != 1) {
                            return -1;
                        }
                    }
                } else if (ch == 4) {
                    return 1;
                } else if (ch == 5) {
                    return -5;
                } else if (ch == 3) {
                    if (seatRow.charAt(cellIndex - 1) == '3' && seatRow.charAt(cellIndex + 1) == '3') {
                        if (seatRow.charAt(cellIndex - 2) == '3') {
                            return -4;
                        }
                        return -3;
                    }
                    //取消座位
                    return -2; //取消当前座位

                }
                return 0;
            },
            cancelSeat: function(seatString) {
                var row = seatString.split("|")[0];
                var column = seatString.split("|")[1];
                var target = null;
                var rowLine = null;
                each(nodeList.seats.childNodes, function(item) {
                    if (item.nodeType != "1") {
                        return;
                    }
                    if (item.getAttribute("data-row") == row) {
                        rowLine = item;
                    }
                });
                /*情侣座选座，通过下边的选中座位按钮取消fire值找不到对应的节点，判断操作两次*/
                each(rowLine.childNodes, function(item) {
                    if (item.nodeType != "1") {
                        return;
                    }
                    if (/\_/.test(item.getAttribute("data-column"))) {

                        var seatColA = item.getAttribute("data-column").match(/\d+/g)[0];
                        var seatColB = item.getAttribute("data-column").match(/\d+/g)[1];

                        if (seatColA == column || seatColB == column) {
                            target = item;
                        }
                    } else if (item.getAttribute("data-column") == column) {
                        target = item;
                    }
                });
                custFuncs.selectSeat(target);
            },
            changeSeatState: function(colNode, result) {
                /*
                 *       1 可选情侣座
                 *       0 可选单座位
                 *       -1 不可选
                 *       -2 取消本座位
                 *       -3 取消本座位跟前边座位
                 *       -4 取消本作为跟后边座位
                 *       -5取消情侣座
                 */
                if (result == 1) {
                    colNode.classList.remove('icon-seat-mB2');
                    colNode.classList.add('icon-seat-mA2');
                } else if (result == 0) {
                    colNode.classList.remove('icon-seat-mB');
                    if (colNode.getAttribute("data-areaflag") == '1') {
                        colNode.classList.add('icon-seat-mA3');
                    } else {
                        colNode.classList.add('icon-seat-mA');
                    }
                } else if (result == -2) {
                    if (colNode.getAttribute("data-areaflag") == '1') {
                        colNode.classList.remove('icon-seat-mA3');
                    } else {
                        colNode.classList.remove('icon-seat-mA');
                    }
                    colNode.classList.add('icon-seat-mB');
                } else if (result == -3) {
                    if (colNode.getAttribute("data-areaflag") == '1') {
                        colNode.classList.remove('icon-seat-mA3');
                    } else {
                        colNode.classList.remove('icon-seat-mA');
                    }
                    colNode.classList.add('icon-seat-mB');
                    if (colNode.previousElementSibling.getAttribute("data-areaflag") == '1') {
                        colNode.previousElementSibling.classList.remove('icon-seat-mA3');
                    } else {
                        colNode.previousElementSibling.classList.remove('icon-seat-mA');
                    }
                    colNode.previousElementSibling.classList.add('icon-seat-mB');
                } else if (result == -4) {
                    if (colNode.getAttribute("data-areaflag") == '1') {
                        colNode.classList.remove('icon-seat-mA3');
                    } else {
                        colNode.classList.remove('icon-seat-mA');
                    }
                    colNode.classList.add('icon-seat-mB');

                    if (colNode.previousElementSibling.getAttribute("data-areaflag") == '1') {
                        colNode.nextElementSibling.classList.remove('icon-seat-mA3');
                    } else {
                        colNode.nextElementSibling.classList.remove('icon-seat-mA');
                    }
                    colNode.nextElementSibling.classList.add('icon-seat-mB');
                } else if (result == -5) {
                    colNode.classList.remove('icon-seat-mA2');
                    colNode.classList.add('icon-seat-mB2');
                }
            },
            isLogin: function(target) {
                ajax({
                    "url": opts["isLogin"],
                    "method": "get",
                    "data": {},
                    "onSuccess": function(res) {
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
                    "onError": function(res) {
                        console.error("网络连接失败(" + res.status + ")");
                    }
                });
            },
            superSeatBox: function() {
                if (node.querySelectorAll("[data-areaflag='1']").length > 0) {
                    var _nodeArr = Array.prototype.slice.call(node.querySelectorAll("[data-areaflag='1']"));
                    //获取正方形的顶点坐标跟长宽
                    var _width = 0;
                    var _height = 0;

                    var _top = _nodeArr["0"].offsetTop;
                    var _left = _nodeArr["0"].offsetLeft;

                    var topNode = _nodeArr["0"];
                    var leftNode = _nodeArr["0"];

                    var lastRightNode = null;
                    var lastBottomNode = null;

                    each(_nodeArr, function(res, index) {

                        if (_width < res.offsetLeft) {
                            _width = res.offsetLeft;
                            lastRightNode = res;
                        }
                        if (_height < res.offsetTop) {
                            _height = res.offsetTop;
                            lastBottomNode = res;
                        }
                        if (_top > res.offsetTop) {
                            _top = res.offsetTop;
                            topNode = res;
                        }
                        if (_left > res.offsetLeft) {
                            _left = res.offsetLeft;
                            leftNode = res;
                        }
                    });
                    nodeList.superSeatBox.style.top = topNode.offsetTop - utils.remToPixel(.3) + 'px';
                    nodeList.superSeatBox.style.left = leftNode.offsetLeft + nodeList.seats.offsetLeft - 4 + 'px';
                    nodeList.superSeatBox.style.width = lastRightNode.offsetLeft + lastRightNode.offsetWidth - leftNode.offsetLeft + 6 + 'px';
                    nodeList.superSeatBox.style.height = lastBottomNode.parentElement.offsetTop + lastBottomNode.parentElement.offsetHeight - _nodeArr["0"].offsetTop + utils.remToPixel(.6) + 'px';
                    nodeList.superSeatBox.style.display = 'inherit';
                }

            },
            centerLine: function() {
                var width = nodeList.seats.offsetWidth;
                nodeList.screenCenter.style.transform = 'translateX(' + ((width - nodeList.screenCenter.offsetWidth) / 2) + 'px)';
                nodeList.screenCenter.style.visibility = 'visible';
                //var zoomNumber = parseFloat(document.documentElement.clientWidth / width) > 1 ? 1 : parseFloat(document.documentElement.clientWidth / width).toFixed(3);
                m_seatZoom.zoom(.5);
                var scollWidth = nodeList.seats.offsetWidth / 2;
                nodeList.centerLine.style.left = scollWidth + 'px';
                nodeList.centerLine.style.top = -utils.remToPixel(1) + 'px';
                nodeList.centerLine.style.height = (nodeList.seats.offsetHeight + utils.remToPixel(3)) + 'px';
                nodeList.centerLine.style.display = "initial";

                if(m_seatZoom.wrapperWidth < m_seatZoom.scrollerWidth) {
                    setTimeout(function () {
                        var _A = nodeList.screen.offsetLeft + (nodeList.screen.offsetWidth/2)-utils.remToPixel(1);
                        m_seatZoom.scrollTo(-(m_seatZoom.scrollerWidth *.5)+_A,0,2);

                    },10);
                }
                setTimeout(function () {
                    nodeList.seatLoading.style.display = 'none';
                },30)
            },
            initView: function() {
                custFuncs.centerLine();
                custFuncs.superSeatBox();
            },
            updateIslogin: function() {
                opts["isLogin"] = '1';
            },
            whichTransitionEvent: function (el) {
                var t;
                var transitions = {
                    'transition': 'transitionend',
                    'OTransition': 'oTransitionEnd',
                    'MozTransition': 'transitionend',
                    'WebkitTransition': 'webkitTransitionEnd',
                    'MsTransition': 'msTransitionEnd'
                }
                for (t in transitions) {
                    if (el.style[t] !== undefined) {
                        return transitions[t];
                    }
                }
            }
        }

        //-----------------初始化----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
            custFuncs.initView();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.updateIslogin = custFuncs.updateIslogin;
        that.cancelSeat = custFuncs.cancelSeat;
        return that;
    }
});