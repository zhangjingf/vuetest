/**
 * 社区--文章列表
 *
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	var lazyload = require("lib/dom/lazyload");
	var virtualLink = require("lib/util/virtualLink");
	var parseNode = require("lib/dom/parseNode");
	var ajax = require("lib/io/ajax");
	var each = require("lib/util/each");
	var sizzle = require("lib/dom/sizzle");
	var header = require("sea/header");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
	var m_lazyLoad = null;
	var m_header =null;
	var mark = true;/*下拉加载文章标记*/
	var pageIndex =1;
	var pbdNode = null;
	var m_flexBoxRefresh = null;

	//---------------事件定义----------------
	var evtFuncs = {}

	//---------------子模块定义---------------
	var modInit = function() {
		m_lazyLoad = lazyload(nodeList.pbd,{'lazyload':custFuncs.loadContent,'height':'5rem'});
		m_lazyLoad.init();

		virtualLink('data-url');

		if (nodeList.header) {
			m_header = header(nodeList.header, opts);
			m_header.init();
		}
	}

	//-----------------绑定事件---------------
	var bindEvents = function() {}

	//-----------------自定义函数-------------
	var custFuncs = {
		loadContent: function () {
			if(!mark) {
				return;
			}
			var param = {
				'listType':'2',
				'page': ++pageIndex,
				'row':'6',
				'isCount':'1'
			};
			ajax({
				"url": opts["filmmsgList"],
				"method": "post",
				"data": param,
				"onSuccess": function(res) {
					if (res["status"] != '1') {
						console.log(res.msg);
						return;
					}
					if(res["data"]["reviews"].length <1) {
						mark = false;
						pbdNode.more.innerHTML='已经到底了';
						return;
					}
					var contentHtml= '';
					each(res["data"]["reviews"], function (item) {
						contentHtml += ' <div class="m-findLsit-item" data-url="'+item["dataUrl"]+'"><div class="layout-1">\
										<div class="abbreviation"><img src="'+item["thumbnailImg"]+'" alt="" onerror="this.src=./images/placeholder.jpg"></div>\
										<div class="info"> <div class="title">'+item["Title"]+'</div><div class="interaction"><div>'+item["timeMsg"]+'</div><div class="right">\
										<div><i class="icon-find-see"></i>'+item["readAmount"]+'</div>\
										<div><i class="icon-find-review"></i>'+item["commentAmount"]+'</div>\
										</div></div></div></div></div>';
					});
					pbdNode.list.innerHTML += contentHtml;
					m_lazyLoad.work();
				},
				"onError": function (req) {
					console.log("网络连接失败: " + req.status);
				}
			});
		},
		initView: function () {
			custFuncs.changeImgSrc();
		},
		changeImgSrc: function () {
			var imgArr = sizzle("img",nodeList.pbd);
			each(imgArr, function (item) {
				if(item.getAttribute("data-src")){
					if(item.getAttribute("data-src").match(/[^\s]+\.(jpg|gif|png|bmp)/i)) {
						item.setAttribute("src",item.getAttribute("data-src"));
						item.setAttribute("data-src","");
					}
				}
			})
		}

	}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts || {};

		nodeList = {
			header:queryNode("#m_header"),
			pbd: queryNode("#m_pbd")
		}
		pbdNode = parseNode(nodeList.pbd);
		modInit();
		bindEvents();
		custFuncs.initView();
	}

	//-----------------暴露各种方法-----------
	that.init = init;

	return that;
});