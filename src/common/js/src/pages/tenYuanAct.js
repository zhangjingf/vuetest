/**
 * 十元看大片活动
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	var head = require('activities/head');
	var cinemaList = require('activities/tenYuanAct/cinemaList');
	var actInfo = require('activities/tenYuanAct/actInfo');
	var URL = require("lib/util/URL");
    var queryToJson = require("lib/json/queryToJson");
    var merge = require("lib/json/merge");
    var virtualLink = require("lib/util/virtualLink");
	var webBridge = require("sea/webBridge");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
	var m_head = null;
	var m_detail = null;
	var m_cinema = null;
	var m_actInfo = null;

	//---------------事件定义----------------
	var evtFuncs = {}

	//---------------子模块定义---------------
	var modInit = function() {
		if (nodeList.head) {
			m_head = head(nodeList.head, opts);
			m_head.init();
		}

		m_cinema = cinemaList(nodeList.cinema, opts);
		m_cinema.init();

		m_actInfo = actInfo(nodeList.actInfo, opts);
		m_actInfo.init();

        virtualLink('data-url');
	}

	//-----------------绑定事件---------------
	var bindEvents = function() {}

	//-----------------自定义函数-------------
	var custFuncs = {
		//方便处理在页面控制器写倒计时
	}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts;
        var query = queryToJson(URL.parse(location.href)["query"]);
        opts = merge(opts, query);

		nodeList = {
			head: queryNode("#m_header"),
			cinema: queryNode("#m_cinema"),
			actInfo: queryNode("#m_info")
		}
		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});