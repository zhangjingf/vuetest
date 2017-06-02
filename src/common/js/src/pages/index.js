/**
 * 首页
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var webBridge = require("sea/webBridge");
    var indexFlash = require("sea/index/flash");
    var movies = require("sea/index/movies");
    var virtualLink = require("lib/util/virtualLink");
    var storageMessager = require('lib/evt/storageMessager');
    var util = require("sea/utils");
    var cookie = require("lib/util/cookie");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_indexFlash = null;
    var m_movies = null;

    //---------------事件定义----------------
    var evtFuncs = {
        sign: function () {
            m_indexFlash.sign();
        },
        reload: function () {
            webBridge.openUrl(util.getCurrentURL(), 'self');
        }
    }

    //---------------子模块定义---------------
    var modInit = function () {
        m_indexFlash = indexFlash(nodeList.indexFlash, opts);
        m_indexFlash.init();

        m_movies = movies(nodeList.movies, opts);
        m_movies.init();

        virtualLink('data-url');

    }

    //-----------------绑定事件---------------
    var bindEvents = function () {
        storageMessager.bind('selectedCityChanged', evtFuncs.reload);
        storageMessager.bind('userChanged', evtFuncs.reload);//登录刷新页面
        storageMessager.bind('sign', evtFuncs.sign);
        webBridge.changeCity = function (value) {
            custFuncs.setCookies(value);
        }
    }

    //-----------------自定义函数-------------
    var custFuncs = {
        setCookies: function (value) {
            var _host = location.host;
            var _point = _host.indexOf(".");
            _host = _host.substring(_point, _host.length);
            cookie.set("areano", value, {
                expire: 300000,
                path: "/",
                domain: _host,
                encode: true
            });
            webBridge.openUrl(util.getCurrentURL(), 'self');
        }
    }

    //-----------------初始化----------------
    var init = function (_opts) {
        opts = _opts;
        nodeList = {
            indexFlash: queryNode("#m_indexFlash"),
            movies: queryNode("#m_movies"),
            pbd: queryNode("#m_pbd")
        };
        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});
