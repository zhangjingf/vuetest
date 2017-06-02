/**
 * 封装了HTML的插入操作，与insert.js不同，这里操作的是HTML字符串
 * 例子：
 *
 * HTML: <div id="node">hello world</div>
 *
 * var insertHTML = require("../dom/insertHTML");
 * var node = document.getElementById("node");
 *
 * where:
 * beforebegin 插入到节点开始之前
 *
 * insertHTML(node, '<div id="newNode"></div>', beforebegin);
 * 结果为： <div id="newNode"></div><div id="node">hello world</div>
 *
 * afterbegin 插入到节点内部的最前边
 *
 * insertHTML(node, '<div id="newNode"></div>', afterbegin);
 * 结果为：<div id="node"><div id="newNode"></div>hello world</div>
 *
 * beforeend 相当于appendChild，即插到内部最后
 *
 * insertHTML(node, '<div id="newNode"></div>', beforeend);
 * 结果为：<div id="node">hello world<div id="newNode"></div></div>
 *
 * afterend 插到节点的结束标签后边
 *
 * insertHTML(node, '<div id="newNode"></div>', afterend);
 * 结果为：<div id="node">hello world</div><div id="newNode"></div>
 *
 */
define(function(require, exports, module) {
	var console = require("../io/console");

	return function(target, html, where){
		if (typeof target == "string") {
			target = document.getElementById(target);
		}

		where = where? where.toLowerCase(): "beforeend";

		if ("insertAdjacentHTML" in target) {
			switch (where) {
				case "beforebegin":
					target.insertAdjacentHTML('BeforeBegin', html);
					return target.previousSibling;
				case "afterbegin":
					target.insertAdjacentHTML('AfterBegin', html);
					return target.firstChild;
				case "beforeend":
					target.insertAdjacentHTML('BeforeEnd', html);
					return target.lastChild;
				case "afterend":
					target.insertAdjacentHTML('AfterEnd', html);
					return target.nextSibling;
			}
		} else {
			var range = target.ownerDocument.createRange();
			var frag;

			switch (where) {
				case "beforebegin":
					range.setStartBefore(target);
					frag = range.createContextualFragment(html);
					target.parentNode.insertBefore(frag, target);
					return target.previousSibling;
				case "afterbegin":
					if (target.firstChild) {
						range.setStartBefore(target.firstChild);
						frag = range.createContextualFragment(html);
						target.insertBefore(frag, target.firstChild);
						return target.firstChild;
					}
					else {
						target.innerHTML = html;
						return target.firstChild;
					}
					break;
				case "beforeend":
					if (target.lastChild) {
						range.setStartAfter(target.lastChild);
						frag = range.createContextualFragment(html);
						target.appendChild(frag);
						return target.lastChild;
					}
					else {
						target.innerHTML = html;
						return target.lastChild;
					}
					break;
				case "afterend":
					range.setStartAfter(target);
					frag = range.createContextualFragment(html);
					target.parentNode.insertBefore(frag, target.nextSibling);
					return target.nextSibling;
			}
		}

		console.error("无法将HTML代码插入到节点" + where + "(insertHTML)");
		return false;
	}
});