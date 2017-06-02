/**
 * 点击切换的导航
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var touch = require("touch");
    var className = require("lib/dom/className");
    var each = require("lib/util/each");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;

		//---------------事件定义----------------
		var evtFuncs = {
			switch: function(ev) {
				if(!ev.target) {
					ev.target =ev;
				}
				if(className.has(ev.target, "active")){
                    return;
                }

                var index = ev.target.getAttribute("data-index");

                each(nodeList.tab, function(tab, key, source) {
                	className.remove(tab, 'active');
                })
                className.add(ev.target, 'active');

                that.fire("switchTab", index);
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {
            touch.on(nodeList.tabs, "tap", ".tab", evtFuncs.switch);
		}
		//-----------------自定义函数-------------
		var custFuncs = {
			toMovie: function () {
				var target = nodeList.tab[0];
				evtFuncs.switch(target);
			}
		}

		//-----------------初始化----------------
		var init = function(_data) {
			nodeList = parseNode(node);
			data = _data;

			modInit();
			bindEvents();
		}

		//-----------------暴露各种方法-----------
		that.init = init;
		that.toMovie = custFuncs.toMovie;

		return that;
	}
});