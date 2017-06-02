/**
*自定义票纸
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	var virtualLink = require("lib/util/virtualLink");
	var queryToJson = require("lib/json/queryToJson");
	var URL = require("lib/util/URL");	
	var webBridge = require("sea/webBridge");
	var paper = require("sea/customTicketPaper/paper");
    var header = require("sea/header");

	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
    var m_header = null;
    var m_paper = null;

	//---------------事件定义----------------
	var evtFuncs = {}

	//---------------子模块定义---------------
	var modInit = function() {
		if (nodeList.header) {
			m_header = header(nodeList.header, opts);
			m_header.init();
		}

		m_paper = paper(nodeList.paper, opts);
		m_paper.init();
	}

	//-----------------绑定事件---------------
	var bindEvents = function() {

		webBridge.onBackPressed = function() {
			webBridge.close();
			var isIPhone = navigator.appVersion.match(/iphone/gi);
			if (isIPhone) {
				return "turnBackSucceed";
			}
		}
	}

	//-----------------自定义函数-------------
	var custFuncs = {}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts =_opts;
		opts.url = queryToJson(URL.parse(location.href)["query"]);
		nodeList = {
			header: queryNode('#m_header'),
			paper: queryNode('#m_paper')
		}

		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});