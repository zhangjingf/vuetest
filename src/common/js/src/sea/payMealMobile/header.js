/**
 * ��ҳ�涥�����ܣ�����һ����������
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var webBridge = require("sea/webBridge");
    var touch = require("touch");
    var queryToJson = require("lib/json/queryToJson");
    var URL = require("lib/util/URL");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------�������ֱ���----------------
        var nodeList = null;
        var data = null;
        var url = null;

        //---------------�¼�����----------------
        var evtFuncs = {
            back: function() {
                if(url["nowPage"] == "mobile") {
                    that.fire("payMobileBack",{});
                } else {
                    webBridge.close();
                }
            },
            reload: function () {
                webBridge.reload();
            }
        }

        //---------------��ģ�鶨��---------------
        var modInit = function() {}

        //-----------------���¼�---------------
        var bindEvents = function() {
            touch.on(nodeList.back, "tap", evtFuncs.back);
            if(nodeList.reload) {
                touch.on(nodeList.reload, "tap", evtFuncs.reload);
            }
            webBridge.onBackPressed = function () {
                evtFuncs.back();
                var isIPhone = navigator.appVersion.match(/iphone/gi);
                if (isIPhone) {
                    return "turnBackSucceed";
                }
            }
        }

        //-----------------�Զ��庯��-------------
        var custFuncs = {
        }

        //-----------------��ʼ��----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            url = queryToJson(URL.parse(location.href)["query"]);
            data = _data;

            modInit();
            bindEvents();
        }

        //-----------------��¶���ַ���-----------
        that.init = init;

        return that;
    }
});