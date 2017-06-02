/**
 * 获取节点的样式属性 来自STK.js
 * 该API封装了一些需要兼容的属性，比如获取半透明只需要设置opacity值
 * 例子：
 * var getStyle = require("../dom/getStyle");
 * var paddingLeft = getStyle(node, "paddingLeft"); // 获取到padding-left的值
 * var paddingLeft = getStyle(node, "padding-left"); // 获取到padding-left的值
 */
define(function(require, exports, module) {
	//是否ie盒模型
	var isQuirk = document.documentMode ? document.documentMode === 5 : document.compatMode !== "CSS1Compat";

	//测试用的 style
	var testStyle = document.createElement("DIV").style;
	testStyle.cssText = "float:left;opacity:.5";

	var color = {
		aqua: '#0ff',
		black: '#000',
		blue: '#00f',
		gray: '#808080',
		purple: '#800080',
		fuchsia: '#f0f',
		green: '#008000',
		lime: '#0f0',
		maroon: '#800000',
		navy: '#000080',
		olive: '#808000',
		orange: '#ffa500',
		red: '#f00',
		silver: '#c0c0c0',
		teal: '#008080',
		transparent: 'rgba(0,0,0,0)',
		white: '#fff',
		yellow: '#ff0'
	};

	var borderWidth = {
		thin: ["1px", "2px"],
		medium: ["3px", "4px"],
		thick: ["5px", "6px"]
	};

	var cssHooks = {
		opacity: function (node) {
			if(!_cssSupport().opacity){
				var val = 100;
				try {
					val = node.filters['DXImageTransform.Microsoft.Alpha'].opacity;
				}
				catch (e) {
					try {
						val = node.filters('alpha').opacity;
					}
					catch (e) {}
				}
				return val / 100;
			}
		}
	};

	// 对应正确的css属性
	// 在执行中会使用 _vendorPropName 动态添加，例如 transform: 'WebkitTransform'
	var cssProps = {
		"float": _cssSupport().cssFloat ? "cssFloat" : "styleFloat"
	};

	/*
	 *  检测对css的一些属性的支持程度
	 *  @method _cssSupport
	 *  @private
	 */
	function _cssSupport () {
		return _cssSupport.rs || (_cssSupport.rs = {
			opacity:  /^0\.5/.test( testStyle.opacity ),
			cssFloat: !!testStyle.cssFloat
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
	 *  检测对是否是某种浏览器自有属性
	 *  例如: WebkitTransform 一类的
	 *  @method _vendorPropName
	 *  @private
	 */
	 // moz-border-radius-top-left
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
	 *  长度单位转换
	 *  @method _convertPixelValue
	 *  @private
	 *  @param {Node} 对应的dom元素
	 */
	function _convertPixelValue (el, property, value) {
		var style = el.style;
		var left = style.left;
		var rsLeft = el.runtimeStyle.left;

		el.runtimeStyle.left = el.currentStyle.left;
		style.left = property === "fontSize" ? "1em" : value || 0;
		var px = style.pixelLeft;
		style.left = left; //还原数据
		el.runtimeStyle.left = rsLeft; //还原数据
		return px + "px"
	}

	/*
	 *  颜色单位转换
	 *  @method _rgb2hex
	 *  @private
	 *  @param {String}
	 */
	function _rgb2hex (rgb) {
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		return "#" + _tohex(rgb[1]) + tohex(rgb[2]) + tohex(rgb[3])
	}

	/*
	 *  转换16进制
	 *  @method _tohex
	 *  @private
	 *  @param {String}
	 */
	function _tohex (x) {
		var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
		return isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
	}

	/*
	 *  获取样式集
	 *  @method _getStyles
	 *  @private
	 *  @param {Node} 对应的dom元素
	 */
	function _getStyles(node) {
		if('getComputedStyle' in window){
			return document.body.ownerDocument.defaultView.getComputedStyle(node, "");
		} else if('currentStyle' in document.documentElement){
			return node.currentStyle;
		} else {
			return {};
		}
	}

	/*
	 *  对ie做特殊处理
	 *  @method _getStyleIE
	 *  @private
	 *  @param {Node}   对应的dom元素
	 *  @param {String} 属性名
	 */
	function _getStyleIE (node, property){
		//特殊处理IE的opacity
		var val;
		if (property in cssHooks ) {
			val = cssHooks[property](node);
		}
		if(val !== undefined){
			return val;
		}
		val = node.currentStyle[property];
		//特殊处理IE的height与width
		if (/^(height|width)$/.test(property)) {
			var values = (property == 'width') ? ['left', 'right'] : ['top', 'bottom'],
				size = 0;
			if (isQuirk) {
				return node[_camelCase("offset-" + property)] + "px"
			} else {
				var client   = parseFloat(node[_camelCase("client-" + property)]);
				var paddingA = parseFloat(getStyle(node, "padding-" + values[0]));
				var paddingB = parseFloat(getStyle(node, "padding-" + values[1]));
				val          = client - paddingA - paddingB;
				val = val > 0 ? val : node[_camelCase("offset-" + property)];
			}
		}
		return val;
	}

	/*
	 *  对返回值做一些处理 http://www.cnblogs.com/rubylouvre/archive/2009/09/08/1562212.html
	 *  @method _formatValue
	 *  @private
	 *  @param {Node}   对应的dom元素
	 *  @param {String} 属性名
	 */
	function _formatValue (el, property, value) {
		if (!/^\d+px$/.test(value)) {
			//转换可度量的值
			if (/(em|pt|mm|cm|pc|in|ex|rem|vw|vh|vm|ch|gr|%)$/.test(value)){
				return _convertPixelValue(el, property, value);
			}
			//转换border的thin medium thick
			if (/^(border).+(width)$/i.test(property)) {
				var s = property.replace("Width", "Style");
				if (value == "medium" && getStyle(el, s) == "none") {
					return "0px";
				}
				return !!window.XDomainRequest ? borderWidth[value][0] : borderWidth[value][1];
			}
			//转换颜色
			if (property.search(/background|color/i) != -1) {
				if ( !! color[value]) {
					value = color[value]
				}
				if (value == "inherit") {
					return getStyle(el.parentNode, property);
				}
				if (/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/i.test(value)) {
					return _rgb2hex(value)
				} else if (/^#/.test(value)) {
					value = value.replace('#', '');
					return "#" + (value.length == 3 ? value.replace(/^(\w)(\w)(\w)$/, '$1$1$2$2$3$3') : value);
				}
				return value;
			}
		}
	}

	var getStyle = function(node, property) {
		node = typeof node == "string" ? document.getElementById(node) : node;
		var computed = _getStyles( node );
		var val;
		property     = _camelCase(property);
		property     = cssProps[property] || ( cssProps[ property ] = _vendorPropName(property) );

		//区分ie做特殊处理
		if('getComputedStyle' in window){
			val = document.defaultView.getComputedStyle(node, null)[property]
		}else{
			val = _getStyleIE(node, property);
		}
		//处理单位转换。
		try{
			val = _formatValue(node, property, val) || val;
		}catch(e){}

		return val;
	}

	return getStyle;
});