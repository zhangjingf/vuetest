/**
 * 签到成功弹出窗口
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var touch = require("touch");
    var storageMessager = require("lib/evt/storageMessager");
	var showMessage = require("sea/showMessage");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;

		//---------------事件定义----------------
		var evtFuncs = {
			getGift: function() {
				//nodeList.receive.style.display = 'none';
				//nodeList.detail.style.display = 'block';//不展示detail对话框
				node.style.display = 'none';
			},

			close: function() {
				node.style.display = 'none';
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			if (nodeList.gift) {
				touch.on(nodeList.gift, 'tap', evtFuncs.getGift);//我知道了 关闭弹窗
			}
			if (nodeList.close) {
				touch.on(nodeList.close, 'tap', evtFuncs.close);
			}
		}

		//-----------------自定义函数-------------
		var custFuncs = {
			initView: function() {
				if (node.getAttribute('data-sign') != 0) {
					return;
				}
				if(opts.hasErrorStatus =='1') {
					showMessage('签到失败，本轮活动积分已发放完');
					return;
				}
                storageMessager.send("sign");
				node.style.display = 'block';
				var score = parseInt(nodeList.score.getAttribute('data-score'));
				var index = 1;

				setInterval(function() {
					if (index <= score) {
						nodeList.score.innerHTML = '+' + index;
						index++;
					}
					else {
						if (!nodeList.gift) {
							setTimeout(function() {
								node.style.display = 'none';
							}, 8000);
						}
					}
				}, 77);
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