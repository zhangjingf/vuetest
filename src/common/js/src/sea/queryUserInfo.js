/**
 * 注意：如果仅是想获取登录态，直接调webBridge的getUserState
 *
 * 获取指定的userId的用户信息，如果不指定userId则是获取当前用户的用户信息
 * handler如下：
 * function handler(user, err) {
 *     if (err) { // 如果err不为空，则user为null
 *         if (err["type"] == "0") {
 *             console.log("未登录"); // err["msg"]就是未登录
 *         } else {
 *             console.log(err["msg"]);
 *         }
 *     } else {
 *         //user就是一个正常的值了
 *     }
 * }
 * user:
 * {
    "userId": "这是额外附加的，接口没返回",
    "username": "",
    "loginCount": "34",
    "imageNo": "0",
    "nickName": "我是不是",
    "birthday": "1900/1/1 0:00:00",
    "areaNo": "",
    "areaName": "",
    "QQ": "",
    "zipCode": "",
    "cityNo": "",
    "sex": "0",
    "MSN": "",
    "realName": "",
    "lastTime": "2016/1/14 12:04:31",
    "identityCard": "",
    "balance": "0.00",
    "point": "0",
    "imageUrl": "",
    "provinceName": "",
    "level": "0",
    "email": "",
    "provinceNo": "",
    "mobile": "18601357823",
    "isMobileValid": "1",
    "AppOnlyFlag": "",
    "createTime": "2016/1/12 15:06:35",
    "cityName": "",
    "address": "",
    "userId": "5636930"
}
 */

define(function(require, exports, module) {
    var when = require("lib/util/when");
    var merge = require("lib/json/merge");
    var webBridge = require("sea/webBridge");
    var showMessage = require("sea/showMessage");

    return function(handler, userId) {
        var user = null;

        var getUserState = function() {
            var defer = when.defer();

            if (userId != null) {
                defer.resolve();
            } else {
                webBridge.getUserState(function(res) {
                    if (res["code"] != 0) {
                        defer.reject({
                            "type": -1,
                            "msg": res["msg"]
                        });
                        return;
                    }

                    if (res["data"]["isLogin"] == "true") {
                        userId = res["data"]["userId"];
                        defer.resolve();
                    } else {
                        defer.reject({
                            "type": 0,
                            "msg": "未登录"
                        });
                    }
                });
            }

            return defer.promise;
        }

        var queryUserInfo = function() {
            var defer = when.defer();

            webBridge.queryUserInfo({
                "userId": userId
            }, function(res) {
                if (res["code"] != "0") {
                    defer.reject({
                        "type": -1,
                        "msg": res["msg"]
                    });
                    return;
                }

                if (res["data"]["head"]["errCode"] != "0") {
                    defer.reject({
                        "type": -1,
                        "msg": res["data"]["head"]["errMsg"]
                    });
                    return;
                }

                user = merge(res["data"]["body"], {
                    "userId": userId
                });

                defer.resolve();
            });

            return defer.promise;
        }

        getUserState()
            .then(queryUserInfo)
            .then(function() {
                try {
                    handler(user);
                }catch(ex) {
                    showMessage("queryUserInfo: " + ex.message);
                }
            })
            .otherwise(function(err) {
                handler(null, {
                    "type": err["type"],
                    "msg": err["msg"]
                });
            });
    }
});