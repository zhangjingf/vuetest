/**
 * 将一段HTML解析成一个DocumentFragment，DocumentFragment允许appendChild到一个节点中。
 * 它可以在内存中批量完成DOM的解析，最后再添加到页面，减少页面渲染消耗
 * 理论上该函数是可以减少大量DOM操作时的耗时，但实际上经过我测试，在新的浏览器中，它貌似反而起了反作用
 * 因此建议谨慎地使用。
 * 例子：
 * var builder = require("../dom/builder");
 * var fragment = builder("<div></div>");
 * document.body.appendChild(fragment);
 */
define(function(require, exports, module) { 
	return function(html) {
		var fragment = document.createDocumentFragment();
		var div = document.createElement("DIV");
		div.innerHTML = html;

		while(div.firstChild) {
			fragment.appendChild(div.firstChild);
		}

		return fragment;
	}
});