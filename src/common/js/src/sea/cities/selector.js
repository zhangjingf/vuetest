/**
 * 城市选择
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var queryNode = require("lib/dom/queryNode");
    var sizzle = require("lib/dom/sizzle");
    var className = require("lib/dom/className");
    var pinyin = require("lib/util/pinyin");
    var trim = require("lib/str/trim");
    var encodePattern = require("lib/str/encodePattern");
    var each = require("lib/util/each");
    var encodeHTML = require("lib/str/encodeHTML");
    var scrollTo = require("lib/util/scrollTo");
    var touch = require("touch");
    var showMessage = require("sea/showMessage");
    var webBridge = require("sea/webBridge");

    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var flagCity = true; /*标识当前城市是否为列表内*/
        var areaHash = null;
        var areaHtml = null;
        var areaFilters = null;

        //---------------事件定义----------------
        var evtFuncs = {
            charFilter: function(ev) {
                if (opts["scrollBox"].clientHeight == opts["scrollBox"].scrollHeight) {
                    return;
                }

                var target = ev.target;
                var ch = target.dataset["key"];
                var dt = queryNode("[data-key=" + ch + "]", nodeList.cities);
                opts["scrollBox"].scrollTop = dt.offsetTop;
            },
            tap: function(ev) {
                var target = ev.target;
                var pnode = target;

                /* 点击的当前城市 */
                if (pnode.getAttribute("node-name") == "orgCurCity" || pnode.getAttribute("data-area") == nodeList.orgCurCity[0].getAttribute('data-area')) {
                    webBridge.close();
                    return;
                }

                while (pnode.tagName.toLowerCase() != "dd") {
                    pnode = pnode.parentNode;
                }
                var query = {
                    "areaName": queryNode("div", pnode).innerHTML,
                    "areaNo": pnode.dataset["area"]
                };

                for (var i = 0; i < nodeList.cityItem.length; i++) {
                    if (nodeList.cityItem[i].getAttribute('data-area') == pnode.dataset["area"]) {
                        flagCity = false;
                        break;
                    }
                }
                if (pnode.getAttribute("node-name") == "curCity") {
                    if (flagCity) {
                        showMessage("抱歉，该城市暂未开设影院!");
                    } else if (!nodeList.curCity.getAttribute("data-area")) {
                        showMessage("定位服务未开启，请进入系统设<br/>置中开启定位", function() {
                                webBridge.getCurrentRegion(function(result) {
                                    opts["currentRegion"] = result["data"];
                                    custFuncs.initView();
                                }, true);
                            }

                        )
                    };
                    return;
                }
                that.fire("select", query);
                each(nodeList.city, function(item) {
                    var div = item.nextElementSibling;
                    var span = queryNode("span", div);
                    className.remove(span, "icon-city-right");
                });
                className.add(queryNode("span", pnode), "icon-city-right");
            }
        }

        //---------------子模块定义---------------
        var modInit = function() {}

        //-----------------绑定事件---------------
        var bindEvents = function() {
            //touch.on(nodeList.filters, "tap", "a", evtFuncs.charFilter);
            touch.on(node, "tap", "dd", evtFuncs.tap);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            initView: function() {
                if ('areaName' in opts["currentRegion"]) {
                    nodeList.curCityName.innerHTML = opts["currentRegion"]["areaName"];
                    nodeList.curCity.dataset["area"] = opts["currentRegion"]["areaNo"];
                } else {
                    nodeList.curCityName.innerHTML = '定位失败，点击重试';
                }
                if (opts["selectedRegion"] != undefined && opts["selectedRegion"] != "") {
                    each(nodeList.city, function(item) {
                        var div = item.nextElementSibling;
                        var span = queryNode("span", div);
                        className.remove(span, "icon-city-right");
                        if (item.innerHTML == opts["selectedRegion"]["areaName"]) {
                            className.add(span, "icon-city-right");
                        }
                    });
                }
            },
            renderView: function(keyword) {
                //if (areaHash == null) {
                //    return;
                //}

                keyword = trim(keyword);

                var dts = sizzle("[data-key]", nodeList.cities);
                var dds = sizzle("dd>div", nodeList.cities);
                each(dts.concat(dds), function(item) {
                    item.style.display = "none";
                });
                //nodeList.filters.style.display = "none";
                that.fire("controlSide", 0);

                if (keyword.length == 0) {
                    // 恢复原样
                    //nodeList.cities.innerHTML = areaHtml;
                    //nodeList.filters.innerHTML = areaFilters;
                    each(dts.concat(dds), function(item) {
                        item.style.display = "block";
                    });
                    //nodeList.filters.style.display = "block";
                    that.fire("controlSide", 1);

                    nodeList.queryResult.innerHTML = "城市列表";
                    return;
                }

                var reg = new RegExp(encodePattern(keyword), "i");

                each(nodeList.city, function(item) {
                    var city = item.innerHTML;
                    var camelChars = pinyin.getCamelChars(city);
                    var firstChar = camelChars.charAt(0);
                    if (!reg.test(city) && !reg.test(camelChars) && !reg.test(firstChar)) {
                        return;
                    } else {
                        item.style.display = "block";
                        item.nextElementSibling.style.display = "block";
                    }
                });
                nodeList.queryResult.innerHTML = "查询结果：";
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
        that.initView = custFuncs.initView;
        that.search = custFuncs.renderView;

        return that;
    }
});