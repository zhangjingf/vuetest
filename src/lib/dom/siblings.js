/*
 *  var siblings = require('mlib/dom/siblings');
 *  siblings(el, '.foo') // gets all siblings of `el` that have class 'foo'
 */

import matches from './matches';

export default function(el, selector) {
    let node = el.parentNode.firstChild;
    let siblings = [];

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
