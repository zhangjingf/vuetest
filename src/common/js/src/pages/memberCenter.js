/**
 *
 * 会员中心
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var queryNode = require("lib/dom/queryNode");
    var virtualLink = require("lib/util/virtualLink");
    var header = require("sea/header");
    var levelState = require("sea/levelState");
    var levelPower = require("sea/memberCenter/levelPower");
    var ajax = require("lib/io/ajax");

    var touch = require("touch");
    var toast = require("sea/toast");
    //---------- require end -------------

    var that = compBase();

    //------------声明各种变量----------------
    var nodeList = null;
    var opts = null;
    var m_header = null;
    var m_levelState = null;

    //---------------事件定义----------------
    var evtFuncs = {
        nextPrivilege: function (ev) {
            toast("您所属的等级暂时无<br/>法使用该特权。");
        }
    }

    //---------------子模块定义---------------
    var modInit = function () {
        if (nodeList.header) {
            m_header = header(nodeList.header, opts);
            m_header.init();
        }
        if (nodeList.levelState) {
            m_levelState = levelState(nodeList.levelState, opts);
            m_levelState.init();
        }


        virtualLink('data-url');
    }

    //-----------------绑定事件---------------
    var bindEvents = function () {
        touch.on(nodeList.privilege, "tap", "[node-name='nextPrivilege']", evtFuncs.nextPrivilege);
    }

    //-----------------自定义函数-------------
    var custFuncs = {
        initView: function () {
            if(opts["levelAlert"]) {
                var _levelAlertInfo = JSON.parse(opts["levelAlert"]);
                var _localLevelInfo = localStorage.getItem("levelInfo")?JSON.parse(localStorage.getItem("levelInfo")):{};
                localStorage.setItem("levelInfo", opts["levelAlert"]);
                if (!_localLevelInfo || (_levelAlertInfo.levelKey > 1 && _levelAlertInfo.levelKey > _localLevelInfo.levelKey)) {
                    var _content = '<div class="img"><img src="' + _levelAlertInfo["img"] + '"/></div><div class="content">恭喜升级为<span>' + _levelAlertInfo["key"] + '</span>' + _levelAlertInfo["title"] + '会员</div>'
                    var levelalert = levelPower(_content, {
                        "title": "",
                        "OKText": "查看新特权",
                        "OK": function () {
                        }
                    });
                    levelalert.init();
                    levelalert.show({
                        "afterAnimate": custFuncs.tellServeMsg
                    });
                }
            }
        },
        tellServeMsg: function () {
            ajax({
                "url": opts["tellServeMsg"],
                "method": "post",
                "data": {
                    "jsonNewLevel":opts["levelAlert"]
                },
                "onSuccess": function (res) {
                    that.unLock();
                    if (res["status"] == 0) {
                        return;
                    }
                },
                "onError": function (req) {
                    that.unLock();
                    console.error("操作失败，状态码：" + req["status"]);
                }
            })
        }
    }

    //-----------------初始化----------------
    var init = function (_opts) {
        opts = _opts || {};
        //opts.url =

        nodeList = {
            header: queryNode("#m_header"),
            levelState: queryNode("#m_levelState"),
            privilege: queryNode("#m_privilege")
        }
        modInit();
        bindEvents();
        custFuncs.initView();

    }

    //-----------------暴露各种方法-----------
    that.init = init;

    return that;
});