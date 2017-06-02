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
    var touch = require("touch");
    //---------- require end -------------

    return function(node, opts) {
        var that = compBase();
        var flag = false;

        //------------�������ֱ���----------------
        var nodeList = null;
        var data = null;

        //---------------�¼�����----------------
        var evtFuncs = {
            back: function() {
                if (flag) {
                    //storageMessager.send("bindCard");/*��� �������󶨡� �ٵ�����ذ�ť����Ҫˢ��֧��ҳ��*/
                    storageMessager.send("changeUserData",{'changeData':'true'});
                } else {
                    //storageMessager.send("cancelStyle");/*֪ͨ��֧��ҳ�桱�ı���ʽ. û�е���������󶨡�*/
                    storageMessager.send("changeUserData",{'changeData':'false','changeStyle':'true'});
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
            bindMemberCardHeader: function () {
                flag = true;
            }
        }

        //-----------------��ʼ��----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
        }

        //-----------------��¶���ַ���-----------
        that.init = init;
        that.bindMemberCardHeader = custFuncs.bindMemberCardHeader;

        return that;
    }
});