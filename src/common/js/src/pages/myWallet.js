/**
 * ?????????
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var header = require("sea/myWallet/header");
    var webBridge = require("sea/webBridge");
    var walletCard = require("sea/myWallet/walletCard");
    var storageMessager = require("lib/evt/storageMessager");
    var virtualLink = require("lib/util/virtualLink");
    var queryToJson = require("lib/json/queryToJson");
    var URL = require("lib/util/URL");
    var util = require("sea/utils");
    //---------- require end -------------

    var that = compBase();

    //------------???????????----------------
    var nodeList = null;
    var opts = null;
    var m_walletCard = null;
    var m_header = null;
    var url = null;

    //---------------???????----------------
    var evtFuncs = {
        changeUserData: function (ev) {
            if(ev.data.changeData=='true') {
                webBridge.openUrl(util.getCurrentURL(), 'self');
            }
        },
        back: function() {
            if(url["fromType"] == "memberday" || url["from"] == "openSeaCard") {
                //alert(1);
                webBridge.popToSelectedController("mine");
            }
            webBridge.close();
        },
        reload: function () {
            webBridge.openUrl(util.getCurrentURL(), 'self');
        }
    }

    //---------------????鶨??---------------
    var modInit = function () {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }


        m_walletCard = walletCard(nodeList.walletCard, opts);
        m_walletCard.init();

        virtualLink('data-url');
    }

    //-----------------?????---------------
    var bindEvents = function() {

        storageMessager.bind("changeUserData",evtFuncs.changeUserData);
        storageMessager.bind("reChangeMobile",evtFuncs.reload);

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

    //-----------------????庯??-------------
    var custFuncs = {}

    //-----------------?????----------------
    var init = function(_opts) {
        opts = _opts || {};
        url = queryToJson(URL.parse(location.href)["query"]);

        nodeList = {
            header: queryNode("#m_header"),
            walletNav: queryNode("#m_walletNav"),
            walletCard: queryNode("#m_walletCard")
        };

        modInit();
        bindEvents();
    }

    //-----------------??????????-----------
    that.init = init;

    return that;
});