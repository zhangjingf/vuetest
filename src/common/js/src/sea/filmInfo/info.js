/**
 * 影片大图
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var swiper = require("swiper");
	var touch = require("touch");
	var each = require("lib/util/each");
	var utils = require("sea/utils");
    var alertBigImg = require("sea/filmInfo/alertBigImg");
	var webBridge = require("sea/webBridge");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var m_alertBigImg = null;
		var m_imgSwiper = null;
		var m_ybSwiper = null;
		//var headerNode = null;	/*头部在iOS上会有两个返回*/

		//---------------事件定义----------------
		var evtFuncs = {
			showBigImg: function(ev) {
				var imgArr = nodeList.photoSwiper.getElementsByTagName("img");
				var html = '';
				var _toIndex = ev.target.getAttribute("data-index");
				each(imgArr, function (item) {
					html += '<div class="swiper-slide" data-imgurl="'+item["src"]+'">\
					 			<img src="'+item["src"]+'"/>\
					 		</div>';
				});
				m_alertBigImg = alertBigImg(html,{"designcover":opts["designcover"],"filmNo":opts["filmNo"]});
				m_alertBigImg.init();
				m_alertBigImg.show();
				m_alertBigImg.slideTo(_toIndex);
			},
			more: function () {
				nodeList.filmInfo.classList.toggle("layout-1-more");
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {
			m_ybSwiper = swiper(nodeList.ybswiper, {
				loop: true,
			 	direction: 'vertical',
			 	autoplay: 2000,
			 	observer:true,
			 	onClick: function(ev) {
			 		webBridge.openUrl(opts["invitationViewUrl"]+'&id='+ev.clickedSlide.dataset.id, "blank");
			 	}
            }) 
            if(!nodeList.ybswiper) {
            	node.style.marginBottom = "1.5rem";
            }
		}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			if(nodeList.photoSwiper) {
				touch.on(nodeList.photoSwiper,"tap","img",evtFuncs.showBigImg);
			}
			touch.on(nodeList.more,"tap",evtFuncs.more);
			touch.on(nodeList.more2,"tap",evtFuncs.more);

			webBridge.onBackPressed = function() {
				var isIPhone = navigator.appVersion.match(/iphone/gi);
				if(document.querySelector(".m-mode-alertBigImg")) {
					m_alertBigImg.hide();
					webBridge.topBarVisible({"hide": "0"});//2:替换为回退箭头
				} else {
					webBridge.close();
				}
				if (isIPhone) {
					return "turnBackSucceed";
				}
			};
			if(nodeList.more2.children[0].children) {
				for(var i = 0; i < nodeList.more2.children[0].children.length; i++) {
					if(nodeList.more2.children[0].children[i].innerHTML == "<br>") {
						nodeList.more2.children[0].children[i].innerHTML = "";
					}
				}
			}
		}

		//-----------------自定义函数-------------
		var custFuncs = {
			initView: function () {
				var space = utils.remToPixel(1);
				m_imgSwiper= swiper(nodeList.photoSwiper, {
					loop: false,
					touchMoveStopPropagation: false,
					slidesPerView: 3,
					spaceBetween: space,
					"lazyLoading": true,
					"lazyLoadingInPrevNext" : true,
					"lazyLoadingInPrevNextAmount":2
				});
				var infoHigh = nodeList.filmInfo.offsetHeight;

				var trueHigh = 0;
				each(nodeList.filmInfo.childNodes, function (item) {
					if(item.nodeType =="1") {
						trueHigh += item.offsetHeight;
					}
				});
				if(trueHigh>infoHigh+3) {
					nodeList.more.style.display= 'inherit';
				}
			}
		}

		//-----------------初始化----------------
		var init = function(_data) {
			nodeList = parseNode(node);
			data = _data;
			modInit();
			bindEvents();
			custFuncs.initView(); 
		}

		//-----------------暴露各种方法-----------
		that.init = init;

		return that;
	}
});