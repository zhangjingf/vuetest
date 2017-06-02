/**
 * 传统动画实现 From STK
 *  @node     {Node}     动画节点
 *  @prop     {Object}   结束状态列表 {height:50px, left: 50px}
 *  @duration {Number}   动画过度效果的过程时长，单位毫秒 可缺损 默认 1000 
 *  @easing   {String}   动画过度效果名词  可缺损 默认 'linaer'
 *  @callback {Function} 动画结束回调函数
 *  @example 
 *  var ani  = animate(node, { height: '500px', width: '+60px' });
	var ani  = animate.chain(node)
	.animate({ height:           '+40px' }, 'ease-in')
	.animate({ width:            '+60px' })
	.animate({ backgroundColor:  'blue'  })
	.animate({ transform:  'rotate(60deg) scale(1,1.5) ', top: '100px', 'left':'100px' }, 'ease-out')
	;
 */
define(function(require) { 
	var console = require("../io/console");
	var when = require("../util/when");
	var color = require("../util/color");
	var getStyle = require("../dom/getStyle");
	var setStyle = require("../dom/setStyle");
	var arrayMap = require("../util/arrayMap");
	var getType = require("../util/getType");

	var defaultEasing   = 'linear';
	var defaultDuration = 1000;

	var rnum            = /(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/;
	var rfxnum          = new RegExp( "^([+-]?)(" + rnum.source + ")([a-z%]*)$", "i" );
	var rmatrix         = /([0-9\.\-]+)/ig;
	
	//用于临时节点
	var testNode = document.createElement("DIV");
	var hideCss  = ';height:0;width:0;visibility:hidden;position:absolute;top:-1000px;left:-1000px;';

	//动画过度算法
	//提供四种简单的方式可以扩展
	var AniEsasing = {
		  'linear': function (pst) { 
			return pst; 
		}
		, 'ease-in': function(pst){
			return 1 - Math.cos( pst * Math.PI / 2 );
		}
		, 'ease-out': function(pst){
			return 1 - AniEsasing['ease-in']( 1 - pst );
		}
		, 'ease-in-out': function(pst){
			return pst < 0.5 ? AniEsasing['ease-in']( pst * 2 ) / 2 : 1 - AniEsasing['ease-out']( pst * -2 + 2 ) / 2;
		}
	};

	/*
	 *  添加动画过度效果
	 *  @method addEasomg
	 *  @public
	 */
	function addEasing (name, fx) {
		if(name in AniEsasing){
			console.error('ani.animate: 该效果名已经存在');
		}

		return AniEsasing[name] = fx;
	}

	//兼容帧频动画
	var _requestAnimationFrame = (function(){
		return window.requestAnimationFrame       ||
		       window.webkitRequestAnimationFrame ||
		       window.mozRequestAnimationFrame    ||
		       window.msRequestAnimationFrame     ||
		       function(callback){ window.setTimeout(callback, 1000 / 60) };
	})();

	/*
	 *  转化css transform 值为矩阵值（matrix）
	 *  @method _formatMatrix
	 *  @private
	 *  @param  {String}
	 */
	function _formatMatrix (value) {
		testNode.style.cssText = '-webkit-transform:' + value + ';-moz-transform:' + value + ';-o-transform:' + value + ';transform:' + value + hideCss;
		document.body.appendChild(testNode);
		value = getStyle(testNode, 'transform');
		testNode.parentNode.removeNode(testNode);
		testNode.style.cssText = '';
		return value;
	}	


	/*
	 *  转化css color 值 如果是rgba的是rgba(x,x,x,x) 不然是#xxxxxx
	 *  @method _formatColor
	 *  @private
	 *  @param  {String}
	 */
	function _formatColor (value) {
		//backgroundColor 在不插入dom流中的情况下是获取不到的		
		//ie6 下设置background-color rbg(x,x,x) 是有问题的
		testNode.style.cssText = 'background-color:' + value + ';_background:'+value + hideCss;
		document.body.appendChild(testNode);
		value = getStyle(testNode, 'background-color');
		testNode.parentNode.removeNode(testNode);
		testNode.style.cssText = '';
		return value;
	}



	/*
	 *  计算反计算 matrix 到 rotate, scale, skew
	 *  turns a matrix into its rotate, scale and skew components
	 *  http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp
	 *  @method _unmatrix
	 *  @private
	 *  @param  {Array} [x,x,x,x,x,x] matrix的六个值
	 *  @return [
	 *            [ type, [value], unit ]
	 *            ...
	 *          ]
	 */
	function _unmatrix(matrix) {
		var
			  scaleX
			, scaleY
			, skew
			, A = matrix[0]
			, B = matrix[1]
			, C = matrix[2]
			, D = matrix[3]
			;

		// Make sure matrix is not singular
		if ( A * D - B * C ) {
			// step (3)
			scaleX = Math.sqrt( A * A + B * B );
			A /= scaleX;
			B /= scaleX;
			// step (4)
			skew = A * C + B * D;
			C -= A * skew;
			D -= B * skew;
			// step (5)
			scaleY = Math.sqrt( C * C + D * D );
			C /= scaleY;
			D /= scaleY;
			skew /= scaleY;
			// step (6)
			if ( A * D < B * C ) {
				A = -A;
				B = -B;
				skew = -skew;
				scaleX = -scaleX;
			}

		// matrix is singular and cannot be interpolated
		} else {
			// In this case the elem shouldn't be rendered, hence scale == 0
			scaleX = scaleY = skew = 0;
		}

		// The recomposition order is very important
		// see http://hg.mozilla.org/mozilla-central/file/7cb3e9795d04/layout/style/nsStyleAnimation.cpp#l971
		return [
			['translate',  [+matrix[4], +matrix[5]], 'px'],
			['rotate',     [Math.atan2(B, A)],      'rad'],
			['skew' + "X", [Math.atan(skew)],       'rad'],
			['scale',      [scaleX, scaleY],           '']
		];
	}	

	/*
	 *  转换16进制
	 *  @method _tohex
	 *  @private
	 *  @param {String}
	 */
	function _tohex (x) {
		var hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
		return isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
	}


	/*
	 *  设置元素每一帧的位置
	 *  根据当前的过程的百分比设置当前的值
	 *  @method _tween
	 *  @private
	 */
	function _tween (node, easing, timeFramePst, start, end, unit){
		var value;
		var i;
		var rs = {};
		for (i in start) {
			value = undefined;
			//特殊处理颜色
			if ( /color/i.test(i) ) {
				var rgba       = arrayMap(['R', 'G', 'B', 'A'], function(value){					
					value = 'get' + value;
					var _start = start[i][1][value]() ? start[i][1][value]() : 0 | 0;
					var _end   =   end[i][1][value]() ?   end[i][1][value]() : 0 | 0;
					return _start + (_end - _start) * AniEsasing[easing](timeFramePst);
				})				
				//如果支持RGBa的使用RGBa
				//不然的话用#xxxxxx的方式				
				if(start[i][1] === 'rgba'){
					value = 'rbga(' + rbga.join(',') + ')';
				}else{
					//rgba[0]要转化成init
					value = "#" + _tohex(rgba[0]|0) + _tohex(rgba[1]|0) + _tohex(rgba[2]|0)
				}
			} else if (/transform/i.test(i)) {
				var transform;
				value = arrayMap(start[i], function(v, index){
					var name  = start[i][index][0];
					var value = arrayMap(start[i][index][1], function(v, _index){
						var _start = start[i][index][1][_index];
						var _end   =   end[i][index][1][_index];
						return (_start + (_end - _start) * AniEsasing[easing](timeFramePst)).toFixed(5) + start[i][index][2];
					}).join(',');
					return name + '(' + value + ')';
				});
				value = value.join(' ');
			}
			else{
				value = start[i] + (end[i] - start[i]) * AniEsasing[easing](timeFramePst) + unit[i];
			}
			rs[i] = value;
		}
		setStyle(node, rs);
	}	
	
	/*
	 *  时钟
	 *  @method _tick
	 *  @private
	 */
	function _tick (duration, progressCallback){		
		var pst       = 0;
		var startTime = +new Date();
		var endTime   = +new Date() + duration;
		var stopTime;
		var isStoped = false;

		_step();
		progressCallback(pst);

		return { stop: _stop, goOn: _goOn };

		//时钟步进
		function _step () {
			if(isStoped === true){
				return;
			}
			var nowTime = +new Date();
			pst = (nowTime - startTime) / duration;
			if(nowTime >= endTime){
				isStoped = true;
				return progressCallback(1);
			}			
			progressCallback(pst)
			_requestAnimationFrame(_step);
		}

		//时钟暂停
		function _stop () {
			if(isStoped === false){
				isStoped = true;
				stopTime = +new Date();
			}			
		}

		//时钟继续
		function _goOn () {
			var nowTime = +new Date();
			if(isStoped === true){
				startTime += nowTime-stopTime;
				endTime   += nowTime-stopTime;
				isStoped = false;
				_step();
			}
		}		
	}

	/*
	 *  对于动画属性值的过滤
	 *  @method _formateProp
	 *  @private
	 */
	function _formateProp (node, prop, endValue){
		var target;
		var start;
		var end;
		var unit;
		var tween = {};
		//特殊处理颜色
		if( /color/i.test(prop) ){
			start = getStyle(node, prop);
			end   = _formatColor(endValue);
			unit = /rgba/.test(end) || /rgba/.test(start) ? 'rgba' : '#';
			tween.start = [ unit, color(start) ];
			tween.end   = [ unit, color(end  ) ];
			return tween;
		}

		//特殊transform
		if( /transform/i.test(prop) ){
			start = getStyle(node, prop);			
			end   = _formatMatrix(endValue);
			start = start === 'none' ? 'matrix(1,0,0,1,0,0)' : start;
			end   = end   === 'none' ? 'matrix(1,0,0,1,0,0)' : end;
			tween.start = _unmatrix( start.match(rmatrix) );
			tween.end   = _unmatrix( end.match(rmatrix) );
			return tween;
		}

		//标准处理
		//处理样式。[,+/-,值,单位]
		target = parseFloat(  getStyle(node, prop) );
		start  = rfxnum.exec( getStyle(node, prop) );
		end    = rfxnum.exec( endValue );
		unit   = end && end[ 3 ];

		var scale  = 1;
		//下面代码用于转化单位
		//参考jquery操作
		var maxIterations = 20;
		if (start && start[3] !== unit) {
			unit = unit || start[3];
			end = end || [];
			start = +target || 1;

			do {
				// If previous iteration zeroed out, double until we get *something*
				// Use a string for doubling factor so we don't accidentally see scale as unchanged below
				scale = scale || ".5";

				// Adjust and apply
				start = start / scale;
				setStyle(node, prop, start + unit);

				// Update scale, tolerating zero or NaN from tween.cur()
				// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
			} while (scale !== (scale = getStyle(node, prop) / target) && scale !== 1 && --maxIterations);
		}
		if (end) {
			start = tween.start = +start || +target || 0;
			tween.unit = unit;
			//处理 +/- 开头
			tween.end = end[1] ? start + (end[1] + 1) * end[2] : +end[2];
		}
		return tween;
	}

	/*
	 *  对于动画过程监听实现。使用when的notify做过程监听
	 *  @method _animate
	 *  @private
	 */
	function _animate (duration) {
		var deferred = when.defer();		
		var control  = _tick(duration, function(pst){
			deferred.notify(pst);
			if(pst == 1){
				deferred.resolve(pst);
			}
		});
		return {
			promise: deferred.promise,
			stop: control.stop,
			goOn: control.goOn
		};
	}

	/*
	 *  @method animate
	 *  @public
	 *  @node     {Node}     动画节点
	 *  @prop     {Object}   结束状态列表 {height:50px, left: 50px}
	 *  @duration {Number}   动画过度效果的过程时长，单位毫秒 可缺损 默认 1000 
	 *  @easing   {String}   动画过度效果名词  可缺损 默认 'linaer'
	 *  @callback {Function} 动画结束回调函数
	 */
	function animate (node, prop, duration, easing, callback) {
		var start = {};
		var end   = {};
		var unit  = {};
		var i;
		var formatedProp;

		//参数适配
		callback = arguments[arguments.length - 1];
		callback = getType(callback) == "function" ? callback : function(){};
		if( getType(duration) != "number" ){
			easing   = duration;
			duration = defaultDuration;
		}
		easing  = easing in AniEsasing ? easing : defaultEasing;

		for(i in prop){
			formatedProp = _formateProp(node, i, prop[i]);
			start[i]     = formatedProp.start;
			end[i]       = formatedProp.end;
			unit[i]      = formatedProp.unit;
		}
		var _ani = _animate(duration);
		_ani.promise.then(callback, function(){}, function(pst){
			_tween (node, easing, pst, start, end, unit);
		});
		return _ani;
	}


	/*
	 *  语法糖。 链式实现动画集合
	 */
	// chainAniControl需要是个队列
	var chainAniControl = {};
	function Chain(promise, key) {
		this.promise = promise;
		this.key     = key;
	}

	Chain.prototype.animate =
	Chain.prototype.then    = function(prop, duration, easing, callback) {
		var thisKey   = this.key;
		var _deferred = when.defer();
		this.promise.then(function(node) {			
			chainAniControl[thisKey] = animate(node, prop, duration, easing, function() {
				callback && callback();
				_deferred.resolve(node);
			});			
		});
		return new Chain(_deferred.promise, thisKey);
	}
	Chain.prototype.stop = function(){
		chainAniControl && 
		chainAniControl[this.key] && 
		chainAniControl[this.key].stop();
	}
	Chain.prototype.goOn = function(){
		chainAniControl && 
		chainAniControl[this.key] && 
		chainAniControl[this.key].goOn();
	}
	Chain.prototype.destory = function(){
		delete chainAniControl[this.key];
	}
	Chain.init = function(node){
		var deferred = when.defer();
		deferred.resolve(node);
		return new Chain(deferred.promise, new Date().getTime().toString() + Math.floor(Math.random() * 10000));
	}

	animate.chain     = Chain.init;
	animate.addEasing = addEasing;
	return animate;
});