/**
 * 通用提示窗口基础对象
 * @param  {string} bText 大标题
 * @param  {object} opts  配置信息
 *
 * opts:
 *     title: 弹层标题，默认为提示
 *     icon: 显示图标 允许为succ/err/que/del
 *     sTexts: 二级标题，可以是字符串或者一个字符串数组
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("../io/console");
	var compBase = require("../comp/base");
	var parseNode = require("../dom/parseNode");
	var addEvent = require("../evt/add");
	var className = require("../dom/className");
	var dialogBase = require("../layer/dialog/base");
	var getType = require("../util/getType");
	//---------- require end -------------

	var TMPL = '<div class="icon"></div>\
				<div class="bText" node-name="bText"></div>\
				<div class="sText" node-name="sText"></div>\
				<div class="opra" node-name="opra"></div>'
	//<a href="javascript:void(0);" class="button button-gray">取消</a><a href="javascript:void(0);" class="button">确定</a>
	return function(bText, opts) {
		opts = opts || {};
		var that = dialogBase(opts);

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var node = null;
		var superMethod = {
			init: that.init
		};

		//---------------事件定义----------------
		var evtFuncs = {}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {}

		//-----------------自定义函数-------------
		var custFuncs = {
			setIcon: function(icon) {
				className.remove(node, "m-dialog-common-succ");
				className.remove(node, "m-dialog-common-err");
				className.remove(node, "m-dialog-common-que");
				className.remove(node, "m-dialog-common-del");

				switch(icon) {
					case "succ":
					case "err":
					case "que":
					case "del":
						className.add(node, "m-dialog-common-" + icon);
						break;
				}
			},
			setSTexts: function(texts) {
				texts = texts == null ? "" : texts;

				if (getType(texts) != "array") {
					texts = [texts];
				}

				var html = [];

				for (var i = 0; i < texts.length; i++) {
					html.push('<div>' + texts[i] + '</div>');
				}

				nodeList.sText.innerHTML = html.join("");
			},
			setBText: function(text) {
				nodeList.bText.innerHTML = text;
			}
		}

		//-----------------初始化----------------
		var init = function(_data) {
			superMethod.init.call(that, _data);
			node = document.createElement("DIV");
			className.add(node, "m-dialog-common");
			that.setInner(node);
			node.innerHTML = TMPL;
			nodeList = parseNode(node);
			data = _data;

			that.setTitle(opts.title || "提示");
			that.setBText(bText || "");
			that.setSTexts(opts.sTexts || []);
			that.setIcon(opts.icon || "");

			modInit();
			bindEvents();
		}

		//-----------------暴露各种方法-----------
		that.init = init;
		that.setIcon = custFuncs.setIcon;
		that.setBText = custFuncs.setBText;
		that.setSTexts = custFuncs.setSTexts;

		return that;
	}
});