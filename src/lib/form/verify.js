/**
 * 表单数据验证
 * 支持规则：部分可以并列存在，比如Mobile: true, Email: true，只要符合一项就通过
 * name: {
     * Required:true|{Val: true, Text: "自定义"},//是否必选，如果值为对象，val默认不填为true,text为必填自定义信息
     * Mobile: true|{Val: true, Text: "自定义"}//是否为手机号,可以并列
     * Phone: true|{Val: true, Text: "自定义"}//是否为座机号,可以并列
     * Email: true|{Val: true, Text: "自定义"}//是否为邮箱,可以并列
     * Length: 6|{Val: 6, Text: "自定义"}//输入字数或者数组长度，其中val必填, 支持数组，数字，字符串三种数据，条件为且
     * MaxLength: 6|{Val: 6, Text: "自定义"}//输入最大字数或数据最大长度，其中val必填, 支持数组，数字，字符串三种数据，条件为且
     * MinLength: 6|{Val: 6, Text: "自定义"}//输入最小字数或数据最小长度，其中val必填, 支持数组，数字，字符串三种数据，条件为且
     * Code: true|{Val: true, Text: "自定义"}//是否为邮编,可以并列
     * Boolean: true|{Val: true, Text: "自定义"}//是否为布尔类型,可以并列
     * Array: true|{Val: true, Text: "自定义"}//是否为数据,可以并列
     * Function: true|{Val: true, Text: "自定义"}//是否为函数,可以并列
     * Object: true|{Val: true, Text: "自定义"}//是否为对象,可以并列
     * String: true|{Val: true, Text: "自定义"}//是否为字符串,可以并列
     * Number: true|{Val: true, Text: "自定义"}//是否为整数,可以并列
     * Max: 6|{Val: 6, Text: "自定义"}//如果是数字，不能大于6
     * Min: 6|{Val: 6, Text: "自定义"}//如果是数字，不能小于6
     * Double: true|{Val: true, Text: "自定义"}//是否为整数或小数,可以并列
     * Radix: 2|{Val: 2, Text: "自定义"}//当为小数时，保留几位小数
     * Url: true|{Val: true, Text: "自定义"}//是否为网址,可以并列
     * Chinese: true|{Val: true, Text: "自定义"}//是否为中文,可以并列
     * Reg: /^\d+$/|{Val: /^\d+$/, Text: "自定义"}//自定义正则验证,可以并列
     * Chars: true//是否按字符来计算长度
     * Val: '$name'|{Val: '$name', Text: "自定义"}//验证值是否和name的一致，以$开头，紧接着属性名称
     * Text: "姓名"默认属性名
 * }
 *_filter: function(key, value){}//验证过滤，return true则过滤
 * 使用：
 * var verify = require("pages/common/module/verify");
 * var m_verify = verify();
 * m_verify.bind("verify", function(){});
 * m_verify.add({name: {Required: true, Text: "姓名"}, mobile: {Mobile: true, Text: "手机号"}});
 * m_verify.run({name: "璩", mobile: "1451444aa"});
 */
import {isObject, isUndefined, isBoolean, isFunction, isArray, isString, isNumber} from 'lib/util/dataType'
import regular from './regular'
import filter from 'lib/json/filterData'
import merge from 'lib/json/merge'

