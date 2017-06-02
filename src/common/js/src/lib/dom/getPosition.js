/**
 * 获取节点相对于指定的节点的位置
 * 如果没有指定节点，则返回相对于document的位置
 * 例子：
 * var getPosition = require("../dom/getPosition");
 * var pos = getPosition(node);
 * console.log("left:" + pos.left, "top:" + pos.top);
 */
define(function(require, exports, module) {
	var contains = require("../dom/contains");
	var scrollPos = require("../util/scrollPos");

	var generalPosition = function(el){
		var box        = el.getBoundingClientRect();
		var scroll     = scrollPos();
		var body       = el.ownerDocument.body;
		var docElem    = el.ownerDocument.documentElement;
		var clientTop  = docElem.clientTop  || body.clientTop  || 0;
		var clientLeft = docElem.clientLeft || body.clientLeft || 0;
		// 这边的parseInt 没有必要
		return {
			left: box.left + scroll['left'] - clientLeft,
			top:  box.top  + scroll['top']  - clientTop
		};
	};

	return function(oElement, parent){
		oElement = typeof oElement == "string" ? document.getElementById(oElement) : oElement;
		parent   = typeof parent == "string" ? document.getElementById(parent) : parent;
		if( !contains(oElement.ownerDocument.body, oElement) ){
			return {top:NaN, left:NaN};
		}

		if(parent === undefined){
			return generalPosition(oElement);
		}else{
			oElement = generalPosition(oElement);
			parent   = generalPosition(parent);
			return {
				'left': oElement.left - parent.left,
				'top':  oElement.top  - parent.top
			};
		}
	};
});