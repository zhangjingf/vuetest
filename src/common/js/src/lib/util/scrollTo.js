/**
 * 将滚动条平滑滚动到指定的位置
 *
 * target: 将滚动条滚动到该元素的位置
 *
 * var scrollTo = require("../util/scrollTo");
 * var queryNode = require("../dom/queryNode");
 * scrollTo(queryNode("#div1"), {
 *     box: document.documentElement, // 默认是整个页面滚动
 *     top: 0, // 滚动的位置
 *     step: 2, // 每次滚动的速度，一般不需要设置
 *     onMoveStop: function() {} // 每次滚动时触发
 * });
 *
 **/
define(function(require, exports, module) {
	var merge = require("../json/merge");
	var getPosition = require("../dom/getPosition");

	return function(target, spec) {
		var conf = merge({
			'box' : document.documentElement,
			'top' : 0,
			'step' : 2,
			'onMoveStop' : null
		},spec);
		conf.step = Math.max(2,Math.min(10,conf.step));
		var orbit = [];
		var targetPos = getPosition(target);
		var boxPos;
		if(conf['box'] == document.documentElement){
			boxPos = {'top':0};
		}else{
			boxPos = getPosition(conf['box']);
		}

		var pos = Math.max(0, (targetPos ? targetPos['top'] : 0) - (boxPos ? boxPos['top'] : 0) - conf.top);
		var cur = conf.box === document.documentElement ? (conf.box.scrollTop || document.body.scrollTop || window.pageYOffset) : conf.box.scrollTop;
		var lastPos = null;
		while(Math.abs(cur - pos) > conf.step && cur >= 0){
			lastPos = Math.round(cur + (pos - cur)*conf.step/10);

			if (lastPos == orbit[orbit.length - 1]) {
				orbit.push(pos);
			} else {
				orbit.push(lastPos);
			}

			cur = orbit[orbit.length - 1];
		}
		if(!orbit.length){
			orbit.push(pos);
		}
		var tm = setInterval(function() {
			if(orbit.length){
				if(conf.box === document.documentElement){
					window.scrollTo(0,orbit.shift());
				}else{
					conf.box.scrollTop = orbit.shift();
				}

			}else{
				if(conf.box === document.documentElement){
					window.scrollTo(0,pos);
				}else{
					conf.box.scrollTop = pos;
				}
				clearInterval(tm);
				if(typeof conf.onMoveStop === 'function'){
					conf.onMoveStop();
				}
			}
		}, 1000 / 60);
	};
});