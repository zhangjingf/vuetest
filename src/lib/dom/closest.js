var matches = require("./matches");
var contains = require("./contains");

module.exports = function(node, selector, box) {
    var result = null;
    box = box || document.body;

    if (node.closest) {
        result = node.closest(selector);
        if (result === null || !contains(box, result)) {
            return null;
        }
    }

    while(node && node !== box && node.nodeType === 1) {
        if (matches(node, selector)) {
            return node;
        }

        node = node.parentNode;
    }

    return null;
}