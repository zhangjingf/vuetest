/**
 * 首页动画
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var queryToJson = require("lib/json/queryToJson");
    var appendQuery = require("lib/str/appendQuery");
    var trim = require("lib/str/trim");
    var config = require("sea/config");
    var touch = require("touch");
    var swiper = require("swiper");
    var ajax = require("lib/io/ajax");
    var each = require("lib/util/each");
    var indexSignDialog = require("sea/dialog/indexSignDialog");
    var indexNewDialog = require("sea/dialog/indexNewDialog");
    var indexActiveDialog = require("sea/dialog/indexActiveDialog");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var m_swiper = null;
        var flag = true;

        var m_indexActiveDialog = null;

        //---------------事件定义----------------
        var evtFuncs = {
            "showCommerceDialog": function (ev) {
                //console.log(1230000);
                m_indexActiveDialog.show({"afterAnimate": function () {
                        document.querySelector('body').style.cssText = "overflow: hidden;";
                    }
                });
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_indexActiveDialog = indexActiveDialog(null, opts);
            /*m_indexActiveDialog = indexActiveDialog(null, opts);
            m_indexActiveDialog.init();
            m_indexActiveDialog.getMask().setMaskOpacityStyle(0.6);
            m_indexActiveDialog.show();*/
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            m_indexActiveDialog.bind("showCommerceDialog", evtFuncs.showCommerceDialog);
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            initSwiper: function () {
                m_swiper = new swiper(".index-swiper", {
                    "loop": true,
                    "autoplay": 3000,
                    "speed": 1000,
                    "autoplayDisableOnInteraction": false,
                    "paginationClickable": true,
                    "lazyLoading": true,
                    "lazyLoadingInPrevNext": true,
                    "pagination": '.swiper-point',
                    //"touchAngle": 10,
                    //"longSwipes":true,
                    "touchMoveStopPropagation": false,
                    observer: true, //修改swiper自己或子元素时，自动初始化swiper
                    observeParents: true  //修改swiper的父元素时，自动初始化swiper
                });
            },
            getFlashSwiper: function () {
                return m_swiper;
            },
            updateLink: function () {
                var panel = nodeList.slideList;
                var panels = Array.prototype.slice.call(panel.querySelectorAll("[data-url]"), 0);
                var link = document.createElement("a");
                var search = null;
                var dataAdList = null;
                var advPicUrl = null;
                var param = null;
                panels.forEach(function (item) {
                    link.href = item.getAttribute("data-url");
                    search = queryToJson(link.search.substr(1));
                    /*console.log(search);
                     console.log(search.dataAdList);
                     console.log(decodeURIComponent(search.dataAdList));
                     dataAdList = JSON.parse(decodeURIComponent(search.dataAdList));*/

                    dataAdList = JSON.parse(search.dataAdList);

                    if (dataAdList.advPicUrl == "") {
                        /*item.setAttribute("data-url", appendQuery(item.getAttribute('data-url'), {
                         "title": "",
                         "style": "5"
                         }));*/
                        if (dataAdList.adUrl == "") {
                            item.setAttribute("data-url", appendQuery(item.getAttribute('data-url'), {
                                "title": "loading...",
                                "style": "0"
                            }));
                        } else {
                            link.href = decodeURIComponent(dataAdList.adUrl);

                            search = queryToJson(link.search.substr(1));
                            if (!!config["r=" + search.r]) {
                                param = config[trim("r=" + search.r)];
                            } else {
                                param = {
                                    "title": "loading...",
                                    "style": "0"
                                };
                            }
                            item.setAttribute("data-url", appendQuery(item.getAttribute('data-url'), param));
                        }

                        return;
                    }

                    link.href = decodeURIComponent(dataAdList.advPicUrl);
                    if (link.search == "") {
                        item.setAttribute("data-url", appendQuery(item.getAttribute('data-url'), {
                            "title": "loading...",
                            "style": "0"
                        }));

                        return;
                    }

                    search = queryToJson(link.search.substr(1));
                    if (!!config["r=" + search.r]) {
                        param = config[trim("r=" + search.r)];
                    } else {
                        param = {
                            "title": "loading...",
                            "style": "0"
                        };
                    }

                    item.setAttribute("data-url", appendQuery(item.getAttribute('data-url'), param));
                });
            },
            isSigin: function () {
                if (that.isLock()) {
                    return;
                }
                that.lock();
                ajax({
                    "url": opts["backbox"],
                    "method": "post",
                    "data": {},
                    "onSuccess": function (res) {
                        console.log(res);
                        that.unLock();
                        function signUser (item) {
                            var signDialog = indexSignDialog(null, {
                                "time": res["data"]["time"],
                                'url': item["url"]
                            });
                            signDialog.init();
                            signDialog.show({"afterAnimate": function () {
                                    document.querySelector('body').style.cssText = "overflow: hidden;";
                                }
                            });
                        };
                        
                        function newUser (item) {
                            var newDialog = indexNewDialog(null, {
                                'url': item["url"]
                            });
                            newDialog.init();
                            newDialog.show({
                                "afterAnimate": function () {
                                    document.querySelector('body').style.cssText = "overflow: hidden;";
                                }
                            });
                        };

                        function adDialog (item) {
                            //m_indexActiveDialog = indexActiveDialog(null, opts);
                            m_indexActiveDialog.init({"imgUrl": item.img, "jumpUrl": item.url});
                            m_indexActiveDialog.getMask().setMaskOpacityStyle(0.6);
                            // m_indexActiveDialog.show({"afterAnimate": function () {
                            //         document.querySelector('body').style.cssText = "overflow: hidden;";
                            //     }
                            // });
                        };
                        //debugger;
                        /*"status":1,
                        "msg":"返回成功",
                        "data":{
                            "box":[
                                {
                                    "url":"https://www.baidu.com/?tn=47018152_dg",
                                    "adTime":"",
                                    "content":"https://www.baidu.com/?tn=47018152_dg",
                                    "img":"http://yx.mopon.cn:8654/Upload/SellerAdvNewPic/bingchuan-2.jpg",
                                    "isLogin":1,
                                    "sort":2
                                },
                                {
                                    "url":"https://www.baidu.com/?tn=47018152_dg",
                                    "adTime":"",
                                    "content":"https://www.baidu.com/?tn=47018152_dg",
                                    "img":"http://yx.mopon.cn:8654/Upload/SellerAdvNewPic/未标题-1.jpg",
                                    "isLogin":1,
                                    "sort":2
                                },
                                {
                                    "url":"/xfk/web/index.php?r=signin%2Findex&target=_bank",
                                    "sort":1,
                                    "content":"【签到有礼】 每天签到可获得2积分，连续签到还有额外积分、15元优惠券幸福相送！",
                                    "img":"",
                                    "isLogin":1,
                                    "isPointFlag":0
                                }
                            ],
                            "isLogin":1,
                            "userId":5636785,
                            "isFlag":1,
                            "time":1481097855,
                            "isPointFlag":0
                        }*/
                        function recordClient() {
                            if (!!window.localStorage.clientRecord) {//原来使用这个客户端访问过
                                var clientRecord = window.localStorage.getItem("clientRecord");
                                var ArrClientRecord = clientRecord.split("&");
                                var arrAdId = ArrClientRecord[1].split(",");
                                clientRecord = custFuncs.formateDate(parseInt(ArrClientRecord[0])*1000);

                                var jTime = custFuncs.formateDate(parseInt(res.data.time)*1000);
                                var isChangeDay = custFuncs.isShift(clientRecord, jTime);
                                console.log(isChangeDay);

                                if (isChangeDay) {//跨天      //一天只谈一个商业广告
                                    for (var i = 0; i < res.data.box.length; i++) {

                                        var item = res.data.box[i];
                                        var showAdId = 1;
                                        if (item.sort == 2) {
                                            for (var j=0; j < arrAdId.length; j++) {
                                                //var itemId = arrAdId[j];
                                                if (arrAdId[j] == item.adId) {//所在item的adId 是原来弹过的
                                                    showAdId = 0;
                                                    break;
                                                }
                                            }

                                            if (showAdId) {
                                                window.localStorage.setItem("clientRecord", res.data.time+"&"+ArrClientRecord[1]+","+item.adId);//记录时间和第几个
                                                //弹广告框
                                                adDialog(item);
                                                return;
                                            }
                                            
                                        }
                                        
                                    }    
                                }
                            
                            } else {
                                //window.localStorage.clientRecord  不存在时
                                for (var i = 0; i < res.data.box.length; i++) {
                                    var item = res.data.box[i];
                                    if (item.sort == 2) {
                                        window.localStorage.setItem("clientRecord", res.data.time+"&"+item.adId);//记录时间和第几个

                                        //弹广告框
                                        adDialog(item);
                                        return;
                                    }
                                }
                            }
                        }

                        if (res.status == 0) {
                            return;
                        }
                        if (res.data.isFlag == 0) {//不存在box对象  没东西可弹
                            return;
                        }
                        if (res.data.isLogin == 0 && res.data.isFlag == 1) {//没有登录,存在box对象
                            if (!!window.localStorage.clientRecord) {//原来使用这个客户端访问过
                                var clientRecord = window.localStorage.getItem("clientRecord");
                                var ArrClientRecord = clientRecord.split("&");
                                var arrAdId = ArrClientRecord[1].split(",");
                                clientRecord = custFuncs.formateDate(parseInt(ArrClientRecord[0])*1000);

                                var jTime = custFuncs.formateDate(parseInt(res.data.time)*1000);
                                var isChangeDay = custFuncs.isShift(clientRecord, jTime);
                                console.log(isChangeDay);

                                if (isChangeDay) {//跨天      //一天只谈一个商业广告
                                    for (var i = 0; i < res.data.box.length; i++) {

                                        var item = res.data.box[i];
                                        var showAdId = 1;
                                        if (item.sort == 2) {
                                            for (var j=0; j < arrAdId.length; j++) {
                                                //var itemId = arrAdId[j];
                                                if (arrAdId[j] == item.adId) {//所在item的adId 是原来弹过的
                                                    showAdId = 0;
                                                    break;
                                                }
                                            }

                                            if (showAdId) {
                                                window.localStorage.setItem("clientRecord", res.data.time+"&"+ArrClientRecord[1]+","+item.adId);//记录时间和第几个
                                                //弹广告框
                                                adDialog(item);
                                                return;
                                            }
                                        }
                                        
                                    }    
                                }
    
                            } else {
                                //window.localStorage.clientRecord  不存在时
                                for (var i = 0; i < res.data.box.length; i++) {
                                    var item = res.data.box[i];
                                    if (item.sort == 2) {
                                        window.localStorage.setItem("clientRecord", res.data.time+"&"+item.adId);//记录时间和第几个

                                        //弹广告框
                                        adDialog(item);
                                        return;
                                    }
                                }
                            }

                        } else {//登录
//debugger;
                            if (res.data.isFlag ==1) {//存在box对象
                                if (!!window.localStorage["userRecord123"+res.data.userId+"100"]) {//当前用户是否在本机器登录过
                                    var userRecord = window.localStorage.getItem("userRecord123"+res.data.userId+"100");
                                    var arrUserRecord = userRecord.split("&");
                                    if (arrUserRecord[2] == undefined) {
                                        arrUserRecord[2] = 99999999;
                                    }

                                    var userTimeRecord = custFuncs.formateDate(parseInt(arrUserRecord[0])*1000);
                                    var jTime = custFuncs.formateDate(parseInt(res.data.time)*1000);
                                    var isChangeDay = custFuncs.isShift(userTimeRecord, jTime);//已经跨天


                                    // if (!isChangeDay && arrUserRecord[1] == 1) {//没有跨天 并且弹框过 签到  //arrUserRecord[1] == 1  ???
                                    //     return;
                                    // }

                                    for (var i = 0; i < res.data.box.length; i++) {

                                        var item = res.data.box[i];

                                        if (item.sort == 3) {//新会员
                                            //console.log(arrUserRecord);
                                            var newUserFlag = 1;
                                            if (arrUserRecord[1] == 3) {//已经弹过 新会员
                                                newUserFlag = 0;
                                            }

                                            if (newUserFlag) {
                                                //弹新用户框
                                                newUser(item);
                                                window.localStorage.setItem("userRecord123"+res.data.userId+"100", res.data.time+"&"+item.sort+"&"+arrUserRecord[2]);//5636785&1481097855&3&12,15
                                                return;
                                            }

                                        };

                                        if (item.sort == 2) {//弹出商业广告
                                            var curSort = item.sort;
                                            var adFlag = 1;
                                            //对用户也提示商业广告
                                            if (!isChangeDay) {//没有跨天 记录了2 就不能弹2的情况
                                                // if (arrUserRecord[1] == 2) {//已经弹过 新会员和商业广告
                                                //     adFlag = 0;
                                                // }
                                                var curSortArr = arrUserRecord[1].split(',');
                                                for (var k=0 ; k<curSortArr.length ; k++) {
                                                    if (curSortArr[k] == 2) {//已经弹过商业广告
                                                        adFlag = 0;
                                                    }
                                                }

                                                curSort = arrUserRecord[1]+","+item.sort;
                                            }
                                            
                                            if (adFlag) {// 0 已经弹过无视这段代码
                                                var adIdFlag = 1;
                                                for (var j = 0; j < arrUserRecord[2].split(",").length; j++) {
                                                    if (arrUserRecord[2].split(",")[j] == item.adId) {
                                                        //continue;
                                                        adIdFlag = 0;
                                                        break;
                                                    }
                                                }
                                                if (adIdFlag) {
                                                    //弹广告框
                                                    // adDialog(item);
                                                    window.localStorage.setItem("userRecord123"+res.data.userId+"100", res.data.time+"&"+curSort+"&"+arrUserRecord[2]+","+item.adId);
                                                    recordClient();
                                                    return;
                                                }
                                                
                                            }

                                        };

                                        if (item.sort == 1) {//每日签到弹框
                                            var curSort = item.sort;                                            
                                            if (!isChangeDay) {//没有跨天 记录了2 就不能弹2的情况

                                                // if (arrUserRecord[1] == 1) {//已经弹过 弹过每日签到
                                                //     return;//跳出本次循环
                                                // };
                                                var curSortArr = arrUserRecord[1].split(',');
                                                for (var k=0 ; k<curSortArr.length ; k++) {
                                                    if (curSortArr[k] == 1) {//已经弹过每日签到框
                                                        return;
                                                    }
                                                }

                                                curSort = arrUserRecord[1]+","+item.sort;
                                            }

                                            //弹签到框
                                            signUser(item);
                                            window.localStorage.setItem("userRecord123"+res.data.userId+"100", res.data.time+"&"+curSort+"&"+arrUserRecord[2]);
                                            return;
                                        };
                                    }


                                } else {//不存在userRecord  //新规则下一次都没有弹过框
                                    for (var i = 0; i < res.data.box.length; i++) {
                                        var item = (res.data.box)[i];
                                        if (item.sort == 3) {//新会员

                                            //弹新用户框
                                            newUser(item);
                                            window.localStorage.setItem("userRecord123"+res.data.userId+"100", res.data.time+"&"+item.sort+"&99999999");// 1481097855&3&12,15
                                            return;
                                        };

                                        if (item.sort == 2) {//弹出商业广告
                                            //根据设备弹框
                                            window.localStorage.setItem("userRecord123"+res.data.userId+"100", res.data.time+"&"+item.sort+"&"+item.adId);
                                            recordClient();
                                            return;


                                            //弹广告框   原来的根据用户 进行弹框
                                            // adDialog(item);
                                            // window.localStorage.setItem("userRecord123"+res.data.userId+"100", res.data.time+"&"+item.sort+"&"+item.adId);
                                            // return;
                                        };

                                        if (item.sort == 1) {//每日签到弹框

                                            //弹签到框
                                            signUser(item);
                                            window.localStorage.setItem("userRecord123"+res.data.userId+"100", res.data.time+"&"+item.sort+"&99999999");
                                            return;
                                        }
                                    }

                                }

                            }

                        }

                    },
                    "onError": function (req) {
                        that.unLock();
                        console.error("操作失败，状态码：" + req["status"]);
                    }
                })
            },
            "formateDate": function (stampTime) {
                var date = new Date(parseInt(stampTime));
                var year=date.getFullYear();     
                var month=date.getMonth()+1;     
                var date=date.getDate();     
                //var hour=date.getHours();
                return year+"/"+month+"/"+date;
            },
            "isShift": function (localStorageTime, jTime) {//判断是否跨年跨月跨日
                var arrlst = localStorageTime.split("/");
                var arrjTime = jTime.split("/");
                if (arrlst[2] != arrjTime[2]) {
                    return 1;//跨天
                } else {
                    return 0;
                }

            },
            initView: function () {
                custFuncs.initSwiper();
                custFuncs.updateLink();
                custFuncs.isSigin();
            },
            /**
             * 获得图片的大小
             * @return {[type]} [description]
             */
            // testImgSize: function (src) {
            //     var Img = new Image();
            //     // Img.src = 'http://yx.mopon.cn:8654/Upload/FilmPic/220-172.jpg';
            //     Img.src = src;
            //     Img.setAttribute("node-name", "imgPic");
            //     Img.onload = function () {
            //         console.log(Img.complete);
            //         if (Img.complete) {
            //             console.log(Img.width);
            //             console.log(Img.height);
            //             if (Img.width >= 600) {
            //                 Img.width = 600;
            //             } else if (Img.height >= 840) {
            //                 Img.height = 840;
            //             }
            //             document.body.appendChild(Img);
            //         } 
            //     }
            //     //http://yx.mopon.cn:8654/Upload/FilmPic/220-172.jpg
            // }
        }

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            data = _data;
            modInit();
            bindEvents();
            custFuncs.initView();

            //custFuncs.testImgSize();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.sign = custFuncs.sign;
        that.getFlashSwiper = custFuncs.getFlashSwiper;

        return that;
    }
});