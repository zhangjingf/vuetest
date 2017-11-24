/**
 * URL的解析和合成，注意：该设计有缺陷，不支持username:userpass，不过一般都用不上
 *
 * import URL from "../util/URL";
 * var urlObj = URL.parse("http://www.baidu.com:8080/index.html?p=1#link1");
 * 得到：
 * {
 *     hash: "link1",
 *     host: "www.baidu.com",
 *     path: "/index.html",
 *     port: "8080",
 *     query: "p=1",
 *     scheme: "http:",
 *     slash: "//",
 *     url: "http://www.baidu.com:8080/index.html?p=1#link1"
 * }
 */
import sNull from '../str/sNull'
import query from '../json/query'

export default {
    parse (url = location.herf) {
        let link = document.createElement("A");
        link.href = url;

        let result = {
            "url": url,
            "scheme": link.protocol,
            "host": link.host,
            "port": link.port,
            "path": link.pathname,
            "query": sNull(link.search).substr(1),
            "hash": sNull(link.hash).substr(1),
            "queryJson": query.parse(this.query),
            hashJson: query.parse(this.hash)
        }

        return result;
    },
    build: function(url) {
        return url.scheme + "//" + url.host + (url.port != "" ? ":" + url.port : "") + url.path + (url.query != "" ? "?" + url.query : "") + (url.hash != "" ? "#" + url.hash : "");
    }
}