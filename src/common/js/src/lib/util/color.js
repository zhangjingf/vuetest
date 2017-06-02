/**
 * color 管理对象，来自STK
 * 例子：
 *
 * var color = require("../util/color");
 * var black = color("#000000")
 *
 */
define(function(require, exports, module) {
	var forEach = require("../util/each");
	var analysisHash = /^#([a-fA-F0-9]{3,8})$/;
	var testRGBorRGBA = /^rgb[a]?\s*\(/;
	var analysisRGBorRGBA = /([0-9\.]+)/ig;
	var splitRGBorRGBA = /([a-fA-F0-9]{2})/ig;

	var analysis = function(str){
		var ret = [];
		var list = [];
		if(analysisHash.test(str)){
			list = str.match(analysisHash);
			if(list[1].length <= 4){
				ret = [];

				forEach(list[1].split(''),function(value, index){
					ret.push(parseInt(value + value, 16));
				});
			} else if( list[1].length <= 8) {
				ret = [];

				forEach(list[1].match(splitRGBorRGBA),function(value, index){
					ret.push(parseInt(value, 16));
				});
			}
			return ret;
		}
		if(testRGBorRGBA.test(str)){
			list = str.match(analysisRGBorRGBA);
			ret = [];
			forEach(list, function(value, index){
				ret.push(parseInt(value, 10));
			});
			return ret;
		}
		return false;
	};

	return function(colorStr) {
		var ret = analysis(colorStr);
		if(!ret){
			return false;
		}
		var that = {};
		/**
		 * Describe 获取red
		 * @method getR
		 * @return {Number}
		 * @example
		 */
		that.getR = function(){
			return ret[0];
		};
		/**
		 * Describe 获取green
		 * @method getG
		 * @return {Number}
		 * @example
		 */
		that.getG = function(){
			return ret[1];
		};
		/**
		 * Describe 获取blue
		 * @method getB
		 * @return {Number}
		 * @example
		 */
		that.getB = function(){
			return ret[2];
		};
		/**
		 * Describe 获取alpha
		 * @method getA
		 * @return {Number}
		 * @example
		 */
		that.getA = function(){
			return ret[3];
		};
		return that;
	};
});