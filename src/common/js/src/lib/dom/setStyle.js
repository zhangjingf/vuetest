/**
 * 设置样式属性 来自STK.js
 * setStyle(node, "paddingTop", "50px");
 * setStyle(node, "padding-top", "50px");
 * setStyle(node, {"paddingTop": "50px", "paddingLeft": "50px"});
 */
define(function(require, exports, module) {
	var trim = require("../str/trim");
	//测试用的 style
	var testStyle      = document.createElement("DIV").style;
	testStyle.cssText  = "float:left;opacity:.5";

	var cssHooks = {
		opacity: function (node, value) {
			if(!_cssSupport().opacity){
				var ralpha       = /alpha\([^)]*\)/i;
				var style        = node.style;
				var currentStyle = node.currentStyle;
				var opacity      = _isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "";
				var filter       = currentStyle && currentStyle.filter || style.filter || "";

				if (!currentStyle || !currentStyle.hasLayout) {
					style.zoom = 1;
				}

				if ( ( value >= 1 || value === "" ) &&
						trim( filter.replace( ralpha, "" ) ) === "" &&
						style.removeAttribute
				) {

					style.removeAttribute( "filter" );

					if ( value === "" || currentStyle && !currentStyle.filter ) {
						return true;
					}
				}

				style.filter = ralpha.test( filter ) ?
					filter.replace( ralpha, opacity ) :
					filter + " " + opacity;
				return true;
			}
		}
	};

	// 对应正确的css属性
	// 在执行中会使用 _vendorPropName 动态添加，例如 transform: 'WebkitTransform'
	var cssProps = {
		"float": _cssSupport().cssFloat ? "cssFloat" : "styleFloat"
	};

	/*
	 *  检测是否数字（字符串数字）且非 NaN 或 Infinity
	 *  @method _isNumeric
	 *  @private
	 *  @param {String/Number} 检测对象
	 */
	function _isNumeric (obj) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	}

	/*
	 *  检测对css的一些属性的支持程度
	 *  @method _cssSupport
	 *  @private
	 */
	function _cssSupport () {
		return _cssSupport.rs || (_cssSupport.rs = {
			opacity:  'opacity'  in testStyle && /^0.5/.test( testStyle.opacity ),
			cssFloat: 'cssFloat' in testStyle && !!testStyle.cssFloat
		});
	}

	/*
	 *  转换驼峰
	 *  @method _camelCase
	 *  @private
	 *  @param {String} 需要转换的字符串
	 */
	function _camelCase ( string ) {
		return string.replace( /^-ms-/, "ms-" ).replace( /-([\da-z])/gi, function( all, letter ) {
			return letter.toUpperCase();
		});
	}

	/*
	 *  转换中线连接
	 *  @method _multiDash
	 *  @private
	 *  @param {String} 需要转换的字符串
	 */
	function _multiDash ( string ) {
		return string.replace( /^ms/, "Ms" ).replace( /([A-Z])/g, "-$1" ).toLowerCase();
	}

	/*
	 *  检测对是否是某种浏览器自有属性
	 *  例如: WebkitTransform 一类的
	 *  @method _vendorPropName
	 *  @private
	 */
	function _vendorPropName ( name ) {
		// 检测如果已经可以用短名的用短名
		if ( name in testStyle ) {
			return name;
		}

		// 循环检测是否某种浏览器特殊名
		var capName     = name.charAt(0).toUpperCase() + name.slice(1);
		var origName    = name;
		var cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];
		var i           = cssPrefixes.length;
		while ( i-- ) {
			name = cssPrefixes[ i ] + capName;
			if ( name in testStyle ) {
				return name;
			}
		}

		// 啥都不是
		return origName;
	}

	/*
	 *  格式化属性名
	 *  @method _formatProp
	 *  @private
	 */
	function _formatProp (property) {
		property = _camelCase(property);
		return cssProps[property] || ( cssProps[ property ] = _vendorPropName(property) );
	}

	/*
	 *  设置属性
	 *  @method setStyle
	 *  @public
	 */
	function setStyle ( node, property, value){
		node = typeof node == "string" ? document.getElementById(node) : node;
		var val;
		property = _formatProp(property);
		if(property in cssHooks){
			val = cssHooks[property](node, value);
		}
		if(val === undefined){
			node.style[property] = value;
		}
	}
	/*
	 *  设置多个属性
	 *  @method multiSetStyle
	 *  @public
	 */
	function multiSetStyle (node, map){
		var property;
		var value;
		var i;
		var val;
		var rs = [];
		node = typeof node == "string" ? document.getElementById(node) : node;
		for(i in map){
			val = undefined;
			property = i;
			value    = map[i];
			property = _formatProp(property);
			if(property in cssHooks){
				val = cssHooks[property](node, value);
			}
			if(val === undefined){
				rs.push( [_multiDash(property), value].join(':') );
			}
		}
		node.style.cssText += ';' + rs.join(';') + ';'
	}
	// setStyle.multi = multiSetStyle;

	return function() {
		if (arguments.length == 2) {
			multiSetStyle(arguments[0], arguments[1]);
		} else {
			setStyle(arguments[0], arguments[1], arguments[2]);
		}
	};
});