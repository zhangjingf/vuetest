/**
 * 拥有“确定”按钮的警告窗口
 * @param  {string} bText 大标题
 * @param  {object} opts  配置信息
 *
 * opts:
 *     title: 弹层标题，默认为提示
 *     icon: 显示图标 允许为succ/err/que/del
 *     sTexts: 二级标题，可以是字符串或者一个字符串数组
 *     OKText: 确认按钮的文字
 *     OK: 当按下确认按钮的回调函数
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("../io/console");
	var compBase = require("../comp/base");
	var parseNode = require("../dom/parseNode");
	var addEvent = require("../evt/add");
	var className = require("../dom/className");
	var dialogBase = require("../layer/dialog/common");
	var browser = require("../util/browser");
	var touch = require("touch");
	//---------- require end -------------

	var TMPL = '<a href="javascript:void(0);" class="button" node-name="ok">确定</a>';

	return function(bText, opts) {
		opts = opts || {};
		var that = dialogBase(bText, opts);

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var node = null;
		var superMethod = {
			init: that.init
		};

		//---------------事件定义----------------
		var evtFuncs = {
			ok: function() {
				that.hide("ok");
				opts.OK && opts.OK();
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			if (browser.MOBILE) {
				touch.on(nodeList.ok, "tap", evtFuncs.ok);
			} else {
				addEvent(nodeList.ok, "click", evtFuncs.ok);
			}
		}

		//-----------------自定义函数-------------
		var custFuncs = {
			setOKText: function(text) {
				nodeList.ok.innerHTML = text;
			}
		}

		//-----------------初始化----------------
		var init = function(_data) {
			superMethod.init.call(that, _data);
			node = that.getInner();
			nodeList = parseNode(node);
			data = _data;
			nodeList.opra.innerHTML = TMPL;
			nodeList = parseNode(node);
			that.setOKText(opts.OKText || "确定");

			modInit();
			bindEvents();
		}

		//-----------------暴露各种方法-----------
		that.init = init;
		that.setOKText = custFuncs.setOKText;

		return that;
	}
});