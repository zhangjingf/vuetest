/**
 * 设置页面
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
    var header = require("sea/header");
    var setup = require("sea/setup/setup");
    var virtualLink = require("lib/util/virtualLink");
	var storageMessager = require("lib/evt/storageMessager");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
    var m_header =null;
    var m_setup =null;

	//---------------事件定义----------------
	var evtFuncs = {
		changeMobile: function (ev) {
			m_setup.changeMobile(ev.data.mobile);
		}
	}

	//---------------子模块定义---------------
	var modInit = function() {
		if (nodeList.header) {
			m_header = header(nodeList.header, opts);
			m_header.init();
		}

        m_setup = setup(nodeList.setup, opts);
        m_setup.init();

        virtualLink('data-url');
	}

	//-----------------绑定事件---------------
	var bindEvents = function() {
		storageMessager.bind('changeMobile', evtFuncs.changeMobile);
	}

	//-----------------自定义函数-------------
	var custFuncs = {}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts || {};

		nodeList = {
			setup: queryNode("#m_setup"),
			header: queryNode('#m_header')
		}

		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});