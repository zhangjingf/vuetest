/**
 * 获取光标位置，保留兼容代码
 */
export default function(el) {
    let selectionStart = 0;
    if ("selectionStart" in el) {
        selectionStart = el.selectionStart;
    } else {
        let range = document.selection.createRange();
        range.setEndPoint('StartToStart', el.createTextRange());
        selectionStart = range.text.length;
    }
    return selectionStart;
}