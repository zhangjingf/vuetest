/**
 * webBridge模块
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var geoLocation = require("lib/util/geoLocation");
	var appendQuery = require("lib/str/appendQuery");
	var URL = require("lib/util/URL");
	var jsonToQuery = require("lib/json/jsonToQuery");
	var queryToJson = require("lib/json/queryToJson");

	//---------- require end -------------
	var keyAt = 0;
	var openingWebview = false;
	var list = {};
	var geolocation = navigator.geolocation == null ? false : true;
	var that = exports;

	var errResult = {
		"code": -1,
		"msg": "webBridge: 环境不支持App调用",
		"data": null
	}

	/**
	 * 调用app方法
	 * @param  {string} 方法名称
	 * @param  {Function} 回调函数
	 * @param  {object} 附加数据
	 */
	that.callApp = function(funcName, handler, params) {
		if (!that.isReady()) {
			console.error(errResult["msg"] + "(" + funcName + ")");

			try {
				handler && handler(errResult);
			}catch(ex) {
				console.error(ex);
			}

			return;
		}

		if (handler == null && params == null) {
			try {
				appBridge[funcName]();
			}catch(ex) {
				console.error(ex);
			}

			return;
		}

		var key = "key" + (keyAt++);
		var obj = {};

		if (handler != null) {
			list[key] = handler;
			obj.key = key;
		}

		if (params) {
			obj.data = params;
		}

		try {
			appBridge[funcName](JSON.stringify(obj));
		}catch(ex){
			console.error(ex);
		}
	}

	that.appCallback = function(key, data) {
		data = JSON.parse(data);
		if (data["code"] != 0) {
			console.error("webBridge: app调用执行结果返回错误(" + data["msg"] + ")");
		}

		try {
			list[key](data);
		}catch(ex) {
			console.error(ex);
		}
	}

	that.isReady = function() {
		return "appBridge" in window;
	}

	/**
	 * 获取定位到的当前城市
	 */
	that.getCurrentRegion = function(handler) {
		that.callApp("getCurrentRegion", function(result) {
			if (result["code"] != 0) {
				console.error("webBridge:定位失败");
				/*try {
					handler({
						"code": 0,
						"msg": "定位失败，默认使用南京",
						"data": {
							"areaName": "南京市",
							"areaNo": "320100",
							"areaLevel": "2",
							"pAreaNo": "320000"
						}
					});
				}catch(ex) {
					console.error(ex);
				}
				return;*/
			}
			try {
				handler(result)
			}catch(ex) {
				console.error(ex);
			}
		});
	}

	/**
	 * 获取当前的经纬度
	 * 规则：优先使用app的，否则使用geolocation
	 * @param  {Boolean} isRelacate 默认是false，不强制重新定位，app从数据库中拿出最近半小时内的定位数据。
	 * 如果是true则强制重新定位，app返回最新的定位数据
	 */
	that.getCurrentPosition = function(handler, isRelocate) {
		isRelocate = isRelocate ? isRelocate : false;

		if (that.isReady()) {
			that.callApp("getCurrentPosition", function(result) {
				if (result["code"] != 0) {
					geoLocation(handler);
				} else {
					try {
						handler(result)
					}catch(ex) {
						console.error(ex);
					}
				}
			}, {
				isRelocate: isRelocate
			});
		} else {
			geoLocation(handler);
		}
	}

	/**
	 * 获取用户选择的城市
	 */
	that.getSelectedRegion = function(handler) {
		/*var defResult = {
			"code": 0,
			"msg": "success",
			"data": {
			    "areaNo": "320100",
			    "areaName": "南京市",
			    "pAreaNo": "320000",
			    "areaLevel": 2
			}
		}*/

		if (that.isReady()) {
			that.callApp("getSelectedRegion", function(result) {
				/*if(result["code"] != '0') {
					console.error("webBridge: 获取选定城市失败，默认使用南京");
				} else {
*/
				if (result["code"] != 0) {
					console.error("webBridge:获取选择城市失败");
				}
				try {
					handler(result)
				}catch(ex) {
					console.error(ex);
				}
				//}
			});
			/*that.callApp("getSelectedRegion", function(result) {
				if (result["code"] != 0) {
					// 获取当前城市代替
					console.error("webBridge: 获取选定城市失败，默认使用南京");
					that.setSelectedRegion(defResult["data"]);

					try {
						handler(defResult)
					}catch(ex) {
						console.error(ex);
					}

					return;
				}

				try {
					handler(result);
				}catch(ex) {
					console.error(ex);
				}
			});
		} else {
			try {
				console.error("webBridge: 环境不支持app调用，默认使用南京");
				handler(defResult)
			}catch(ex) {
				console.error(ex);
			}*/
		}
	}

	/**
	 * 设置用户选择的城市
	 */
	that.setSelectedRegion = function(data) {
		// data: areaNo, areaName, pAreaNo, areaLevel
		that.callApp("setSelectedRegion", null, data);
	}

	/**
	 * 打开一个URL
	 * @param  {[type]} url    需要打开的url
	 * @param  {[type]} target blank/self，默认是blank
	 * @param  {[type]} param {title: '下一个页面导航栏标题', style: 1 导航栏显示的类型，controllerType: '',url: '这个可以不要'}
	 * controllerType的取值 支付,微信分享,定位,打电话/影院详情地图  payment/weixinShared/location/mapDetail
	 */
	/*that.openUrl = function(url, target, param) {
		if (openingWebview) {
    		return;
    	}

		target = target == "self" ? "self" : "blank";

		// 转成完整路径
		var link = document.createElement("A");
		link.href = url;

		if (that.isReady()) {
    		openingWebview = true;
			that.callApp("openUrl", null, {
				"url": link.href,
				"target": target,
				"param": param || {}
			});
			setTimeout(function() {
				openingWebview = false;
	    	}
	    	, 1500);
		} else {
			console.error("webBridge: 环境不支持App调用(openUrl)");
			location.href = appendQuery(url, {
				"_target": target
			});
		}
	}*/
	that.openUrl = function(url, target, param) {
		if (openingWebview) {
			return;
		}

		target = target == "self" ? "self" : "blank";

		// 转成完整路径
		var link = document.createElement("A");
		link.href = url;

		if (that.isReady()) {
			openingWebview = true;
			that.callApp("openUrl", null, {
				"url": link.href,
				"target": target,
				"param": param || {}
			});
			setTimeout(function() {
					openingWebview = false;
				}
				, 1500);
		} else {
			console.error("webBridge: 环境不支持App调用(openUrl)");
			location.href = appendQuery(url, {
				"_target": target
			});
		}
	}

	/*/!**
	 * 打开一个URL
	 * @param  {[type]} url    需要打开的url
	 * @param  {[type]} param  传给app的参数
	 * @param  {[type]} target blank/self，默认是blank
	 *!/
	that.openUrl = function (url, param, target) {
		if (openingWebview) {
			return;
		}

		target = target == "self" ? "self" : "blank";

		// 转成完整路径
		var link = document.createElement("A");
		link.href = url;

		if (that.isReady()) {
			openingWebview = true;
			that.callApp("openUrl", null, {
				"url": link.href,
				"target": target,
				"param": param || {}
			});
			setTimeout(function () {
					openingWebview = false;
				}
				, 1500);
		} else {
			console.error("webBridge: 环境不支持App调用(openUrl)");
			location.href = appendQuery(url, {
				"_target": target
			});
		}
	}
*/



	/**
	 * 关闭当前子webview，并指定是否返回最顶层
	 * @param  {Boolean} isRoot 默认是0，返回上一层页面。如果是1则关闭所有子webview，返回根页面
	 * @param closeNumber isRoot传至为3时起作用，关闭当前层之前的closeNumber层
	 */
	that.close = function(isRoot,closeNumber) {
		isRoot = isRoot ? isRoot : 0;
		closeNumber = closeNumber ? closeNumber:1;

		that.callApp("close", null, {
			"isRoot": isRoot,
			"closeNumber":closeNumber
		});
	}

	/**
	 * 用于页面初始化完关闭loading
	 */
	that.closeLoading = function() {
		that.callApp("closeLoading");
	}

	/**
	 * [popToSelectedController description]
	 * @param  {[Number]} index [要跳转的主页的index]
	 * 首页:homePage
	 * 活动:activity
	 * 购票:buyTicket
	 * 我的:mine
	 * 商城 mall
	 */
	that.popToSelectedController = function(index) {
		index = index ? index : "homePage";

		that.callApp("popToSelectedController", null, {
			'index': index
		});
	}

	/**
	 * 重新加载本页[description]
	 * @return {[type]}
	 */
	that.reload = function() {
		var url = URL.parse(location.href);

		var query = url["query"].length ? queryToJson(url["query"]) : {};

		if ("_target" in query) {
			delete query["_target"];
		}

		query["_ts"] = new Date().getTime();
		url["query"] = jsonToQuery(query);
		that.openUrl(URL.build(url), "self");
	}

	/**
	 * 拨打电话
	 */
	that.makeCall = function(number) {
		that.callApp("makeCall", null, {
			'tel': number
		});
	}

	/**
	 * 分享到微信朋友圈
	 * @param  {object} data [要分享的内容], 需包含的字段如下
	 * data = {
	 *		url: 链接,
	 *		type: 分享类型,包括wechat(微信), friends(朋友圈), message(短信)
	 *		title: 标题,
	 *		content: 内容,
	 *		imgUrl: 分享图标
	 *	}
	 *	@param {Function} 回调函数
	 */
	that.share = function(data, handler) {
		if (!data) {
			console.error("webBridge: 没有传入分享内容");
			return;
		}

		webBridge.callApp('shareToThird', handler, data);
	}

	window.webBridge = that;
});