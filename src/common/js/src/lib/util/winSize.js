/**
 * 获取窗口可视范围的大小
 * 例子：
 *
 * var winSize = require("../util/winSize");
 * var size = winSize(); // 可以指明某个window对象
 * size的值为： {width: 1024, height: 768 }
 */
define(function(require, exports, module) {
	return function(_target){
		var w, h;
		var target;
		if (_target) {
			target = _target.document;
		}
		else {
			target = document;
		}

		if(target.compatMode === "CSS1Compat") {
			w = target.documentElement[ "clientWidth" ];
			h = target.documentElement[ "clientHeight" ];
		}else if (self.innerHeight) { // all except Explorer
			if (_target) {
				target = _target.self;
			}
			else {
				target = self;
			}
			w = target.innerWidth;
			h = target.innerHeight;

		}else if (target.documentElement && target.documentElement.clientHeight) { // Explorer 6 Strict Mode
			w = target.documentElement.clientWidth;
			h = target.documentElement.clientHeight;

		}else if (target.body) { // other Explorers
			w = target.body.clientWidth;
			h = target.body.clientHeight;
		}
		return {
			width: w,
			height: h
		};
	};
});