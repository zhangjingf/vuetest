/**
 * 为改签提供链接跳转代理
 *
 *
 *
 * 含有data-href的即为a链接;
 * container可不传，默认为body节点，container也可传选择器，默认选择第一个含有该选择器的节点.
 *
 * 为改签提供链接跳转代理-----在当前链接参数基础上追加参数
 */
define(function (require, exports, module) {
    var compBase = require("lib/comp/base");
    var that = compBase();

    return function (attrName, container,addQuery) {
        var touch = require('touch');
        //var webBridge = require('mopon/webBridge');
        var webBridge = require('sea/webBridge');
        var closest = require('lib/dom/closest');
        var getType = require("lib/util/getType");
        var sizzle = require("lib/dom/sizzle");
        var isNode = require("lib/dom/isNode");
        var URL = require("lib/util/URL");
        var queryToJson = require("lib/json/queryToJson");
        var jsonToQuery = require("lib/json/jsonToQuery");
        //var trim = require("lib/str/trim");

        if (container) {
            container = getType(container) == "string" ? sizzle(container)[0] : container;
        }

        if (!isNode(container)) {
            container = document.body;
        }

        var selector = '[' + attrName + ']';
        touch.on(container, 'tap', selector, function (evt) {
            var node = closest(evt.target, selector, container);
            if (!node) {
                return;
            }

            var url = node.getAttribute(attrName);
            var param = {};

            if (url.indexOf("javascript:void(0)") >= 0) {
                return;
            }

            if (url.indexOf('tel') >= 0) {
            //if (url.match(/^tel\:\d+$/)) {
                url = url.replace(/-/g, "");
                var number = url.split(/tel\:/)[1];
                webBridge.makeCall(number);
                return;
            }

            url = URL.parse(url);
            var query = queryToJson(url['query']);
            if(!!addQuery['seatNum']) {
                query["goods"] = addQuery['goods'];
                query["seatNum"] = addQuery['seatNum'];
                query["orderPrice"] = addQuery['orderPrice'];
                query["orderNo"] = addQuery['orderNo'];
                query["integralNum"] = addQuery['integralNum'];
            }
            if (query['_target'] == 'self') {
                delete query['_target'];
                url['query'] = jsonToQuery(query);
                url = URL.build(url);
                webBridge.openUrl(url, 'self', param);
            }
            else {
                delete query['_target'];
                url['query'] = jsonToQuery(query);
                url = URL.build(url);
                webBridge.openUrl(url, 'blank', param);
            }
        })
    }
});