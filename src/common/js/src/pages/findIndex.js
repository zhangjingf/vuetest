/**
 * 社区-首页
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var queryNode = require("lib/dom/queryNode");
	var swiper = require("swiper");
	var parseNode = require("lib/dom/parseNode");
	var lazyload = require("lib/dom/lazyload");
	var virtualLink = require("lib/util/virtualLink");
	var ajax = require("lib/io/ajax");
	var each = require("lib/util/each");
	var sizzle = require("lib/dom/sizzle");
	var queryToJson = require("lib/json/queryToJson");
	var appendQuery = require("lib/str/appendQuery");
	var trim = require("lib/str/trim");
	var config = require("sea/config");
	//var addEvent = require("lib/evt/add");
	//var touch = require("touch");
	//---------- require end -------------

	var that = compBase();

	//------------声明各种变量----------------
	var nodeList = null;
	var opts = null;
	var m_swiper = null;
	var m_lazyLoad = null;
	var listNode = null;
	var mark = true;/*下拉加载文章标记*/
	var pageIndex = 1;

	//---------------事件定义----------------
	var evtFuncs = {}

	//---------------子模块定义---------------
	var modInit = function() {
		m_lazyLoad = lazyload(document,{'lazyload':custFuncs.loadContent,'height':'5rem'});
		m_lazyLoad.init();

		virtualLink('data-url');
	};

	//-----------------绑定事件---------------
	var bindEvents = function() {
	};

	//-----------------自定义函数-------------
	var custFuncs = {
		initView: function () {
			m_swiper = new swiper('#m_flash', {
				"loop": true,
				"autoplay": 3000,
				"speed": 1000,
				"autoplayDisableOnInteraction": false,
				"paginationClickable": true,
				"lazyLoading": true,
				"lazyLoadingInPrevNext" : true,
				"pagination": '.swiper-point',
				"touchMoveStopPropagation": false,
				"observer": true, //修改swiper自己或子元素时，自动初始化swiper
				"observeParents": true  //修改swiper的父元素时，自动初始化swiper
			});
			custFuncs.changeImgSrc();
		},
		changeImgSrc: function () {
			var imgArr = sizzle("img",nodeList.list);
			each(imgArr, function (item) {
				if(item.getAttribute("data-src")){
					if(item.getAttribute("data-src").match(/[^\s]+\.(jpg|gif|png|bmp)/i)) {
						item.setAttribute("src",item.getAttribute("data-src"));
						item.setAttribute("data-src","");
					}
				}
			})
		},
		loadContent: function () {
			if(!mark) {
				return;
			}
			var param = {
				'listType': '1',
				'page': ++pageIndex,
				'row': '6',
				'isCount': '1'
			}
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
						listNode.more.innerHTML='已经到底了';
						return;
					}
					var contentHtml= '';
					each(res["data"]["reviews"], function (item) {
						contentHtml += '<div class="layout-2" data-url="'+item["dataUrl"]+'">\
											<div class="abbreviation">\
											<img src="'+item["recommendImg"]+'" onerror="this.src=./images/placeholder2.jpg">\
											</div>\
											<div class="text">\
												<div class="title"> '+item["Title"]+'</div>\
												<div class="outline">'+item["content"]+'</div>\
												<div class="interaction"><div>'+item["author"]+'</div> <div class="right"><div> <i class="icon-find-see"></i>'+item["readAmount"]+'</div>\
												<div> <i class="icon-find-review"></i>'+item["commentAmount"]+'</div>\
											</div>\
										</div></div></div>';
					});
					listNode.list.innerHTML += contentHtml;
					m_lazyLoad.work();
				},
				"onError": function (req) {
					console.log("网络连接失败: " + req.status);
				}
			});
		},
		updateLink: function() {
		var panel = parseNode(nodeList.flash).slideList;
		var panels = Array.prototype.slice.call(panel.querySelectorAll("[data-url]"), 0);
		var link = document.createElement("a");
		var search = null;
		var dataAdList = null;
		var advPicUrl = null;
		var param = null;

		panels.forEach(function(item) {
			link.href = item.getAttribute("data-url");

			search = queryToJson(link.search.substr(1));

			/*console.log(search);
			console.log(search.dataAdList);
			console.log(decodeURIComponent(search.dataAdList));
			dataAdList = JSON.parse(decodeURIComponent(search.dataAdList));*/

			dataAdList = JSON.parse(search.dataAdList);

//console.log(dataAdList);
			if (dataAdList.advPicUrl == "") {
				/*item.setAttribute("data-url", appendQuery(item.getAttribute('data-url'), {
				 "title": "",
				 "style": "5"
				 }));*/
				if (dataAdList.adUrl == "") {
					item.setAttribute("data-url", appendQuery(item.getAttribute('data-url'), {
						/*"title": "",
						"style": "5"*/
						"title": "loading...",
						"style": "0"
					}));
				} else {
					link.href = decodeURIComponent(dataAdList.adUrl);

					search = queryToJson(link.search.substr(1));
					if (!!config["r=" + search.r]) {
						param = config[trim("r=" + search.r)];
					} else {
						param = {
							"title": "loading...",
							"style": "0"
						};
					}
					item.setAttribute("data-url", appendQuery(item.getAttribute('data-url'), param));
				}

				return;
			}

			link.href = decodeURIComponent(dataAdList.advPicUrl);

			if (link.search == "") {
				item.setAttribute("data-url", appendQuery(item.getAttribute('data-url'), {
					"title": "loading...",
					"style": "0"
				}));

				return;
			}

			search = queryToJson(link.search.substr(1));
			if (!!config["r=" + search.r]) {
				param = config[trim("r=" + search.r)];
			} else {
				param = {
					"title": "loading...",
					"style": "0"
				};
			}

			item.setAttribute("data-url", appendQuery(item.getAttribute('data-url'), param));
		});
	}
	}

	//-----------------初始化----------------
	var init = function(_opts) {
		opts = _opts || {};

		nodeList = {
			pbd: queryNode("#m_pbd"),
			flash: queryNode("#m_flash"),
			list: queryNode("#m_list")
		};
		listNode = parseNode(nodeList.list);


		modInit();
		bindEvents();
		custFuncs.initView();
		custFuncs.updateLink();
	}

	//-----------------暴露各种方法-----------
	that.init = init;
	return that;
});