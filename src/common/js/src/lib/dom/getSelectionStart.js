/**
 * 获取光标位置
 */
define(function(require, exports, module) {
    return function(el) {
        if ("selectionStart" in el) {
            selectionStart = el.selectionStart;
        } else {
            range = document.selection.createRange();
            range.setEndPoint('StartToStart', el.createTextRange());
            selectionStart = range.text.length;
        }
    }
});