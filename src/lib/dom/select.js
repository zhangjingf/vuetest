/**
 * 选择一个输入框的某一部份
 * 例子：
 *
 * var select = require("../dom/select");
 *
 * select(inputNode, {
 *     start: 2, // 从第3个字符开始选择
 *     len: 5 // 从启始位置选择5个字符
 * });
 */
module.exports = function(input, area){
    var start = area.start;
    var len = area.len || 0;

    input.focus();

    if(input.setSelectionRange){
        input.setSelectionRange(start,start + len);
    }else if(input.createTextRange){
        var range = input.createTextRange();
        range.collapse(1);
        range.moveStart('character', start);
        range.moveEnd('character', len);
        range.select();
    }
};