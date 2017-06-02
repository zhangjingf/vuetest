define(function(require, exports, module) {
    var matches = require("./matches");

    return function(node, selector) {
        if (node.closest) {
            return node.closest(selector);
        }

        while(node && node.nodeType == 1) {
            if (matches(node, selector)) {
                return node;
            }

            node = node.parentNode;
        }
        return null;
    }
});