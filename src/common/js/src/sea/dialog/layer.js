/**
 * 弹框简易版
 */
define(function(require, exports, module) {
    //---------- require begin -------------
    var dialog = require("sea/dialog/dialog");
    var getType = require("lib/util/getType");
    //---------- require end -------------
    var all_dialog = [];

    /*var load = function(time){
        var m_dialog = dialog({type: "load", time: getType(time) != "undefined" ? time : 0});
        m_dialog.init();
        m_dialog.show();
        all_dialog.push(m_dialog);
        return m_dialog;
    };*/
    var msg = function(content,fn,time){
        var m_dialog = dialog({
            time: time || 1000,//关闭时间
            content : content,
            ok : fn
        });
        m_dialog.init();
        m_dialog.show();
        all_dialog.push(m_dialog);
        return m_dialog;
    };
    /*var alert = function(content, fn, text, time){
        var m_dialog = dialog({
            type : "alert",
            time : getType(time) != "undefined" ? time : 0,//关闭时间
            content : content,
            okText : text || "确定",
            ok : fn
        });
        m_dialog.init();
        m_dialog.show();
        all_dialog.push(m_dialog);
        return m_dialog;
    };
    var confirm = function(config){
        config = config || {};
        config.type = "confirm";
        var m_dialog = dialog(config);
        m_dialog.init();
        m_dialog.show();
        all_dialog.push(m_dialog);
        return m_dialog;
    };
    var open = function(config){
        config = config || {};
        config.type = "open";
        var m_dialog = dialog(config);
        m_dialog.init();
        m_dialog.show();
        all_dialog.push(m_dialog);
        return m_dialog;
    };
    var close = function(){
        all_dialog.forEach(function(v){
            v.hide("hide");
        });
        all_dialog = [];
    };*/

    // exports.load = load;
    exports.msg = msg;
    // exports.alert = alert;
    // exports.confirm = confirm;
    // exports.open = open;
    // exports.close = close;
});