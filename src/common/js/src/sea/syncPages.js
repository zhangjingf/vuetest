/**
 * 某个状态改变时，同步所有需要根据这个状态决定展示内容的页面。
 * 如登录后，所有与登录状态有关的页面都需要刷新。
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var storageMessager = require('lib/evt/storageMessager');
	var webBridge = require('sea/webBridge');
	var utils = require('sea/utils');
	//---------- require end -------------
	var that = exports;

	// 刷新当前页面
	var reloadPage = function() {
		var url = utils.getCurrentURL();

		webBridge.openUrl(url, 'self');
	};

	// 用户登录/登出后，刷新与用户身份相关的页面
	that.updateViewWhenUserChange = function() {
		storageMessager.bind('userChanged', reloadPage);
	};

	// 发表评论后，显示该类型评论的页面要刷新，已显示最新的评论
	that.syncReviews = function() {
		storageMessager.bind('haveReview', reloadPage);
	};


	return that;
});