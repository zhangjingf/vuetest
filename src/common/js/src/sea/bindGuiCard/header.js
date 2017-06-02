/**
 * ��ҳ�涥�����ܣ�����һ����������
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var storageMessager = require("lib/evt/storageMessager");
    var webBridge = require("sea/webBridge");
   /* var URL = require("lib/util/URL");
    var queryToJson = require("lib/json/queryToJson");*/
    var touch = require("touch");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();

        //------------�������ֱ���----------------
        var nodeList = null;
        var data = null;
        var flag = false;

        //---------------�¼�����----------------
        var evtFuncs = {
            back: function() {
                //console.log(opts);
                if (opts["fromType"] == undefined || opts["fromType"] == "") {
                    if (flag) {
                        //storageMessager.send("bindCard");
                        storageMessager.send("changeUserData",{'changeData':'true'});
                    } else {
                        //storageMessager.send("cancelStyle");/*֪ͨ��֧��ҳ�桱�ı���ʽ*/
                        storageMessager.send("changeUserData",{'changeData':'false','changeStyle':'true'});
                    }
                }
                webBridge.close();
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
            bindLuxuryCard: function () {
                flag = true;
            }
        }

        //-----------------��ʼ��----------------
        var init = function(_data) {
            //url = queryToJson(URL.parse(location.href)["query"]);
            //url = queryToJson(URL.parse(location.href)["query"]);
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
        }

        //-----------------��¶���ַ���-----------
        that.init = init;
        that.bindLuxuryCard = custFuncs.bindLuxuryCard;

        return that;
    }
});