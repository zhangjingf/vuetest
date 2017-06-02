(function waveBalloon() {

    var img = [];
    var at = 0;
    var pbd = document.querySelector(".pbd");
    //元旦
    img[0] = document.createElement("IMG");
    img[0].src = "./images/newYear/balloonRight.png";
    img[0].className = "imgBalloonRight";
    pbd.appendChild(img[0]);
    //快乐
    img[1] = document.createElement("IMG");
    img[1].src = "./images/newYear/balloonLeft.png";
    img[1].className = "imgBalloonLeft";
    pbd.appendChild(img[1]);

    var nodeBody = document.querySelector("body");

    img[0].style.cssText = "-webkit-transition:all 6s linear;transition:all 6s linear";
    img[1].style.cssText = "-webkit-transition:all 6s linear;transition:all 6s linear";

    var hf = window.screen.height;
    if (navigator.appVersion.match(/iphone/gi)) {
        hf = (window.screen.height)*2;
    }

    setTimeout(function () {
        img[0].style.left = nodeBody.offsetWidth + "px";
        img[0].style.bottom = (hf - 240) + "px";
    },1000);

    setTimeout(function () {
        img[1].style.right = nodeBody.offsetWidth + "px";
        img[1].style.bottom = (hf - 240) + "px";
    },2500);

    setTimeout(function () {
        pbd.removeChild(img[0]);
        pbd.removeChild(img[1]);
    },9000)
})();