/**
 * 复制json对象，保证修改后不影响原来的对象
 * 例子：
 *
 * var clone = require("../json/clone");
 * var obj = { id: 1 };
 * var objNew = clone(obj); // 修改objNew不会涉及到obj
 *
 */

var getType = require("../util/getType");

var clone = module.exports = function(json) {
    var obj = null;

    if (getType(json) == "array") {
        obj = [];

        for (var i = 0; i < json.length; i++) {
            obj.push(clone(json[i]));
        }
    } else if (getType(json) == "object") {
        obj = {};

        for (var key in json) {
            obj[key] = clone(json[key]);
        }
    } else {
        return json;
    }

    return obj;
}