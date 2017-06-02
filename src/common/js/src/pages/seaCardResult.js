/**
 *
 * 开通海洋会员卡
 *
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var content = require("sea/seaCardResult/result");
    var URL = require("lib/util/URL");
    var queryToJson = require("lib/json/queryToJson");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_content = null;

    //---------------事件定义----------------
    var evtFuncs = {
        back: function () {
            console.log('1111');
        }
    }

    //---------------子模块定义---------------
    var modInit = function () {

        m_content = content(nodeList.content, opts);
        m_content.init();

    }

    //-----------------绑定事件---------------
    var bindEvents = function () {
        webBridge.onBackPressed = function () {
            evtFuncs.back();
            var isIPhone = navigator.appVersion.match(/iphone/gi);
            if (isIPhone) {
                return "turnBackSucceed";
            }
        }
    }

    //-----------------自定义函数-------------
    var custFuncs = {
    }

    //-----------------初始化----------------
    var init = function (_opts) {
        opts = _opts || {};
        opts.url = queryToJson(URL.parse(location.href)["query"]);

        nodeList = {
            content: queryNode("#m_content")
        }

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});