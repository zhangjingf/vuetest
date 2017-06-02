/**
 * 虚拟链接，含有指定属性的节点可代替a链接
 *
 * var virtualLink = require("../util/virtualLink");
 * var link = virtualLink("data-href", container);
 * 含有data-href的即为a链接;
 * container可不传，默认为body节点，container也可传选择器，默认选择第一个含有该选择器的节点.
 *
 * 注：拨打电话的链接和a链接一样，写法是"data-href='tel:xxxx'"
 */
define(function (require, exports, module) {
    var compBase = require("../comp/base");
    var that = compBase();

    return function (attrName, container) {
        var touch = require('touch');
        //var webBridge = require('mopon/webBridge');
        var webBridge = require('sea/webBridge');
        var closest = require('lib/dom/closest');
        var getType = require("../util/getType");
        var sizzle = require("../dom/sizzle");
        var isNode = require("../dom/isNode");
        var URL = require("../util/URL");
        var queryToJson = require("../json/queryToJson");
        var jsonToQuery = require("../json/jsonToQuery");
        //var trim = require("../str/trim");

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
            /*var title = node.getAttribute("data-title");
             if (title) {
             param["title"] = trim(title);
             }
             var style = node.getAttribute("data-style");
             if (style) {
             param["style"] = trim(style);
             }*/

            var dataJson = node.dataset;
            /*if (dataJson.url) {
             param = dataJson;
             } else {
             return;
             }*/

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