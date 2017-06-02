/**
 *
 *影评回复评论
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	var header = require("sea/cinemaComment/header");
	var comment = require("sea/cinemaComment/comment");
	var footer = require("sea/cinemaComment/footer");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
	var m_header = null;
	var m_comment = null;
	var m_footer = null;

	//---------------事件定义----------------
	var evtFuncs = {
		ownReview: function(ev) {
			m_comment.ownReview(ev.data);
		}
	}

	//---------------子模块定义---------------
	var modInit = function() {
		if (nodeList.header) {
			m_header = header(nodeList.header);
			m_header.init();
		}

		m_comment = comment(nodeList.comment, opts);
		m_comment.init();

		m_footer = footer(nodeList.footer, opts);
		m_footer.init();
	}

	//-----------------绑定事件---------------
	var bindEvents = function() {
		m_footer.bind("ownReview", evtFuncs.ownReview);
	}

	//-----------------自定义函数-------------
	var custFuncs = {

	}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts;
		nodeList = {
			header: queryNode("#m_header"),
			comment: queryNode("#m_comment"),
			footer: queryNode("#m_footer")
		}

		modInit();
		bindEvents();
	}

	//-----------------暴露各种方法-----------
	that.init = init;
	return that;
});