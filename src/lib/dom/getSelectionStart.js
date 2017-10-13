/**
 * 获取光标位置，保留兼容代码
 */
module.exports = function(el) {
    if ("selectionStart" in el) {
        selectionStart = el.selectionStart;
    } else {
        range = document.selection.createRange();
        range.setEndPoint('StartToStart', el.createTextRange());
        selectionStart = range.text.length;
    }
}