/**
 *
 * 卖品宣传页面
 *
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
    var webBridge = require("sea/webBridge");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
    var pbdNode = null;

	//---------------事件定义----------------
	var evtFuncs = {
        buyMeal:function () {
            webBridge.openUrl(opts["mealUrl"]);
        },
		back: function () {
			webBridge.close();
		}
    }

	//---------------子模块定义---------------
	var modInit = function() {

	}

	//-----------------绑定事件---------------
	var bindEvents = function() {
		if(pbdNode.back) {
			touch.on(pbdNode.back,"tap",evtFuncs.back);
		}
        touch.on(pbdNode.buy,"tap",evtFuncs.buyMeal);
    }

	//-----------------自定义函数-------------
	var custFuncs = {}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts || {};

		nodeList = {
			pbd: queryNode("#m_pbd")
		}
        pbdNode = parseNode(nodeList.pbd);
		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});