/**
 * 从url传入参数
 *  "Gui": 1,                //是否尊享卡支付
 *  "orderNo": ,                //订单编号
 *  "orderPrice": ,             //订单价格
 *  "payment": payment          //支付真实金额
 *  "orderTime": "20160129135950"  //订单生成时间
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var util = require("sea/utils");
    var ajax = require("lib/io/ajax");
    var showMessage = require("sea/showMessage");
    var modifyGuiPsd = require("sea/dialog/modifyGuiPsd");
    var closest = require("lib/dom/closest");
    var appendQuery = require("lib/str/appendQuery");
    var webBridge = require("sea/webBridge");
    var each = require("lib/util/each");
    var className = require("lib/dom/className");
    var touch = require("touch");
    var loading = require("sea/dialog/loading");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var payType = null;
        var m_modifyGuiPsd = null;
        var cardNo = null;        //尊享卡卡号
        var cardPwd = null;        //尊享卡密码
        var payMobileUrl = null;
        var m_loading = null;

        //---------------事件定义----------------
        var evtFuncs = {
             payType: function (ev) {
                var typeNode = closest(ev.target, "[data-type]", nodeList.payType);
                    payType = parseInt(typeNode.getAttribute("data-type"), 10);
                var iconNode = nodeList.icon;

                 each(iconNode, function (item) {
                     var iconNodeNumber = item.getAttribute("data-icon");
                     if(iconNodeNumber == payType) {
                         if(className.has(item,"select-icon")) {

                             className.remove(item, "select-icon");
                             className.add(item, "selected-icon");
                         }
                     } else {
                         className.remove(item, "selected-icon");
                         className.add(item, "select-icon");
                     }
                 });
                payMobileUrl = typeNode.getAttribute("data-href");
            },

            payOrder: function () {
                if (that.isLock()) {
                    return;
                }

                if (payType == null) {
                    showMessage("请先选择支付方式");
                    return;
                }
                if (opts["gui"] == 1) {
                    var opt = {
                        "title": "尊享卡支付",
                        "OKText": "确定",
                        "cancelText": "取消",
                        "OK": function () {
                            cardPwd = m_modifyGuiPsd.getInputMsg();
                            cardNo = opts["guicardNo"];
                            if (cardPwd.length <= 0) {
                                showMessage("卡密码不能为空，请重新输入");
                                return;
                            }
                            m_modifyGuiPsd.hide();
                            switch (payType) {
                                case 1:
                                    custFuncs.payForBank("ALIPAY4", "ALIPAY");
                                    break;
                                case 2:
                                    custFuncs.payForBank("WEIXIN7_AP", "WEIXIN7_AP");
                                    break;
                                case 3:
                                    custFuncs.payForBank("ICBC", "ICBC_05");
                                    break;
                                case 4:
                                    custFuncs.payForBank("SPDB", "SPDB_05");
                                    break;
                                case 5:
                                    custFuncs.payForBank("CCB7", "CCB7_05");
                                    break;
                                case 7:
                                    custFuncs.payForApplePay("ICBC_IOS|I_IOS_V2", "ICBC_IOS|I_IOS_V2");
                                    break;
                                default:
                                    return;
                            }
                        },
                        "cancel": function () {
                        }
                    };
                    m_modifyGuiPsd = modifyGuiPsd(opt);
                    m_modifyGuiPsd.init();
                    m_modifyGuiPsd.show();
                    that.unLock();
                    return;
                }
                switch (payType) {
                    case 1:
                        custFuncs.payForBank("ALIPAY4", "ALIPAY");
                        break;
                    case 2:
                        custFuncs.payForBank("WEIXIN7_AP", "WEIXIN7_AP");
                        break;
                    case 3:
                        custFuncs.payForBank("ICBC", "ICBC_05");
                        break;
                    case 4:
                        custFuncs.payForBank("SPDB", "SPDB_05");
                        break;
                    case 5:
                        custFuncs.payForBank("CCB7", "CCB7_05");
                        break;
                    case 6:
                        webBridge.openUrl(payMobileUrl+"&nowPage=mobile");
                        break;
                    case 7:
                        custFuncs.payForApplePay("ICBC_IOS|I_IOS_V2", "ICBC_IOS|I_IOS_V2");
                        break;
                    default:
                        return;
                }
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_loading = loading();
            m_loading.init();
            m_loading.keepMiddle();
        };

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.payType, "tap", "[data-type]", evtFuncs.payType);
            touch.on(nodeList.payOrder, "tap", evtFuncs.payOrder);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            initView: function () {
                util.countDown(nodeList.count, opts["orderTime"], 30 * 60);
            },
            /*订单网银支付*/
            payForBank: function (channelType, bankNo) {
                if (that.isLock()) {
                    return;
                }
                /*
                 *ALIPAY4	            ALIPAY		支付宝
                 *CCB7		CCB7_05	建设银行
                 *ICBC		ICBC_05		工商银行H5
                 *SPDB		SPDB_05	浦发银行
                 *CMCC_C	CMCC_C03	移动支付
                 *WEIXIN7_AP	WEIXIN7_AP	微信支付
                 */
                if (opts["gui"] == "1") {

                    var param = {
                        "bankNo": bankNo,
                        "channelType": channelType,
                        "orderNo": opts["orderNo"],
                        "orderPrice": opts["payment"],
                        //"payment": opts.payment,
                        "cardNo": cardNo,
                        "cardPwd": cardPwd
                    };
                }
                else {
                    var param = {
                        "bankNo": bankNo,
                        "channelType": channelType,
                        "orderNo": opts["orderNo"],
                        "orderPrice": opts["payment"]
                       // "payment": opts.payment
                    };
                }

                that.lock();
                m_loading.show();
                ajax({
                    "url": opts["pageInt"]["payOrder"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        that.unLock();
                        if (res["status"] != 1) {
                            m_loading.hide();
                            showMessage(res["msg"]);
                            return;
                        }
                        if(res["data"]["payDone"]==1 || res["data"]["payDone"] == "1") {
                            m_loading.hide();
                            webBridge.openUrl(res["data"]["url"]);
                            return;
                        }
                        m_loading.hide();
                        webBridge.launchAppPay(res,
                            function (res) {
                                if(res["payResult"]=="0" || res["payResult"]=="9000") {
                                    webBridge.openUrl(opts.pageInt['payResult']+'&orderno='+ opts["orderNo"]);
                                } else {
                                    custFuncs.checkOrderStatus();
                                }
                                m_loading.hide();
                            }
                        )

                    },
                    "onError": function (req) {
                        that.unLock();
                        m_loading.hide();
                        console.error("网络连接失败:" + req.msg);
                    }
                })
            },
            payForApplePay: function (channelType, bankNo) {
              webBridge.launchAppPay({
                  "data": {
                      "payment": opts["payment"],
                      "bankNo": bankNo
                  }
              },function(res){
                  var applePayParam = {
                      'channelType':channelType,
                      'bankNo':bankNo,
                      "orderNo": opts["orderNo"],
                      "orderPrice": opts["payment"],
                      "extendInfo": JSON.stringify(res)
                  };
                  if(opts["gui"] == "1") {
                      applePayParam.cardNo= cardNo;
                      applePayParam.cardPwd= cardPwd;
                  }
                  if(that.isLock()) {
                      return;
                  }
                  that.lock();
                  m_loading.show();
                  ajax({
                      "url": opts["pageInt"]["payOrder"],
                      "method": "post",
                      "data": applePayParam,
                      "onSuccess": function (res) {
                          that.unLock();
                          m_loading.hide();
                          if (res["status"] != 1) {
                              m_loading.hide();
                              showMessage(res["msg"]);
                              return;
                          }
                          webBridge.tellAppAppleSuccess({"result": res},function(res){
                              if (res["payResult"] == "1") {
                                  webBridge.openUrl(opts.pageInt['payResult'] + '&orderno=' + opts["orderNo"]+'&from=applePay&payment='+res["payment"]);
                              } else {
                                  custFuncs.checkOrderStatus({"applePay":true,"payment":res["payment"]});
                              }
                          });
                       /*   if(res["data"]["payDone"]==1 || res["data"]["payDone"] == "1") {
                              m_loading.hide();
                              webBridge.openUrl(res["data"]["url"]);
                              return;
                          }*/
                      },
                      "onError": function (req) {
                          that.unLock();
                          m_loading.hide();
                          console.error("网络连接失败:" + req.msg);
                      }
                  })
              })
            },
            /*检测订单状态*/
            checkOrderStatus: function (type) {
                var param = {
                    "orderNo": opts["orderNo"]
                };
                ajax({
                    "url": opts["pageInt"]["checkOrderStatus"],
                    "method": "post",
                    "data": param,
                    "onSuccess": function (res) {
                        m_loading.hide();
                        if (res["status"] != 1) {
                            showMessage(res["msg"]);
                            return;
                        }
                        if(res["data"]["orders"][0]["payStatus"] == "3") {
                            if(type=='applePay') {
                                webBridge.openUrl(opts["pageInt"]["payResult"]+'&from=applePay&orderno='+res["data"]["orders"][0]["orderNo"]+'&payment='+opts["payment"]);
                            } else {
                                webBridge.openUrl(opts["pageInt"]["payResult"]+'&orderno='+res["data"]["orders"][0]["orderNo"]);
                            }

                        }
                    },
                    "onError": function (req) {
                        console.error("网络连接失败:" + req.status);
                    }
                })
            }

        }

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            modInit();
            bindEvents();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.initView = custFuncs.initView;

        return that;
    }
});