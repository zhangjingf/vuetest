/**
 * 发表评论模块
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
    var showMessage = require("sea/showMessage");
	var ajax = require("lib/io/ajax");
    var storageMessager = require("lib/evt/storageMessager");
	var touch = require("touch");
	var webBridge = require("sea/webBridge");
    var alert = require("sea/dialog/alert");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
		var m_dialog = null;
		var flag = false;

		//---------------事件定义----------------
		var evtFuncs = {
			submit: function() {
				if (that.isLock()) {
                    return;
                }

                var txt = nodeList.textarea.value;

                if(txt.length< 5) {
                    showMessage("评论字数不少于5个字哦~");
                    return;
                } else if(txt.length> 140) {
                    showMessage("评论字数不多于140个字哦~");
					return;
                }

                custFuncs.submitReview(txt);
			},

			textNum: function () {
                var txt = nodeList.textarea.value;
                var num =txt.length;
                if(num > 0) {
                    nodeList.clear_x.style.background = "#ff9600";
                    nodeList.word_num.innerHTML= num+"/140字";
                }else {
                    nodeList.clear_x.style.background = "";
                }
            },

			clear: function() {
				if(nodeList.textarea.value) {
                    nodeList.textarea.value = '';
                }
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {
			m_dialog = alert("发表成功！",{"OK": function () {
                storageMessager.send("haveReview",
                    {
                        "review": true
                    }
                );
				m_dialog.hide();
                webBridge.close();
            }});
            m_dialog.init();
		}

		//-----------------绑定事件---------------
		var bindEvents = function() {
	        touch.on(nodeList.submit,"tap",evtFuncs.submit);
	        touch.on(nodeList.clear,"tap",evtFuncs.clear);
            touch.on(nodeList.textarea, "input",evtFuncs.textNum);
	    }

		//-----------------自定义函数-------------
		var custFuncs = {
			/*a)reviewType: 类型  1为影片评论  2为影院评论
			 b)filmNo:影片编号 当reviewType 为1时候需要传入的参数
			 c)cinemaNo :影院编号 当reviewType为2时候需要传入的参数
			 d)content：评论内容*/
			submitReview: function(review) {
				if (flag) {
					return;
				}
				if (that.isLock()) {
					return;
				}
				that.lock();
				ajax({
					"url": opts["commentFeedbackUrl"]+"&content="+review+"&reviewType=1&filmNo="+opts["filmNo"],
					"onSuccess": function(res) {
						that.unLock();
						flag = true;
						if (res["status"] == 0) {
							showMessage(res["msg"]);
							return;
						}
						/*var dialog = alert("评论成功", {
							"OK": function () {
								webBridge.openUrl(res["data"]["url"]);
							}
						});
						dialog.init();
						dialog.show();*/
						m_dialog.show();
					},
					"onError": function(req) {
						console.error("网络连接失败:" + req.status);
						that.unLock();
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
		}

		//-----------------暴露各种方法-----------
		that.init = init;

		return that;
	}
});