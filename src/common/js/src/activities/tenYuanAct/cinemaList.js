/**
 * 活动影院和影片列表模块
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var compBase = require("lib/comp/base");
	var parseNode = require("lib/dom/parseNode");
	var closest = require("lib/dom/closest");
	var className = require("lib/dom/className");
	var sizzle = require("lib/dom/sizzle");
	var each = require("lib/util/each");
	var touch = require("touch");
	var contains = require("lib/dom/contains");
	var ajax = require("lib/io/ajax");
    var trim = require("lib/str/trim");
    var showMessage = require("sea/showMessage");
	//---------- require end -------------

	return function(node, opts) {
		var that = compBase();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;

		//---------------事件定义----------------
		var evtFuncs = {
			showCityList: function(ev) {
				var target = closest(ev.target, '.city', node);

				className.toggle(target, 'active');
			},

			hideCityList: function(ev) {
				if (!contains(nodeList.city, ev.target)) {
					className.remove(nodeList.city, 'active');
				}
			},

			selectCity: function(ev) {
				if (className.has(ev.target, 'choosed')) {
					className.remove(nodeList.city, 'active');
					return;
				}

				var items = sizzle('.item', node);

				each(items, function(item, key, source) {
					className.remove(item, 'choosed');
				})

				className.add(ev.target, 'choosed');
				className.remove(nodeList.city, 'active');
				nodeList.choosedCity.innerHTML = ev.target.innerHTML;
				nodeList.choosedCity.setAttribute('data-area-no', ev.target.getAttribute('data-area-no'));

                nodeList.cinemaList.innerHTML = '';
				custFuncs.updateCinemaList(ev.target.getAttribute('data-area-no'));
			},

			toggleCinemaList: function(ev) {
				var target = closest(ev.target, '.item', nodeList.cinemaList);

				className.toggle(target, 'active');

				if (!className.has(target, 'active')) {
					return;
				}

				var movieList = sizzle('.movie-list', target)[0];
				if (trim(movieList.innerHTML) != '') {
					return;
				}

				movieList.innerHTML = '加载中...'

	            var areaNo = nodeList.choosedCity.getAttribute('data-area-no');
	            var cinemaNo = target.getAttribute('data-cinema-no');

	            ajax({
	                "url": opts.getFilmList + '&cinemaNo=' + cinemaNo + '&areaNo=' + areaNo + '&actNo=' + opts.actNo,
	                "onSuccess": function(res) {
	                    if (res["status"] != 1) {
	                    	movieList.innerHTML = '';
	                    	showMessage(res['msg']);
	                        return;
	                    }
	                    var result = res.data;
						if(!result) {
							movieList.innerHTML = '';
							return;
						}
	                    var html = '';
	                    each(result, function(film, key, source) {
	                    	var showType = film.weekList[0].shows[0].showType;
	                    	html += '<div class="movie">\
				    					<div class="layout-1">\
				    						<img src="' + film.filmSrc + '" alt="影片海报" />\
				    					</div>\
				    					<div class="layout-2">\
				    						<h3><span>' + film.cName + '</span><span class="dimensional">' + showType + '</span></h3>\
				    						<p class="category">' + film.filmType + '</p>\
				    					</div>\
				    					<div class="layout-3">\
				    						<div class="btn" data-title='+ film.cName +'_film/cinemaList" data-url="' + film.url + '&_target=blank">去购票</div>\
				    					</div>\
				    				</div>';
	                    })

	                    if (result.length == 0) {
	                    	html = '暂无活动影片';
	                    }

	                    movieList.innerHTML = html;
	                },
	                "onError": function(req) {
	                    movieList.innerHTML = "网络连接失败:" + req.status;
	                }
	            });
			}
		}

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {
			touch.on(document.body, 'tap', evtFuncs.hideCityList);
			touch.on(nodeList.cityBtn, 'tap', evtFuncs.showCityList);
			touch.on(nodeList.cityList, 'tap', '.item', evtFuncs.selectCity);
			touch.on(nodeList.cinemaList, 'tap', '.cinema', evtFuncs.toggleCinemaList);
		}

		//-----------------自定义函数-------------
		var custFuncs = {
			updateCinemaList: function(areaNo) {
	            ajax({
	                "url": opts.getCinemaList + "&areaNo=" + areaNo + '&actNo=' + opts.actNo,
	                "onSuccess": function(res) {
	                    if (res["status"] != 1) {
	                    	showMessage(res['msg']);
	                        return;
	                    }

	                    var result = res.data;
	                    var html = '';

	                    if (!result) {
							html = '<div class="blankPrompt">该地区暂无影院数据</div>';
	                    }
	                    else {
		                    each(result.cinemas, function(cinema, key, source) {
		                    	html += '<div class="item" node-name="cinema" data-cinema-no="' + cinema.cinemaNo + '">\
					                    	<div class="cinema">\
									    			<div class="layout-1">\
									    				<h2>' + cinema.cinemaName + '</h2>\
									    				<address>' + cinema.area + '</address>\
									    			</div>\
									    			<div class="layout-2">\
									    				<span class="icon"></span>\
									    			</div>\
									    		</div>\
									    		<div class="movies">\
									    			<h1>选择活动影片</h1>\
									    			<div class="movie-list" node-name="movieList" data-cinema-no="' + cinema.cinemaNo + '">\
									    			</div>\
									    		</div>\
									    	</div>\
									    </div>';
		                    });
		                }

	                    nodeList.cinemaList.innerHTML = html;
	                    nodeList = parseNode(node);
	                },
	                "onError": function(req) {
	                    nodeList.cinemaList.innerHTML = "网络连接失败:" + req.status;
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