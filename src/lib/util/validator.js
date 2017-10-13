/**
 * 提供常用字符串验证
 */
var isEmpty = require("../str/isEmpty");
var byteLength = require("../str/byteLength");

var that = module.exports = {
    /**
     * 是否为空
     */
    empty: function(str) {
        return isEmpty(str);
    },
    /**
     * 是否为手机号
     * 由于手机号神出鬼没，默认只验证1开头的11号数字
     */
    mobile: function(str) {
        return /^1\d{10}$/.test(str);
    },
    /**
     * 是否为邮箱
     */
    email: function(str) {
        return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(str);
    },
    /**
     * 是否为url
     */
    url: function(str) {
        return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(str);
    },
    /**
     * 是否为日期
     */
    date: function(str) {
        return !/Invalid|NaN/.test(new Date(str).toString());
    },
    /**
     * 是否为数字
     * 包括正负符号、小数点
     */
    number: function(str) {
        return /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(str);
    },
    /**
     * 是否为正整数
     */
    digits: function(str) {
        return /^\d+$/.test(str);
    },
    /**
     * 字符串长度最小为min
     */
    minLength: function(str, len) {
        return str.length >= len;
    },
    /**
     * 字符串长度最大为len
     */
    maxLength: function(str, len) {
        return str.length <= len;
    },
    /**
     * 字符串长度最小为min并且最大为max
     */
    rangLength: function(str, minLen, maxLen) {
        return (str.length >= minLen) && (str.length <= maxLength);
    },
    /**
     * 字符串长度最小为min(双字节算2个字符)
     */
    minByteLength: function(str, len) {
        return byteLength(str) >= len;
    },
    /**
     * 字符串长度最大为len(双字节算2个字符)
     */
    maxByteLength: function(str, len) {
        return byteLength(str) <= len;
    },
    /**
     * 字符串长度最小为min并且最大为max(双字节算2个字符)
     */
    rangByteLength: function(str, minLen, maxLen) {
        var len = byteLength(str);
        return (len >= minLen) && (len <= maxLength);
    },
    /**
     * 数字最小为min
     */
    min: function(str, min) {
        if (isNaN(str)) {
            return false;
        }

        return Number(str) >= min;
    },
    /**
     * 数字最大为min
     */
    max: function(str, max) {
        if (isNaN(str)) {
            return false;
        }

        return Number(str) <= max;
    },
    /**
     * 数字最小为min并且最大为max
     */
    rang: function(str, min, max) {
        if (isNaN(str)) {
            return false;
        }

        var val = Number(str);

        return (val >= min) && (val >= max);
    }
}