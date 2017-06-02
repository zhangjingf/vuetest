/**
 *
 *
 *
 */
define(function (require, exports, module) {
    //---------- require begin -------------
    var html2canvas = require("sea/designCover/html2canvas");
    var console = require("lib/io/console");
    var compBase = require("lib/comp/base");
    var parseNode = require("lib/dom/parseNode");
    var touch = require("touch");
    var each = require("lib/util/each");
    var toast = require("sea/toast");
    var webBridge = require("sea/webBridge");
    var showMessage = require("sea/showMessage");
    var closest = require("lib/dom/closest");
    var loading = require("sea/dialog/loading");
    //---------- require end -------------

    return function (node, opts) {
        var that = compBase();

        //------------声明各种变量----------------
        var nodeList = null;
        var data = null;
        var dx, dy;
        var styleChangeIndex = 0;
        var m_saving = null;
        var base64String = null;

        //---------------事件定义----------------
        var evtFuncs = {
            dragTxt: function (ev) {
                ev.originEvent.preventDefault();
                ev.preventDefault();
                dx = dx || 0;
                dy = dy || 0;
                var offx = dx + ev.x;
                var offy = dy + ev.y;
                if (offx > 0 && offx < (nodeList.cover.offsetWidth - ev.target.offsetWidth)) {
                    nodeList.text.style.left = offx + 'px';
                }
                if (offy > 0 && offy < (nodeList.cover.offsetHeight - ev.target.offsetHeight)) {
                    nodeList.text.style.top = offy + 'px';
                }
            },
            dragEnd: function (ev) {
                dx += ev.x;
                dy += ev.y;
            },
            changeStyle: function (ev) {
                var activeNode = closest(ev.target, "[data-type]", nodeList.active);
                var type = parseInt(activeNode.getAttribute("data-type"));
                switch (type) {
                    case 1:
                        if (activeNode.classList.contains("white")) {
                            activeNode.classList.remove("white");
                            activeNode.classList.add("black");
                            nodeList.textarea.style.color = '#000';
                        } else {
                            activeNode.classList.remove("black");
                            activeNode.classList.add("white");
                            nodeList.textarea.style.color = '#fff';
                        }
                        break;
                    case 2:
                        if (activeNode.classList.toggle("small")) {
                            nodeList.textarea.style.fontSize = '1.6rem';
                        } else {
                            nodeList.textarea.style.fontSize = '1.8rem';
                        }
                        break;
                    case 3:
                        var _arr = ['center', 'right', 'left'];
                        styleChangeIndex += 1;
                        if (styleChangeIndex < _arr.length) {
                            activeNode.classList.remove('center', 'right', 'left');
                            activeNode.classList.add(_arr[styleChangeIndex]);
                            nodeList.textarea.style.textAlign = _arr[styleChangeIndex];
                        } else {
                            activeNode.classList.remove('center', 'right', 'left');
                            activeNode.classList.add(_arr[styleChangeIndex % 3]);
                            nodeList.textarea.style.textAlign = _arr[styleChangeIndex % 3];
                        }
                        break;
                    default:
                        console.log('未定义');
                        return;

                }

            },
            changeWords: function (ev) {
                var lists = nodeList.wordsList.querySelectorAll(".lists");
                var wordsNode = closest(ev.target, ".lists", nodeList.wordsList);
                each(lists, function (item) {
                    item.firstElementChild.classList.remove("active")
                })
                wordsNode.firstElementChild.classList.add("active");
                nodeList.textarea.value = wordsNode.lastElementChild.innerHTML;
            }
        }

        //---------------子模块定义---------------
        var modInit = function () {
            m_saving = loading('保存中，请稍后');
            m_saving.init();
            m_saving.keepMiddle();
        }

        //-----------------绑定事件---------------
        var bindEvents = function () {
            touch.on(nodeList.text, "drag", evtFuncs.dragTxt);
            touch.on(nodeList.text, "dragend", evtFuncs.dragEnd);
            touch.on(nodeList.active, "tap", ">div", evtFuncs.changeStyle);
            touch.on(nodeList.wordsList, "tap", ">div", evtFuncs.changeWords)
        }

        //-----------------自定义函数-------------
        var custFuncs = {
            saveImg: function () {
                nodeList.active.style.zIndex = '-1';
                nodeList.text.classList.remove("addTxtBg");
                window.html2canvas(nodeList.cover, {
                    onrendered: function (canvas) {
                        base64String = canvas.toDataURL("image/png", 1);
                        m_saving.show();
                        webBridge.saveImageToPhotos({
                            "base64String": base64String
                        }, function (res) {
                            m_saving.hide();
                            toast('海报以保存至您的相册');
                            that.fire("shareImg", {'flg': true});
                        })
                    }/*,
                    width: nodeList.cover.offsetWidth * parseInt(document.documentElement.getAttribute("data-dpr")),
                    height: nodeList.cover.offsetHeight * parseInt(document.documentElement.getAttribute("data-dpr"))*/
                });
            },
            shareToWeiXin: function (type) {
                webBridge.shareBigImageToWeiXin({"type": type, "base64String": base64String}, function (res) {
                    toast(res.msg);
                })
            },
            shareImg: function (flg) {
                if (flg) {
                    touch.off(nodeList.text, "drag", evtFuncs.dragTxt);
                    nodeList.designCoverList.style.display = 'none';
                    node.style.backgroundColor = "#000";
                    nodeList.active.style.zIndex = '-1';
                } else {
                    touch.on(nodeList.text, "drag", evtFuncs.dragTxt);
                    node.style.backgroundColor = "#f0f0f0";
                    nodeList.designCoverList.style.display = '';
                    nodeList.active.style.zIndex = '10';
                    nodeList.text.classList.add("addTxtBg");
                }
            },
            setTextBoxPosition: function () {
               dx = (nodeList.cover.offsetWidth - nodeList.text.offsetWidth)/2;
               dy = (nodeList.cover.offsetHeight - nodeList.text.offsetHeight)/2;

               nodeList.text.style.cssText = 'left:'+dx +'px;top:'+ dy +'px;z-index:5';
            }//,
            //initView: function () {
            //    //nodeList.bgImg.src = window.localStorage.getItem("designCoverImgUrl");
            //    ajax({
            //        url: opts.getImgBase64 + '&imgUrl=' +window.localStorage.getItem("designCoverImgUrl"),
            //        data: {id: 1},
            //        method: "post",
            //        type: "json",
            //        onSuccess: function (res) {
            //            if(res.status != 1) {
            //                console.log(res.msg);
            //                return;
            //            }
            //            //nodeList.bgImg.src = 'data:image/png;base64,' + res.data
            //        },
            //        onError: function (req) {
            //            console.log('网络错误' + req.msg);
            //        }
            //    });
            //}
        }

        //-----------------初始化----------------
        var init = function (_data) {
            nodeList = parseNode(node);
            data = _data;

            modInit();
            bindEvents();
            custFuncs.setTextBoxPosition();
            //custFuncs.initView();
        }

        //-----------------暴露各种方法-----------
        that.init = init;
        that.saveImg = custFuncs.saveImg;
        that.shareToWeiXin = custFuncs.shareToWeiXin;
        that.shareImg = custFuncs.shareImg;

        return that;
    }
});