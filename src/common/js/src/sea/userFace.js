/**
 * 用户头像相关
 */
define(function(require, exports, module) {
    var that = {};

    that.getUrlByIndex = function(index, imgPath) {
        var dpr = document.documentElement.getAttribute("data-dpr");
        return (imgPath == null ? "./images" : imgPath) + "/face/" + ((dpr == "3") ? "3x" : "2x") + "/" + index  + ".jpg";
    }

    that.getFaceIndexs = function() {
        var indexs = [];

        for (var i = 0; i < 50; i++) {
            indexs.push(i);
        }

        return indexs;
    }

    return that;
});