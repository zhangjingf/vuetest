(function waveSnow () {

	var img = [];
	var at = 0;
	var pbd = document.querySelector(".pbd");
	for (var i = 0; i < 4; i++) {
		img[i] = document.createElement("IMG");
		img[i].src = "./images/Christmas/snow.png";
		img[i].className = "hidden imgSnow"+i;
		pbd.appendChild(img[i]);
	}


	var nodeBody = document.querySelector("body");
	//transition = "all 6s linear";//transition: property duration timing-function delay;
	//tickets[ar[at]].style.cssText = "-webkit-transition:" + transition + ";transition:" + transition + ";";
	//img.style.cssText = "-webkit-transition:" + transition + ";transition:" + transition + ";left:"+ (1*4.8) +"rem !important;";
	
	var setInt = setInterval(function () {

		if (at == 4) {
			clearInterval(setInt);
			return;
		}
		img[at].className = "imgSnow"+at;
		setTimeout((function(t) {
			return function() {
				pbd.removeChild(img[t]);
				if (t == 3) {
					waveSnow();
				}
			};
		})(at),4000)

		img[at].style.cssText = "-webkit-transition:all 6s linear;transition:all 6s linear;";
		if (at%2 == 0) {
			var r = nodeBody.offsetHeight;
			img[at].style.WebkitTransform = "rotate(360deg)";
			img[at].style.transform = "rotate(360deg)";
			//img[at].style.top = nodeBody.offsetHeight + "px";
			img[at].style.left = nodeBody.offsetWidth + "px";

			img[at].style.top = nodeBody.offsetHeight + "px";
			if (nodeBody.offsetHeight >= 1136) {
				img[at].style.top = "1136px";
			}

		}
		if (at%2 == 1) {
			var r = nodeBody.offsetHeight;
			img[at].style.WebkitTransform = "rotate(720deg)";
			img[at].style.transform = "rotate(720deg)";
			img[at].style.right = nodeBody.offsetWidth + "px";
			
			img[at].style.top = nodeBody.offsetHeight + "px";
			if (nodeBody.offsetHeight >= 1136) {
				img[at].style.top = "1136px";
			}
		}
		at ++;
	}, 800)


})();