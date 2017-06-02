/**
 * 判断当前节点是否匹配查询规则
 */
define(function(require, exports, module) {
    var sizzle = require("./sizzle");
    var index = require("./index");

    return function(node, selector) {
        if (node.nodeType != 1) {
            return false;
        }

        var p = HTMLElement.prototype;
        var f = p.matches || p.webkitMatchesSelector || p.mozMatchesSelector || function(s) {
            return index(this, sizzle(s)) != -1;
        }

        return f.call(node, selector);
    }
});