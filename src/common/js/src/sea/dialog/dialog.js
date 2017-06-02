/**
 * 弹框
 */
define(function(require, exports, module) {
	//---------- require begin -------------
	var console = require("lib/io/console");
	var parseNode = require("lib/dom/parseNode");
    var modal = require("lib/layer/modal");
    var merge = require("lib/json/merge");
    var className = require("lib/dom/className");
	var touch = require("touch");
    var getType = require("lib/util/getType");
	//---------- require end -------------
    var defaults = {//默认配置参数
        type : "msg",
        time:0,//关闭时间
        content : "",
        okText : "确定",
        cancelText : "取消",
        btn : [],
        ok : function(){},
        cancel : function(){}
    };

	return function(opts) {
		var that = modal();

		//------------声明各种变量----------------
		var nodeList = null;
		var data = null;
        var node = null;
        var superMethod = {
            init: that.init,
            show: that.show,
            hide: that.hide
        };
        opts = merge(defaults, opts || {});

		//---------------事件定义----------------
		var evtFuncs = {
            ok : function(){
                that.hide("ok");
            },
            cancel : function(){
                that.hide("cancel");
            }
        }

		//---------------子模块定义---------------
		var modInit = function() {}

		//-----------------绑定事件---------------
		var bindEvents = function() {
            if(nodeList.ok){
                touch.on(nodeList.ok,"tap",evtFuncs.ok);
            }
            if(nodeList.cancel){
                touch.on(nodeList.cancel,"tap",evtFuncs.cancel);
            }
        }

		//-----------------自定义函数-------------
		var custFuncs = {
            getCode : function(len){
                if(len == 1){
                    return '<div class="dialog-items"><span class="q-btn q-ok" node-name="ok">确定</span></div>';
                }else if(len == 2){
                    return '<div class="dialog-items"><span class="q-btn" node-name="cancel">取消</span><span class="q-btn q-ok" node-name="ok">确定</span></div>';
                }
                return '';
            },
            getDialog: function(){
                return node;
            },
            getNodeList: function(){
                return nodeList;
            },
            show: function(handlers){
                handlers = handlers || {};
                superMethod.show.call(that, merge(handlers, {
                    afterAnimate: function() {
                        if(opts.time > 0){
                            setTimeout(function(){
                                try{
                                    that.hide("auto");
                                    getType(opts.ok) == "function" && opts.ok();
                                }catch(e){
                                    console.error(e);
                                }
                            },opts.time);
                        }
                        handlers.afterAnimate && handlers.afterAnimate();
                    }
                }));
            },
            hide: function(why, extra, handlers) {
                handlers = handlers || {};
                superMethod.hide.call(that, why, extra, merge(handlers, {
                    afterRemove: function() {
                        try{
                            switch(why){
                                case "ok":
                                    getType(opts.ok) == "function" && opts.ok();
                                    break;
                                case "cancel":
                                    getType(opts.ok) == "function" && opts.cancel();
                                    break;
                            }
                        }catch(e){
                            console.error(e);
                        }
                        handlers.afterRemove && handlers.afterRemove();
                    }
                }));
            }
        }

		//-----------------初始化----------------
		var init = function(_data) {
            superMethod.init.call(that, _data);
            node = that.getOuter();
            className.add(node,"m-mobile-dialog");
            switch(opts.type){
                case "load":
                    className.add(node,"mobile-wait");
                    that.getMask().setOpacity(0);
                    //node.innerHTML = '<div class="dialog-wait"><div></div><div></div><div></div><div></div><div></div></div>';
                    node.innerHTML = '<div class="m-loading"><img class="loading" src="./resources/images/loading.gif" alt="loading" /><p node-name="content">加载中，请稍后</p></div>';
                    break;
                case "msg":
                    node.innerHTML = '<div class="dialog-msg">'+opts.content+'</div>';
                    break;
                case "alert":
                    node.innerHTML = '<div class="dialog-content alert">'+opts.content+'</div><div class="dialog-items"><span class="q-btn q-ok" node-name="ok">确定</span></div>';
                    break;
                case "confirm":
                    node.innerHTML = '<div class="dialog-content alert">'+opts.content+'</div><div class="dialog-items"><span class="q-btn" node-name="cancel">取消</span><span class="q-btn q-ok" node-name="ok">确定</span></div>';
                    break;
                case "open":
                    node.innerHTML = '<div class="dialog-content">'+opts.content+'</div>'+custFuncs.getCode(opts.btn.length);
                    break;
            }
			nodeList = parseNode(node);
            if(nodeList.ok){
                nodeList.ok.innerHTML = (opts.type == "open" ? opts.btn[0] : opts.okText);
            }
            if(nodeList.cancel){
                nodeList.cancel.innerHTML = (opts.type == "open" ? opts.btn[1] : opts.cancelText);
            }
			data = _data;

			modInit();
			bindEvents();
		};

		//-----------------暴露各种方法-----------
		that.init = init;
        that.show = custFuncs.show;
        that.hide = custFuncs.hide;
        that.getDialog = custFuncs.getDialog;
        that.getNodeList = custFuncs.getNodeList;

		return that;
	}
});