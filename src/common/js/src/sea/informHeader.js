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

        //------------�������ֱ���----------------
        var nodeList = null;
        var data = null;

        //---------------�¼�����----------------
        var evtFuncs = {
            back: function() {
                storageMessager.send("cancelStyle");/*֪ͨ��֧��ҳ�桱�ı���ʽ*/
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
        }

        //-----------------�Զ��庯��-------------
        var custFuncs = {}

        //-----------------��ʼ��----------------
        var init = function(_data) {
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
        }

        //-----------------��¶���ַ���-----------
        that.init = init;

        return that;
    }
});