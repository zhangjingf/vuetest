/**
 * 尊享卡绑定页面控制器
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var header = require("sea/bindGuiCard/header");
    var URL = require("lib/util/URL");
    var queryToJson = require("lib/json/queryToJson");
    var bindLuxuryCard = require("sea/bindGuiCard/bindLuxuryCard");
    var storageMessager = require("lib/evt/storageMessager");
    var webBridge = require("sea/webBridge");
   // var virtualLink = require("lib/util/virtualLink");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_bindLuxuryCard =null;

    var flag = false;
    //---------------事件定义----------------
    var evtFuncs = {
        bindLuxuryCardEvent: function () {
            if (nodeList.header) {
                m_header.bindLuxuryCard();
            }
        },

        back: function() {
            //console.log(opts);
            if (opts["fromType"] == undefined || opts["fromType"] == "") {
                if (flag) {
                    //storageMessager.send("bindCard");
                    storageMessager.send("changeUserData",{'changeData':'true'});
                } else {
                    //storageMessager.send("cancelStyle");/*通知“支付页面”改变样式*/
                    storageMessager.send("changeUserData",{'changeData':'false','changeStyle':'true'});
                }
            }
            webBridge.close();
        },
        appBindLuxuryCardEvent: function () {
            flag = true;
        }

    }

    //---------------子模块定义---------------
    var modInit = function() {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }

        m_bindLuxuryCard = bindLuxuryCard(nodeList.bindLuxuryCard, opts);
        m_bindLuxuryCard.init();

       // virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        m_bindLuxuryCard.bind("bindLuxuryCard", evtFuncs.bindLuxuryCardEvent);

        m_bindLuxuryCard.bind("bindLuxuryCard", evtFuncs.appBindLuxuryCardEvent);
        if(!nodeList.header) {
            webBridge.onBackPressed = function () {
                evtFuncs.back();
                var isIPhone = navigator.appVersion.match(/iphone/gi);
                if (isIPhone) {
                    return "turnBackSucceed";
                }
            };
        }

    }

    //-----------------自定义函数-------------
    var custFuncs = {}

    //-----------------初始化----------------
    var init = function(_opts) {
        opts = queryToJson(URL.parse(location.href)["query"]);
        opts.pageInt = _opts;

        nodeList = {
            header: queryNode("#m_header"),
            bindLuxuryCard: queryNode("#m_bindLuxuryCard")
        };

        modInit();
        bindEvents();
    }

    //-----------------暴露各种方法-----------
    that.init = init;
    return that;
});