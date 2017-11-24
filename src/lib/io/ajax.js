/**
 * 实现ajax功能，注意主动调用abort跟断网时请求被中断是完全一样的。
 *
 * 例子：
 *
 * var ajax = require("../io/ajax");
 * ajax({
 *     url: "/api/api.jsp",
 *     timeout: 30000, // 默认 30秒
 *     data: { id: 1 },
 *     method: "post", // 默认是get
 *     type: "json", // 默认是json
 *     success: function(res) { console.log(res); },
 *     error: function(res) { } // 当访问出错，比如网络连接不上、解析内容失败时触发，超时也会触发
 * });
 *
 */

import query from '../json/query'
import merge from '../json/merge'
import {isObject, isFunction, isString, isPromise} from '../util/dataType'

let _options = {
    url: "",
    timeout: 30 * 1000,
    data: null,
    success: function(){},
    error: function(){},
    method: "get",
    type: "json", //"text/json/xml"
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

let _defaults = {
    options: _options,
    response: {
        suc: null,
        err: null
    },
    request: {
        suc: null
    }
};

function response(res, opts, resolve, reject, callback) {
    return function () {
        if (res.readyState === 4) {
            let data = "";
            (isFunction(callback)) && callback();
            if (opts.type === "xml") {
                data = res.responseXML;
            } else if (opts.text === "text") {
                data = res.responseText;
            } else {
                data = res.responseText;
                if (isString(data)) {
                    try {
                        data = JSON.parse(data);
                    } catch(ex) {
                        data = {};
                    }
                } else {
                    data = {};
                }
            }

            if (res.status === 200) {
                res.data = data;
                let suc = isFunction(_defaults.response.suc) ? _defaults.response.suc(res) : data;
                if (isPromise(suc)) {
                    suc.catch(r => {
                        opts.error(r);
                        reject(r);
                    })
                } else {
                    opts.success(suc);
                    resolve(suc);
                }
            } else {
                let status = res.status;
                let result = { res: res, status: status, msg: status === 0 ? "已经中断！" : "请求[" + opts.url + "]失败，状态码为" + status };
                let err = isFunction(_defaults.response.err) ? _defaults.response.err(res) : result;
                if(isPromise(err)) {
                    err.catch(r => {
                        opts.error(r);
                        reject(r);
                    });
                }else{
                    opts.error(result);
                    reject(result);
                }
                console.error(result.msg);
            }
        }
    }
}

function requestTimeout(res, error, reject, timeout) {
    return setTimeout(function() {
        res.abort();
        let result = {res: res, status: res.status, msg: "请求超时！"};
        console.error(result.msg);
        error(result);
        reject(result);
    }, timeout);
}

function ajax(opts) {
    return new Promise((resolve, reject) => {
        let xmlHttp = new XMLHttpRequest(), tid = null;
        opts = merge(true, {}, _defaults.options, opts);
        opts.method = opts.method.toLocaleLowerCase() === "get" ? "get" : "post";

        if(isFunction(_defaults.request.suc)){
            opts = _defaults.request.suc(opts);
        }

        if (opts.method === "get" && isObject(opts.data)) {
            opts.url = query.url(opts.url, opts.data);
        }

        xmlHttp.onreadystatechange = response(xmlHttp, opts, resolve, reject, () => clearTimeout(tid));
        xmlHttp.timeout = opts.timeout;
        xmlHttp.open(opts.method, opts.url, true);

        for(let key in opts.headers){
            xmlHttp.setRequestHeader(key, opts.headers[key]);
        }

        xmlHttp.send(opts.method === "get" ? null : (isString(opts.data) ? opts.data : query.stringify(opts.data)));

        tid = requestTimeout(xmlHttp, opts.error, reject, opts.timeout);
    });
}

ajax.create = function (opts) {
    _defaults.options = merge(true, {}, _options, opts);
    return ajax;
};

ajax.response = {
    use(ful, rej) {
        _defaults.response.suc = ful;
        _defaults.response.err = rej;
    }
};

ajax.request = {
    use(ful) {
        _defaults.request.suc = ful;
    }
};

ajax.get = function (url, data) {
    return ajax({url: url, data: data, method: "get"});
};

ajax.post = function (url, data) {
    return ajax({url: url, data: data, method: "post"});
};

export default ajax;