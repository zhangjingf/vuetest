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
    var content = require("sea/rechargeSeaVIPCard/content");
    var virtualLink = require("lib/util/virtualLink");
    var storageMessager = require("lib/evt/storageMessager");
    var webBridge = require("sea/webBridge");
    var util = require("sea/utils");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_content = null;

    //---------------事件定义----------------
    var evtFuncs = {
        changeUserData: function (ev) {
            if(ev.data.changeData=='true') {
                webBridge.openUrl(util.getCurrentURL(), 'self');
            }
        }
    }

    //---------------子模块定义---------------
    var modInit = function () {

        m_content = content(nodeList.content, opts);
        m_content.init();

        virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function () {
        storageMessager.bind("changeUserData",evtFuncs.changeUserData);
    }

    //-----------------自定义函数-------------
    var custFuncs = {}

    //-----------------初始化----------------
    var init = function (_opts) {
        opts = _opts || {};

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