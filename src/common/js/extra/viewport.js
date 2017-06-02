(function() {
      window["__JS_CONFIG"] = {
             "baseUrl": "./js/src",
              //"urlArgs": "__ts=201604181703"
             "urlArgs": "__ts=" + new Date().getTime()
      }

      var style = document.createElement("STYLE");
      var docEl = document.documentElement;
      var header = document.getElementsByTagName("HEAD")[0];
      var viewport = document.createElement("meta");
      var dpr = 0;
      var isAndroid = navigator.appVersion.match(/android/gi);
      var isIPhone = navigator.appVersion.match(/iphone/gi);
      var baseDpr = "devicePixelRatio" in window ? devicePixelRatio : 1;
      var dpr = baseDpr;

      if (isIPhone) {
            // iOS下，对于2和3的屏，用2倍的方案，其余的用1倍方案
            if (devicePixelRatio >= 3 && (!dpr || dpr >= 3)) {
                  dpr = 3;
            } else if (devicePixelRatio >= 2 && (!dpr || dpr >= 2)){
                  dpr = 2;
            } else {
                  dpr = 1;
            }
      } else {
            // 其他设备下，仍旧使用1倍的方案
            dpr = 1;
      }
      //dpr = 1;
//content="width=device-width
      scale = 1 / dpr;
      docEl.setAttribute("data-dpr", dpr);
      docEl.setAttribute("data-device-type", isIPhone ? "iphone" : (isAndroid ? "android" : "other"));
      viewport.name = "viewport";
      viewport.content ="initial-scale=" + scale + ", maximum-scale=" + scale + ", minimum-scale=" + scale + ", user-scalable=no";
      header.appendChild(viewport);
      var width = document.documentElement.clientWidth;
      var height = document.documentElement.clientHeight;

      // 安卓低版本中，screen.availWidth会等于设备宽度乘dpr。
      // 并且，页面没加载完全时，clientWidth的值也有问题。所以需要以下处理
      if (!isIPhone && (screen.availWidth != width)) {
            width = screen.availWidth / baseDpr;
            height = screen.availHeight / baseDpr;
      }

      var portrait = ((Math.min(width, height) / 320) * 10);
      var landscape = ((Math.max(width, height) / 568) * 17.75);
      style.innerHTML = "@media screen and (orientation:portrait) { html { font-size: " + portrait + "px!important; } }\n@media screen and (orientation:landscape) { html { font-size: " + landscape + "px!important; } }";
      header.appendChild(style);

})();