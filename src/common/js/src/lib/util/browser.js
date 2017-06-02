/**
 * 检测浏览器信息 来自STK.js并加入了IE11的检测
 * 是一个对象，保存了浏览器版本信息，检测的值比较多，请在实际应用中用console输出一下查看值或者阅读代码
 * 例子：
 *
 * var browser = require("../util/browser"); // 返回一个对象，可以直接读属性
 * console.log(browser.MOBILE); // 如果是移动端，则值为true
 *
 */
define(function(require, exports, module) {
	var ua = navigator.userAgent.toLowerCase();
	var external = "";
	var core, m, extra, version, os;

	var isMobile = function() {
        var mobile_agents = ["240x320","acer","acoon","acs-","abacho","ahong","airness","alcatel","amoi","android","anywhereyougo.com","applewebkit/525","applewebkit/532","asus","audio","au-mic","avantogo","becker","benq","bilbo","bird","blackberry","blazer","bleu","cdm-","compal","coolpad","danger","dbtel","dopod","elaine","eric","etouch","fly ","fly_","fly-","go.web","goodaccess","gradiente","grundig","haier","hedy","hitachi","htc","huawei","hutchison","inno","ipad","ipaq","ipod","jbrowser","kddi","kgt","kwc","lenovo","lg ","lg2","lg3","lg4","lg5","lg7","lg8","lg9","lg-","lge-","lge9","longcos","maemo","mercator","meridian","micromax","midp","mini","mitsu","mmm","mmp","mobi","mot-","moto","nec-","netfront","newgen","nexian","nf-browser","nintendo","nitro","nokia","nook","novarra","obigo","palm","panasonic","pantech","philips","phone","pg-","playstation","pocket","pt-","qc-","qtek","rover","sagem","sama","samu","sanyo","samsung","sch-","scooter","sec-","sendo","sgh-","sharp","siemens","sie-","softbank","sony","spice","sprint","spv","symbian","tablet","talkabout","tcl-","teleca","telit","tianyu","tim-","toshiba","tsm","up.browser","utec","utstar","verykool","virgin","vk-","voda","voxtel","vx","wap","wellco","wig browser","wii","windows ce","wireless","xda","xde","zte"];

        for (var i = 0; i < mobile_agents.length; i++) {
            if (ua.indexOf(mobile_agents[i]) != -1) {
                return true;
            }
        }

        return false;
	}

	try {
		external = window["external"] || '';
	}catch(ex) {
		external = "";
	}

	var numberify = function(s) {
		var c = 0;
		return parseFloat(s.replace(/\./g, function() {
			return (c++ == 1) ? '' : '.';
		}));
	};

	try{
        if ((/windows|win32/i).test(ua)) {
            os = 'windows';
        } else if ((/macintosh/i).test(ua)) {
            os = 'macintosh';
        } else if ((/rhino/i).test(ua)) {
            os = 'rhino';
        }

		if((m = ua.match(/applewebkit\/([^\s]*)/)) && m[1]){
			core = 'webkit';
			version = numberify(m[1]);
		}else if((m = ua.match(/presto\/([\d.]*)/)) && m[1]){
			core = 'presto';
			version = numberify(m[1]);
		}else if(m = ua.match(/msie\s([^;]*)/)){
			core = 'trident';
			version = 1.0;
			if ((m = ua.match(/trident\/([\d.]*)/)) && m[1]) {
				version = numberify(m[1]);
			}
		} else if (m = ua.match(/trident/)){ // TODO: IE11待测试
			core = 'trident';
			version = 1.0;
			if ((m = ua.match(/trident\.*rv:(\d+)/)) && m[1]) {
				version = numberify(m[1]);
			}
		}else if(/gecko/.test(ua)){
			core = 'gecko';
			version = 1.0;
			if((m = ua.match(/rv:([\d.]*)/)) && m[1]){
				version = numberify(m[1]);
			}
		}

		if(/world/.test(ua)){
			extra = 'world';
		}else if(/360se/.test(ua)){
			extra = '360';
		}else if((/maxthon/.test(ua)) || typeof external.max_version == 'number'){
			extra = 'maxthon';
		}else if(/tencenttraveler\s([\d.]*)/.test(ua)){
			extra = 'tt';
		}else if(/se\s([\d.]*)/.test(ua)){
			extra = 'sogou';
		}
	}catch(e){}

	var ret = {
		'OS':os,
		'CORE':core,
		'Version':version,
		'EXTRA':(extra?extra:false),
		'IE': /msie/.test(ua) || /trident/.test(ua),
		'OPERA': /opera/.test(ua),
		'MOZ': /gecko/.test(ua) && !/(compatible|webkit|trident)/.test(ua),
		'IE5': /msie 5 /.test(ua),
		'IE55': /msie 5.5/.test(ua),
		'IE6': /msie 6/.test(ua),
		'IE7': /msie 7/.test(ua),
		'IE8': /msie 8/.test(ua),
		'IE9': /msie 9/.test(ua),
		'IE10': /msie 10/.test(ua),
		'IE11': /trident.*rv:11/.test(ua),
		'SAFARI': !/chrome\/([\d.]*)/.test(ua) && /\/([\da-f.]*) safari/.test(ua),
		'CHROME': /chrome\/([\d.]*)/.test(ua),
		'IPAD':/\(ipad/i.test(ua),
		'IPHONE':/\(iphone/i.test(ua),
		'ITOUCH':/\(itouch/i.test(ua),
		'MOBILE':isMobile()
	};

	var arr = ["IE5", "IE55", "IE6", "IE7", "IE8", "IE9", "IE10", "IE11", "SAFARI", "OPERA", "MOZ", "CHROME"];
	var type = "OTHER";

	for (var i = 0; i < arr.length; i++) {
		if (ret[arr[i]]) {
			type = arr[i];
			break;
		}
	}

	ret.type = type;

	return ret;
});