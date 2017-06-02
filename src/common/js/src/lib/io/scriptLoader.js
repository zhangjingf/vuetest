/**
 * 加载一段js
 */

// scriptLoader("/js/test.js")
//     .then(function() {
//         console.log("成功加载");
//     }).otherwise(function() {
//         console.log("加载失败");
//     });


define(function(require, exports, module) {
var when = require("../util/when");
var addEvent = require("../evt/add");
var removeEvent = require("../evt/remove");
    return function(url) {
        var defer = when.defer();
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.charset = "utf-8";
        script.async = true;
        script.defer = true;
        var onLoad = function(ev) {
            removeEvent(script, "load", onLoad);
            removeEvent(script, "error", onError);
            document.body.removeChild(script);

            defer.resolve();
        }

        var onError = function(ev) {
            removeEvent(script, "load", onLoad);
            removeEvent(script, "error", onError);
            document.body.removeChild(script);

            defer.reject();
        }

        addEvent(script, "load", onLoad);
        addEvent(script, "error", onError);

        script.src = url;
        document.body.appendChild(script);

        return defer.promise;
    }
});