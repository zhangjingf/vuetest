/**
 * 卖品列表操作页面
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var each = require("lib/util/each");
    var touch = require("touch");
    var webBridge = require("sea/webBridge");
    var closest = require("lib/dom/closest");
    var className = require("lib/dom/className");
    var ajax = require("lib/io/ajax");
    var insertHTML = require("lib/dom/insertHTML");
    var loading = require("sea/dialog/loading");
    var sizzle = require("lib/dom/sizzle");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var selectGoodsAttr = [];
        var selectedCinemaNo = null;
        var m_loading = null;
        var hasList = false;

        //---------------事件定义----------------
        var evtFuncs = {
            add: function (ev) {
                var num = parseInt(closest(ev.target, "[node-name='add']", node).previousElementSibling.innerHTML);
                var numNode = closest(ev.target, "[node-name='add']", node).previousElementSibling;
                var typeNode = closest(ev.target, "[data-ProCode]", node);
                var changeNum = closest(ev.target, "[data-change]", node);
                var ProCode = typeNode.getAttribute("data-ProCode");
                var proName = typeNode.getAttribute("data-proName");

                className.remove(changeNum, "change-num-t");
                className.add(changeNum, "change-num-o");
                num++;
                numNode.innerHTML = num;
                selectedCinemaNo = closest(ev.target, "[data-cinemano]", node).getAttribute("data-cinemano");
                selectGoodsAttr[ProCode + '_' + proName] = num;
                custFuncs.intSelectList(selectGoodsAttr);
            },
            minus: function (ev) {
                var num = parseInt(closest(ev.target, "[node-name='minus']", node).nextElementSibling.innerHTML);
                var numNode = closest(ev.target, "[node-name='minus']", node).nextElementSibling;
                var typeNode = closest(ev.target, "[data-ProCode]", node);
                var changeNum = closest(ev.target, "[data-change]", node);
                var ProCode = typeNode.getAttribute("data-ProCode");
                var proName = typeNode.getAttribute("data-proName");
                if (num > 0) {
                    num--;
                    numNode.innerHTML = num;
                    selectGoodsAttr[ProCode + '_' + proName] = num;
                }
                if (num <= 0) {
                    className.remove(changeNum, "change-num-o");
                    className.add(changeNum, "change-num-t");
                    delete selectGoodsAttr[ProCode + '_' + proName];
                }
                custFuncs.intSelectList(selectGoodsAttr);
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_loading = loading();
            m_loading.init();
            m_loading.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.wrapLsit,"tap","[node-name='minus']",evtFuncs.minus);
            touch.on(nodeList.wrapLsit,"tap","[node-name='add']",evtFuncs.add);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            intSelectList: function (arr) {
                var selectList = nodeList.selectList;
                if (custFuncs.arrLength(arr) > 0) {
                    var html = '<div>您选择了:</div>';
                    for (var key in arr) {
                        html += '<div><p><span>' + key.split("_")[1] + '</span><span>×' + arr[key] + '</span> </p></div>';
                    }
                } else {
                    html = '';
                }
                selectList.innerHTML = html;
                that.fire("selectMeal", {"selectGoodsAttr": arr,"selectedCinemaNo":selectedCinemaNo})
            },
            arrLength: function count(o) {
                var t = typeof o;
                if (t == 'string') {
                    return o.length;
                } else if (t == 'object') {
                    var n = 0;
                    for (var i in o) {
                        n++;
                    }
                    return n;
                }
                return false;
            },
            cinemaMealInfo: function (cinemaNo) {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                /*判断是否已经加载该影院的商品列表*/
                /*清空选中记录*/

                selectGoodsAttr = [];
                custFuncs.intSelectList(selectGoodsAttr);


                nodeList = parseNode(node);
                var packageList = nodeList.packageList;
                var isArray = packageList instanceof Array;
                if (isArray) {
                    each(packageList, function (item) {
                        if (item.getAttribute("data-cinemaNo") == cinemaNo) {
                            hasList = true;
                        }
                    });
                } else {
                    if (packageList.getAttribute("data-cinemaNo") == cinemaNo) {
                        hasList = true;
                    }
                }
                if (hasList) {
                    that.unLock();
                    var hasgoodList = null;
                    if (isArray) {
                        each(packageList, function (item) {
                            if (item.getAttribute("data-cinemaNo") != cinemaNo) {
                                className.add(item, "hidden");
                            } else {
                                hasgoodList = parseNode(item);
                                /*缺省取消状态*/
                                className.remove(item, "hidden");
                            }
                        });
                    } else {
                        hasgoodList = parseNode(packageList);
                    }
                    /*处理数据为空的状态*/
                   if(hasgoodList.changeNum) {
                       className.remove(hasgoodList.changeNum,"change-num-o");
                       className.add(hasgoodList.changeNum,"change-num-t");
                       if(hasgoodList.num instanceof  Array) {
                           each(hasgoodList.num, function (item) {
                               item.innerHTML = '0';
                           })
                       } else {
                           hasgoodList.num.innerHTML = '0';
                       }
                   }

                   hasList = false;
                } else {
                    m_loading.show();
                    /*隐藏列表*/
                    if (isArray) {
                        each(packageList, function (item) {
                            className.add(item, "hidden");
                        });
                    } else {
                        className.add(packageList, "hidden");
                    }

                    ajax({
                        "url": opts["pageInt"]["cinemaMealInfo"] + "&cinemaNo=" + cinemaNo,
                        "onSuccess": function (res) {
                            that.unLock();
                            if (res["status"] != 1) {
                                m_loading.hide();
                                console.log(res["msg"]);
                                return;
                            }
                            var goodsHtml = '<ul node-name="packageList" data-cinemano="' + cinemaNo + '">';
                            //console.log(res["data"]["goods"])
                            if (!res["data"]) {
                                goodsHtml += '<div class="empty">\
                                                <div>\
                                                    <img src="./images/error.png">\
                                                    <div class="tips">唉，这家影城暂时没有美食在售哦！</div>\
                                                </div>\
                                             </div>';
                            } else {
                                each(res["data"]["goods"], function (item) {
                                    goodsHtml += '<li data-procode="'+item["ProCode"]+'" data-proname="' + item["ProName"] + '">\
                                             <div>\
                                                <img src="' + item["ImgUrl"] + '" alt="">\
                                             </div>\
                                         <div class="package-word-inf">\
                                            <h2 class="line-o-overflow">' + item["ProName"] + '</h2>\
                                            <p class="line-o-overflow">' + item["Memo"] + '</p>\
                                         <div>\
                                         <span class="price">¥' + item["SettlePrice"] + '</span>\
                                         <span class="old-price">¥' + item["StdPrice"] + '</span>\
                                         <div class="change-num change-num-t" data-change="changeNum" node-name="changeNum">\
                                            <div class="add" node-name="minus">\
                                            <span></span>\
                                         </div>\
                                             <div node-name="num">0</div>\
                                            <div class="minus" node-name="add">\
                                            <span></span>\
                                            <span></span>\
                                         </div>\
                                         </div>\
                                         </div>\
                                         </div>\
                                         </li>'
                                });
                            }
                            goodsHtml += '</ul>';
                            insertHTML(nodeList.wrapLsit, goodsHtml, "afterbegin");
                            m_loading.hide();
                        },
                        "onError": function (req) {
                            m_loading.hide();
                            that.unLock();
                            console.log("网络连接失败: " + req.status);
                        }
                    });
                }
            },
            changeImgSrc: function () {
                var imgArr = sizzle("img",node);
                each(imgArr, function (item) {
                    if(item.getAttribute("data-src")){
                        if(item.getAttribute("data-src").match(/[^\s]+\.(jpg|gif|png|bmp)/i)) {
                            item.setAttribute("src",item.getAttribute("data-src"));
                            item.setAttribute("data-src","");
                        }
                    }
                })
            }
        }
        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            custFuncs.changeImgSrc();
            data = _data;
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.cinemaMealInfo = custFuncs.cinemaMealInfo;
        return that;
    }
});
