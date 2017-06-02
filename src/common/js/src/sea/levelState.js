/**
 *
 * 会员中心头部等级进度条，个人中心与会员中心合用
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var touch = require("touch");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;

		//---------------事件定义----------------
		var evtFuncs = {}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {}

		//-----------------自定义函数-------------
		var custFuncs = {
			initView: function () {
				var _levelInfo = JSON.parse(opts["levelInfo"]);
				if(_levelInfo["levelKey"]>=_levelInfo["maxKey"]) {
					nodeList.state.style.width = '86%'
				} else {
					var _nextLevelPercentage = (_levelInfo["creditLevel"]-_levelInfo["nextCredit"])/_levelInfo["creditLevel"];
					var _nowLevel = 'level' + _levelInfo["levelKey"];
					var _nextLevel = 'level' + (_levelInfo["levelKey"]+1);
					var _levelDistance = nodeList[_nextLevel].offsetLeft-nodeList[_nextLevel].offsetWidth - nodeList[_nowLevel].offsetLeft;
					console.log(_levelDistance)
					nodeList.state.style.width =  nodeList[_nowLevel].offsetLeft + _levelDistance*_nextLevelPercentage+'px';
				}
			}
		}

		//-----------------初始化----------------
		var init = function(_data) {
			nodeList = parseNode(node);
			data = _data;

			modInit();
			bindEvents();
			custFuncs.initView();
		}

		//-----------------暴露各种方法-----------
		that.init = init;

		return that;
	}
});