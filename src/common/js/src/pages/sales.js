/**
 * 活动页
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var webBridge = require("sea/webBridge");
    //var salesFlash = require("sea/sales/salesFlash");
    var virtualLink = require("lib/util/virtualLink");
    var syncPages = require('sea/syncPages');
    var storageMessager = require("lib/evt/storageMessager");
    var sizzle = require("lib/dom/sizzle");
    var each = require("lib/util/each");

    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_salesFlash = null;

    //---------------事件定义----------------
    var evtFuncs = {}

    //---------------子模块定义---------------
    var modInit = function() {
        //m_salesFlash = salesFlash(nodeList.salesFlash, opts);
        //m_salesFlash.init();

        virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function() {
        storageMessager.bind('userChanged', webBridge.reload);//登录刷新页面
    }

    //-----------------自定义函数-------------
    var custFuncs = {
        changeImgSrc: function () {
            var imgArr = sizzle("img",nodeList.salesList);
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
    var init = function(_opts) {
        opts = _opts || {};

        nodeList = {
            //salesFlash: queryNode("#m_salesFlash"),
            salesList: queryNode("#m_salesList")
        }

        modInit();
        bindEvents();
        syncPages.updateViewWhenUserChange();
        custFuncs.changeImgSrc();
    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});