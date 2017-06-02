/**
 *
 *分享
 *
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var touch = require("touch");
	var closest = require("lib/dom/closest");
	var html2canvas = require("sea/shareWord/html2canvas");
	var webBridge = require("sea/webBridge");
	var loading = require("sea/dialog/loading");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var base64String = null;
		var m_loading = null;

		//---------------事件定义----------------
		var evtFuncs = {
			share: function (ev) {
				var type = closest(ev.target, "[data-type]", nodeList.path).getAttribute("data-type");
				webBridge.shareBigImageToWeiXin({"type": type, "base64String": base64String}, function (res) {
					//toast(res.msg);
				})
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {
			m_loading = loading("封面制作中...");
			m_loading.init();
			m_loading.keepMiddle();
		}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			touch.on(nodeList.path,"tap",evtFuncs.share);
		}

		//-----------------自定义函数-------------
		var custFuncs = {
			initView: function () {
				m_loading.show();
				html2canvas(document.querySelector("#m_content"), {
					onrendered: function (canvas) {
						base64String = canvas.toDataURL("image/png", 1);
						m_loading.hide();
						node.classList.remove("hidden");
					}
				});
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