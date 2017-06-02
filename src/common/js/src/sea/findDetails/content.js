/**
 * 图片轮播
 */
define(function(require, exports, module) { 
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var touch = require("touch");
	var each = require("lib/util/each");
	var alertBigImg = require("sea/findDetails/alertBigImg");
	var webBridge = require("sea/webBridge");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var m_alertBigImg = null;

		//---------------事件定义----------------
		var evtFuncs = {
			showImg: function (ev) {
				var imgArr = node.getElementsByTagName("img");
				console.log(imgArr);
				var html = '';
				var _toIndex = 0;
				var _nowImgUrl = ev.target.src;
				each(imgArr, function (item,index) {
					html += '<div class="swiper-slide">\
					 <img src="'+item["src"]+'"/>\
					 </div>';
					if(item["src"] ==_nowImgUrl) {
						_toIndex=index;
					}
				});
				//webBridge.topBarVisible({"hide": "1"},function(res){
					//setTimeout(function () {
						m_alertBigImg = alertBigImg(html,{});
						m_alertBigImg.init();
						m_alertBigImg.show();
						m_alertBigImg.slideTo(_toIndex);
					//},50)
				//});//隐藏原生导航栏
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {

		}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			//touch.on(node,'tap',"img",evtFuncs.showImg);

			webBridge.onBackPressed = function() {
				var isIPhone = navigator.appVersion.match(/iphone/gi);
				if(document.querySelector(".m-mode-alertBigImg")) {
					//m_alertBigImg.hide();
					//webBridge.topBarVisible({"hide": "2"});//2:替换为回退箭头
				} else {
					webBridge.close();
				}
				if (isIPhone) {
					return "turnBackSucceed";
				}
			};
		}

		//-----------------自定义函数-------------
		var custFuncs = {
		}

		//-----------------初始化----------------
		var init = function(_data) {
			nodeList = parseNode(node);
			data = _data;
			modInit();
			bindEvents();
		}

		//-----------------暴露各种方法-----------
		that.init = init;
		return that;
	}
});