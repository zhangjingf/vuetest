/**
 * 社区--文章详情
 *
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	var reviewList = require("sea/findDetails/reviewList");
	var publish = require("sea/findDetails/publish");
	var content = require("sea/findDetails/content");
	var storageMessager = require("lib/evt/storageMessager");
	var webBridge = require("sea/webBridge");
	var utils = require("sea/utils");
	var header = require("sea/header");
	//var touch = require("touch");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
	var m_reviewList = null;
	var m_publish = null;
	var m_content = null;
	var m_header = null;


	//---------------事件定义----------------
	var evtFuncs = {
		publish: function (ev) {
			m_reviewList.setReview(ev.data);
		},
		showImg: function () {
			custFuncs.showImg();
		},
		userChanged: function () {
			webBridge.openUrl(utils.getCurrentURL(),'self');
		}
	}

	//---------------子模块定义---------------
	var modInit = function() {
		//virtualLink('data-url');

		m_reviewList = reviewList(nodeList.review,opts);
		m_reviewList.init();

		m_content = content(nodeList.content,opts);
		m_content.init();


		m_publish = publish(nodeList.publish,opts);
		m_publish.init();

		if (nodeList.header) {
			m_header = header(nodeList.header, opts);
			m_header.init();
		}

	}

	//-----------------绑定事件---------------
	var bindEvents = function() {
		m_publish.bind("publish",evtFuncs.publish);
		storageMessager.bind('userChanged', evtFuncs.userChanged);//登录刷新页面
	}

	//-----------------自定义函数-------------
	var custFuncs = {

	};
	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts || {};

		nodeList = {
			header: queryNode("#m_header"),
			review: queryNode("#m_review"),
			content: queryNode("#m_content"),
			publish: queryNode("#m_publish")
		};
		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});