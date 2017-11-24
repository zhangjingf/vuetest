/**
 * 最新版
 正则验证
 by:璩小孩
 **/
export default {
    mobile: function(){//手机
        var val = arguments[0];
        if("undefined" === typeof val)return false;
        var reg = /^((1[3-8]{1}[0-9]{1})+\d{8})$/;
        return reg.test(val);
    },
    phone: function(){//电话
        var val = arguments[0];
        if("undefined" === typeof val)return false;
        var reg = /^(((0\d{2,3}-)+\d{7,8})|((0\d{2,3})+\d{7,8})|(\+\d{6,20})|(\d{6,20})|((0\d{2,3}-)+\d{7,8}-)+\d{1,6})$/;
        return reg.test(val);
    },
    email: function(){//邮箱
        var val = arguments[0];
        if("undefined" === typeof val)return false;
        var reg1 = /@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;//防止输入过长的时候，卡死
        var reg2 = /^([a-zA-Z0-9_-]+[_|\_|\.]?)+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if(reg1.test(val)){
            return reg2.test(val);
        }
        return false;
    },
    code: function(){//邮政编码验证
        var val = arguments[0];
        if("undefined" === typeof val)return false;
        var reg = /^(([1-9]{1})\d{5})$/;
        return reg.test(val);
    },
    number: function(){//只能输入数字
        var val = arguments[0];
        if("undefined" === typeof val)return false;
        var reg = /^(-?\d+)$/;
        return reg.test(val);
    },
    double: function(){//小数或整数
        var val = arguments[0];
        if("undefined" === typeof val)return false;
        var reg = /^(-?\d+)\.?\d*$/;
        return reg.test(val);
    },
    url: function(){//网址
        var val = arguments[0];
        if("undefined" === typeof val)return false;
        var reg = /^((https|http|ftp|rtsp|mms)?:\/\/)+[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
        return reg.test(val);
    },
    chinese: function(){//验证中文
        var val = arguments[0];
        if("undefined" === typeof val)return false;
        var reg = /([\u4E00-\u9FA5]|[\uFE30-\uFFA0])+/gi;
        return reg.test(val);
    }
};