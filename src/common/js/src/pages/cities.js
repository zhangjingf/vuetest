/**
 * 城市定位
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var when = require("lib/util/when");
    var storageMessager = require("lib/evt/storageMessager");
    var header = require("sea/header");
    var search = require("sea/cities/search");
    var selector = require("sea/cities/selector");
    var filter = require("sea/cities/filter");
    var webBridge = require("sea/webBridge");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_search = null;
    var m_selector = null;
    var m_filter = null;

    //---------------事件定义----------------
    var evtFuncs = {
        input: function (ev) {
            m_selector.search(ev.data.value);
        },
        select: function (ev) {
            var city = ev.data;
            webBridge.setSelectedRegion(city);
            custFuncs.setCookies("areano",city["areaNo"]);
            storageMessager.send("selectedCityChanged", city);
            webBridge.close();
           /* if (that.isLock()) {
                return;
            }
            that.lock();
            //showMessage(city["areaNo"]);
            ajax({
                "url": opts["location"] + "&areaNo=" + city["areaNo"],
                "method": "get",
                "onSuccess": function (res) {
                    that.unLock();
                    storageMessager.send("selectedCityChanged", city);
                    if (res["status"] != 1) {
                        showMessage(res["msg"]);
                        return;
                    }
                    console.log(res);
                },
                "onError": function (req) {
                    that.unLock();
                    console.error("操作失败，状态码为：" + req["status"]);
                }
            });
            webBridge.close();*/
        },
        controlSide: function (event) {
            m_filter.controlSide(event.data);

        }
    }

    //---------------子模块定义---------------
    var modInit = function () {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }

        m_search = search(nodeList.search, opts);
        m_search.init();

        m_selector = selector(nodeList.selector, opts);
        m_selector.init();

        m_filter = filter(nodeList.filter, opts);
        m_filter.init();
    }

    //-----------------绑定事件---------------
    var bindEvents = function () {
        m_search.bind("input", evtFuncs.input);
        m_selector.bind("select", evtFuncs.select);

        m_selector.bind("controlSide", evtFuncs.controlSide);
    }

    //-----------------自定义函数-------------
    var custFuncs = {
        initView: function () {
            //custFuncs.initCurrentRegion();
           /* when.all([custFuncs.initSelectedRegion,custFuncs.initCurrentRegion]).then(function () {
                m_selector.initView();
            })*/
            custFuncs.initSelectedRegion();
            setTimeout(function () {
                custFuncs.initCurrentRegion()
                    .then(function () {
                        m_selector.initView();
                    });
            },50)

        },
        initCurrentRegion: function () {
            var defer = when.defer();
            webBridge.getCurrentRegion(function (result) {
                opts["currentRegion"] = result["data"];
                //console.log("22222")
               /* if(result["code"] == 1){
                    defer.reject();
                 } else {
                    defer.resolve();
                }*/
                defer.resolve();
            });
            return defer.promise;

        },
        initSelectedRegion: function () {
            var defer = when.defer();
            webBridge.getSelectedRegion(function (result) {
                opts["selectedRegion"] = result["data"];
                defer.resolve();
            });
            return defer.promise;
        },
        setCookies: function (name, value) {
            //设置名称为name,值为value的Cookie
            var expdate = new Date();   //初始化时间
            expdate.setTime(expdate.getTime() + 300000 * 60 * 1000);   //时间
            var _host = location.host;
            var _point = _host.indexOf(".");
            _host = _host.substring(_point,_host.length);
            document.cookie = name+"="+value+";expires="+expdate.toGMTString()+";path=/";
        }
    }

    //-----------------初始化----------------
    var init = function (_opts) {
        opts = _opts || {};

        //alert(123);
        nodeList = {
            header: queryNode("#m_header"),
            search: queryNode("#m_search"),
            selector: queryNode("#m_selector"),
            scrollBox: queryNode("#scrollBox"),
            filter: queryNode("#m_filter")
        }

        opts["scrollBox"] = nodeList.scrollBox;
        modInit();
        bindEvents();
        custFuncs.initView();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});