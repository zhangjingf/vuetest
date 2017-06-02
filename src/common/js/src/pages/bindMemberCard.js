/**
 * 绑定影城会员卡
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var header = require("sea/bindMemberCard/header");
    var bindCard = require("sea/bindMemberCard/bindCard");
    var storageMessager = require("lib/evt/storageMessager");
    var webBridge = require("sea/webBridge");

    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_bindCard = null;


    var flag = false;
    //---------------事件定义----------------
    var evtFuncs = {
        bindMemberCardHeader: function () {
            if (nodeList.header) {
                m_header.bindMemberCardHeader();
            }
        },

        back: function() {
            if (flag) {
                //storageMessager.send("bindCard");/*点过 “继续绑定” 再点击返回按钮。需要刷新支付页面*/
                storageMessager.send("changeUserData",{'changeData':'true'});
            } else {
                //storageMessager.send("cancelStyle");/*通知“支付页面”改变样式. 没有点击“继续绑定”*/
                storageMessager.send("changeUserData",{'changeData':'false','changeStyle':'true'});
            }
            webBridge.close();
        },
        appBindMemberCardHeader: function () {
            flag = true;
        }
    }

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header);
            m_header.init();
        }

        m_bindCard = bindCard(nodeList.bindCard, opts);
        m_bindCard.init();
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        m_bindCard.bind("continueBindMemberCard",evtFuncs.bindMemberCardHeader);

        m_bindCard.bind("continueBindMemberCard",evtFuncs.appBindMemberCardHeader);
        if(!nodeList.header) {
            webBridge.onBackPressed = function () {
                evtFuncs.back();
                var isIPhone = navigator.appVersion.match(/iphone/gi);
                if (isIPhone) {
                    return "turnBackSucceed";
                }
            }
        }
    }

    //-----------------自定义函数-------------
    var custFuncs = {
    }

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = _opts;

        nodeList = {
            header: queryNode("#m_header"),
            bindCard: queryNode("m_bindUserCard")
        }

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});