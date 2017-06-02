/**
 * 短时提示
 */
define(function (require, exports, module) {
    var dialog = require("sea/dialog/dialog");
    var getType = require("lib/util/getType");

    return function(content,fn,time){
        var m_dialog = dialog({
            time: time || 500,//关闭时间
            content : getType(content) == "object" ? JSON.stringify(content) : content,
            ok : fn
        });
        m_dialog.init();
        m_dialog.getMask().setMaskOpacityStyle(0.1);//修改mask透明度
        m_dialog.show();
    };
});
/*
//用到的样式
.dialog-msg {
    background-color: #000;
    opacity: 0.8;
    height: 4rem;
    line-height: 4rem;
    padding: 0 1rem 0 1rem;
    color: #fff;
    font-size: 1.5rem;
    -webkit-border-radius: 0.4rem;
    border-radius: 0.4rem;
}*/