/*
 *  var siblings = require('mlib/dom/siblings');
 *  siblings(el, '.foo') // gets all siblings of `el` that have class 'foo'
 */

var matches = require('./matches');

module.exports = function(el, selector) {
    var node = el.parentNode.firstChild;
    var siblings = [];

    for (; node; node = node.nextSibling) {
        if (node.nodeType === 1 && node !== el) {
            if (!selector) {
                siblings.push(node);
            }
            else if (matches(node, selector)) {
                siblings.push(node);
            }
        }
    }

    return siblings;
}