const verify = function(name, val){
    const ruleArray = ["Required", "Mobile", "Phone", "Email", "Length", "MaxLength", "MinLength", "Code", "Boolean", "Array", "Function", "Object", "String", "Number", "Max", "Min", "Double", "Radix", "Url", "Chinese", "Reg", "Chars", "Val", "Text"];
    let map = {};

    const classUtil = {
        getText (obj, text){
            return isObject(obj) ? obj.Text : text;
        },
        format (val, bool){
            if(bool) return isUndefined(val) ? true: val;
            return val;
        },
        getVal (obj, bool){
            return isObject(obj) ? this.format(obj.Val, bool) : obj;
        },
        sNull (v){
            return isUndefined(v) || v === null ? "" : v;
        },
        isEntity (v) {
            if(isArray(v) && v.length === 0) return false;
            else if(isObject(v)){
                let suc = false;
                for(let k in v){
                    if(Object.hasOwnProperty(k)){
                        suc = true;
                        break;
                    }
                }
                return suc;
            }
            return true;
        },
        isTrue (obj, value){
            let result = false;
            if(this.getVal(obj, true)) result = true;
            return result && this.sNull(value) !== "";
        },
        getStrLen (s, bool) {
            if(!bool) return s.length;
            let l = 0;
            let a = s.split("");
            for (let i = 0; i < a.length; i++) {
                if (a[i].charCodeAt(0) < 299) {
                    l++;
                } else {
                    l += 2;
                }
            }
            return l;
        },
        removeLength (validate) {
            delete validate.MinLength;
            delete validate.MaxLength;
            delete validate.Length;
        },
        verify (validate, value, defaults){
            const result = {
                statusText: "",
                isVerifySuccess: true
            };
            if (this.getVal(validate.Required, true) && (this.sNull(value) === "" || !this.isEntity(value)) && !defaults) {
                result.statusText = this.getText(validate.Required, validate.Text + "不能为空！");
                result.isVerifySuccess = false;
                return result;
            }
            const reg = this.getVal(validate.Reg);
            if (reg && this.sNull(value) !== "") {
                if (!reg.test(value)) {
                    result.statusText = this.getText(validate.Reg, validate.Text + "格式不正确！");
                    result.isVerifySuccess = false;
                    delete validate.Reg;
                    return this.verify(validate, value, result);
                }
                defaults = null;
            }
            const length = this.getVal(validate.Length);
            if (regular.number(length) && this.sNull(value) !== "") { //验证长度
                if (isArray(value) && value.length !== length){
                    result.statusText = this.getText(validate.Length, validate.Text + "长度不符合！");
                    result.isVerifySuccess = false;
                    return result;
                }else if ((isString(value) || isNumber(value)) && this.getStrLen(value, validate.Chars) !== length) {
                    result.statusText = this.getText(validate.Length, validate.Text + "长度不符合！");
                    result.isVerifySuccess = false;
                    return result;
                }
                defaults = null;
            }
            const minLength = this.getVal(validate.MinLength);
            if (regular.number(minLength) && this.sNull(value) !== "") { //不能小于几位
                if (isArray(value) && value.length < minLength){
                    result.statusText = this.getText(validate.MinLength, validate.Text + "最小长度为" + minLength + "！");
                    result.isVerifySuccess = false;
                    return result;
                }else if ((isString(value) || isNumber(value)) && this.getStrLen(value, validate.Chars) < minLength) {
                    result.statusText = this.getText(validate.MinLength, validate.Text + "不能小于" + minLength + "个字符！");
                    result.isVerifySuccess = false;
                    return result;
                }
                defaults = null;
            }
            const maxLength = this.getVal(validate.MaxLength);
            if (regular.number(maxLength) && this.sNull(value) !== "") { //不能大于几位
                if (isArray(value) && value.length > minLength){
                    result.statusText = this.getText(validate.MaxLength, validate.Text + "最大长度为" + maxLength + "！");
                    result.isVerifySuccess = false;
                    return result;
                }else if ((isString(value) || isNumber(value)) && this.getStrLen(value, validate.Chars) > maxLength) {
                    result.statusText = this.getText(validate.MaxLength, validate.Text + "不能大于" + validate.MaxLength + "个字符！");
                    result.isVerifySuccess = false;
                    return result;
                }
                defaults = null;
            }
            if (this.isTrue(validate.Email, value)) { //邮箱验证
                if (!regular.email(value)) {
                    result.statusText = this.getText(validate.Email, validate.Text + "格式不正确！");
                    result.isVerifySuccess = false;
                    delete validate.Email;
                    this.removeLength(validate);
                    return this.verify(validate, value, result);
                }
                defaults = null;
            }
            if (this.isTrue(validate.Phone, value)) { //电话验证
                if (!regular.phone(value)) {
                    result.statusText = this.getText(validate.Phone, validate.Text + "格式不正确！");
                    result.isVerifySuccess = false;
                    delete validate.Phone;
                    return this.verify(validate, value, result);
                }
                defaults = null;
            }
            if (this.isTrue(validate.Mobile, value)) { //手机验证
                if (!regular.mobile(value)) {
                    result.statusText = this.getText(validate.Mobile, validate.Text + "格式不正确！");
                    result.isVerifySuccess = false;
                    delete validate.Mobile;
                    return this.verify(validate, value, result);
                }
                defaults = null;
            }
            if (this.isTrue(validate.Code, value)) { //邮政编码验证
                if (!regular.code(value)) {
                    result.statusText = this.getText(validate.Code, validate.Text + "格式不正确！");
                    result.isVerifySuccess = false;
                    delete validate.Code;
                    return this.verify(validate, value, result);
                }
                defaults = null;
            }
            if (this.isTrue(validate.Boolean, value)) { //布尔类型验证
                if (!isBoolean(value)) {
                    result.statusText = this.getText(validate.Boolean, validate.Text + "非布尔类型！");
                    result.isVerifySuccess = false;
                    delete validate.Boolean;
                    return this.verify(validate, value, result);
                }
                defaults = null;
            }
            if (this.isTrue(validate.Function, value)) { //函数验证
                if (!isFunction(value)) {
                    result.statusText = this.getText(validate.Function, validate.Text + "非函数！");
                    result.isVerifySuccess = false;
                    delete validate.Function;
                    return this.verify(validate, value, result);
                }
                defaults = null;
            }
            if (this.isTrue(validate.Array, value)) { //数组类型验证
                if (!isArray(value)) {
                    result.statusText = this.getText(validate.Array, validate.Text + "非数组类型！");
                    result.isVerifySuccess = false;
                    delete validate.Array;
                    this.removeLength(validate);
                    return this.verify(validate, value, result);
                }
                defaults = null;
            }
            if (this.isTrue(validate.Object, value)) { //对象类型验证
                if (!isObject(value)) {
                    result.statusText = this.getText(validate.Object, validate.Text + "非对象类型！");
                    result.isVerifySuccess = false;
                    delete validate.Object;
                    return this.verify(validate, value, result);
                }
                defaults = null;
            }
            if (this.isTrue(validate.String, value)) { //字符串类型验证
                if (!isString(value)) {
                    result.statusText = this.getText(validate.String, validate.Text + "非字符串类型！");
                    result.isVerifySuccess = false;
                    delete validate.String;
                    this.removeLength(validate);
                    return verify(validate, value, result);
                }
                defaults = null;
            }
            if (this.isTrue(validate.Double, value)) { //只能输入数字或者小数
                if(!regular.double(value)){
                    result.statusText = this.getText(validate.Double, validate.Text + "只能是小数或整数！");
                    result.isVerifySuccess = false;
                    delete validate.Double;
                    this.removeLength(validate);
                    return this.verify(validate, value, result);
                }
                defaults = null;
            } else if (this.isTrue(validate.Number, value)) { //只能输入数字
                if(!regular.number(value)){
                    result.statusText = this.getText(validate.Number, validate.Text + "只能是整数！");
                    result.isVerifySuccess = false;
                    delete validate.Number;
                    this.removeLength(validate);
                    return this.verify(validate, value, result);
                }
                defaults = null;
            }
            const radix = this.getVal(validate.Radix);
            if (radix && /^(-?\d+)\.\d+$/.test(value)) {
                const len = value.match(/\.\d+/)[0].length - 1;
                if (len > parseInt(radix)) {
                    result.statusText = this.getText(validate.Number, validate.Text + "请保留" + radix + "位小数！");
                    result.isVerifySuccess = false;
                    return result;
                }
                defaults = null;
            }
            const min = this.getVal(validate.Min);
            if (regular.double(validate.Min) && regular.double(value)) {
                if (parseFloat(value) < parseFloat(min)) {
                    result.statusText = this.getText(validate.Min, validate.Text + "不能小于" + min + "！");
                    result.isVerifySuccess = false;
                    return result;
                }
                defaults = null;
            }
            const max = this.getVal(validate.Max);
            if (regular.double(validate.Max) && regular.double(value)) {
                if (parseFloat(value) > parseFloat(max)) {
                    result.statusText = this.getText(validate.Max, validate.Text + "不能大于" + max + "！");
                    result.isVerifySuccess = false;
                    return result;
                }
                defaults = null;
            }
            if (this.isTrue(validate.Url, value)) { //验证网址
                if (!regular.url(value)) {
                    result.statusText = this.getText(validate.Url, validate.Text + "格式不正确！");
                    result.isVerifySuccess = false;
                    delete validate.Url;
                    this.removeLength(validate);
                    return this.verify(validate, value, result);
                }
                defaults = null;
            }
            if (this.isTrue(validate.Chinese, value)) { //验证中文
                if (!regular.chinese(value)) {
                    result.statusText = this.getText(validate.Chinese, validate.Text + "含有非中文！");
                    result.isVerifySuccess = false;
                    delete validate.Chinese;
                    this.removeLength(validate);
                    return this.verify(validate, value, result);
                }
                defaults = null;
            }
            const val = this.getVal(validate.Val);
            if(!isUndefined(val) && !defaults){
                if(val !== value){
                    result.statusText = this.getText(validate.Val, "两次" + validate.Pointer + "输入不一致！");
                    result.isVerifySuccess = false;
                    return result;
                }
            }
            return defaults || result;
        },
        isVerifyObject (obj){
            let bool = false;
            ruleArray.forEach((item) => {
                if(!bool && obj[item]){
                    bool = true;
                    return bool;
                }
            });
            return bool;
        },
        formatFilterName (result, name, val, bool){
            if(isObject(val)){
                if(this.isVerifyObject(val)){
                    result[name] = val;
                }else{
                    for(let k in val){
                        this.formatFilterName(result, name + "." + k, val[k], bool);
                    }
                }
            }else if(bool === true && isArray(val)){
                result[name] = val;
            }else if(/^_/.test(name) && isFunction(val)){
                result[name] = val;
            }
        },
        getVerifyData (obj, bool){
            const result = {};
            for(let key in obj){
                this.formatFilterName(result, key, obj[key], bool);
            }
            return result;
        },
        removeMap (name, val){
            if(isString(name)){
                if(!isUndefined(val)){
                    let r = map[name];
                    if(!isObject(r)) return;
                    if(isObject(val)){
                        for(let k in val){
                            delete r[k];
                        }
                    }else if(isArray(val)){
                        val.forEach((item) => {delete r[item]});
                    }else if(isString(val)){
                        delete r[val];
                    }
                }else{
                    const arr = name.split(".");
                    const len = arr.length;
                    if(len > 1 && ruleArray.indexOf(arr[len - 1]) > -1){
                        const rule = arr[len - 1];
                        arr.splice(len - 1, 1);
                        const k = arr.join(".");
                        if(isObject(map[k])){
                            delete map[k][rule];
                        }
                    }else{
                        delete map[name];
                    }
                }
            }
        }
    };

    const use = {
        run (obj, callback) {
            const _filter = map._filter || function(){};
            let suc = true;
            return new Promise((resolve, reject) => {
                for(let name in map){
                    const validate = map[name];
                    if(!/^_/.test(name)){
                        const value = filter(obj, name);
                        if(_filter(name, value)) return;
                        const valid = Object.assign({}, validate);
                        if(/^\$([\s\S]+?)$/.test(classUtil.getVal(valid.Val))){
                            const val = RegExp.$1;
                            if(isObject(valid.Val)){
                                valid.Val.Val = filter(obj, val);
                            }else{
                                valid.Val = filter(obj, val);
                            }
                            valid.Pointer = map[val].Text;
                        }
                        const result = classUtil.verify(valid, value);
                        if(!result.isVerifySuccess){
                            suc = false;
                            const send = {
                                yes: result.isVerifySuccess,
                                name: name,
                                value: value,
                                result: obj,
                                statusText: result.statusText
                            };
                            reject(send);
                            fire("lib.from.verify", send);
                            isFunction(callback) && callback(send);
                            break;
                        }
                    }
                }

                if(suc){
                    const send = {
                        yes: true,
                        result: obj,
                        statusText: ""
                    };
                    resolve(send);
                    fire("lib.from.verify", send);
                    isFunction(callback) && callback(send);
                }
            });
        },
        add (name, obj){
            if(isObject(name)){
                map = merge(true, map, classUtil.getVerifyData(name));
            }else if(isObject(obj)){
                const nObj = {};
                nObj[name] = obj;
                map = merge(true, map, classUtil.getVerifyData(nObj));
            }
            return this;
        },
        remove (name, obj){
            if(isObject(name)){
                const result = classUtil.getVerifyData(name, true);
                for(let k in result){
                    classUtil.removeMap(k, result[k]);
                }
            }else if(isArray(name)){
                name.forEach((item) => classUtil.removeMap(item));
            }else if(isObject(obj)){
                const nObj = {};
                nObj[name] = obj;
                const result = classUtil.getVerifyData(nObj, true);
                for(let k in result){
                    classUtil.removeMap(k, result[k]);
                }
            }else if(isFunction(name)){
                const result = Object.assign({}, map);
                for(let k in result){
                    const r = name(k, result[k]);
                    if(r === true){
                        delete map[name];
                    }else if(isArray(r) || isObject(r)){
                        classUtil.removeMap(name, r);
                    }
                }
            }else{
                classUtil.removeMap(name, obj);
            }

            return this;
        }
    };

    use.add(name, val);

    return use;
};

export default verify;