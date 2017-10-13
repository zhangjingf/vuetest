/**
 * 封装了节点的插入操作
 * 例子：
 *
 * HTML: <div id="node">hello world</div>
 *
 * var insertNode = require("../dom/insertNode");
 * var node = document.getElementById("node");
 * var newNode = document.createElement("DIV");
 * newNode.id = "newNode";
 *
 * where:
 * beforebegin 插入到节点开始之前
 *
 * insertNode(node, newNode, beforebegin);
 * 结果为： <div id="newNode"></div><div id="node">hello world</div>
 *
 * afterbegin 插入到节点内部的最前边
 *
 * insertNode(node, newNode, afterbegin);
 * 结果为：<div id="node"><div id="newNode"></div>hello world</div>
 *
 * beforeend 相当于appendChild，即插到内部最后
 *
 * insertNode(node, newNode, beforeend);
 * 结果为：<div id="node">hello world<div id="newNode"></div></div>
 *
 * afterend 插到节点的结束标签后边
 *
 * insertNode(node, newNode, afterend);
 * 结果为：<div id="node">hello world</div><div id="newNode"></div>
 *
 */
module.exports = function(target, node, where){
    if (typeof target === "string") {
        target = document.getElementById(target);
    }

    if (typeof node === "string") {
        node = document.getElementById(node);
    }

    where = where ? where.toLowerCase() : "beforeend";

    switch (where) {
        case "beforebegin":
            target.parentNode.insertBefore(node, target);
            break;
        case "afterbegin":
            target.insertBefore(node, target.firstChild);
            break;
        case "beforeend":
            target.appendChild(node);
            break;
        case "afterend":
            if (target.nextSibling) {
                target.parentNode.insertBefore(node, target.nextSibling);
            }
            else {
                target.parentNode.appendChild(node);
            }
            break;
    }

    return node;
}