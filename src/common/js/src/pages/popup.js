/**
 * 账号异常
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	var webBridge = require("sea/webBridge")
	var popup = require("sea/popup/popup");
	var winSize = require("lib/util/winSize");
    var scrollPos  = require("lib/util/scrollPos");
    var setStyle = require("lib/dom/setStyle");

	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
	var m_popup = null;
	var size = winSize();
    var scroll = scrollPos();
        

	//---------------事件定义----------------
	var evtFuncs = {

	}

	//---------------子模块定义---------------
	var modInit = function() {
		m_popup = popup(nodeList.popup, opts);
		m_popup.init();

	}

	//-----------------绑定事件---------------
	var bindEvents = function() {

	}

	//-----------------自定义函数-------------
	var custFuncs = {
		setMiddle: function() {
	        var top = 0;
			var testTop = Math.floor(size.height * .25);

	        if ((testTop * 2 + nodeList.popup.offsetHeight) <= size.height) {
	            top = testTop + scroll.top;
	        } else {
	            top = (size.height - nodeList.popup.offsetHeight) / 2 + scroll.top;
	        }
	        top = top < 0 ? 0 : top;

	        setStyle(nodeList.popup, {
	            "top": top + "px"
	         });
	        nodeList.popup.style.display = 'block';
		}
	}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts;
		nodeList = {
			popup: queryNode("#m_popup")
		}
		modInit();
		bindEvents();
		custFuncs.setMiddle();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});