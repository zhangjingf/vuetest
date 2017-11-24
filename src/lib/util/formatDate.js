/**
 * 对日期时行格式
 * date可以是一个long类型，也可以是2015-12-15 12:12:12
 * format默认yyyy-MM-dd
 */

 import sNull from '../str/sNull'
 import {isString} from './dataType'

 export default function(date, format = 'yyyy-MM-dd HH:mm:ss'){
    try{
        let reg = /^(\d{4}-\d{1,2}-\d{1,2})(\s\d{1,2}:\d{1,2}(:\d{1,2})?)?/g;
        date = sNull(date);
        let newDate = date;
        if(/^\d+$/.test(date)){
            newDate = new Date();
            var size = date.toString().length;
            if(size == 10){
                date *= 1000;
            }else if(size < 10) return date;
            newDate.setTime(date);
        }else if(isString(date)){
            newDate = new Date(date.match(reg)[0].replace(/\-/g,"/"));
        }

        if(/Invalid|NaN/.test(newDate.toString())){
            return date;
        }

        let hour = newDate.getHours();
        let minute = newDate.getMinutes();
        let o = {
            "M+" : newDate.getMonth()+1,
            "d+" : newDate.getDate(),
            "H+" : hour,
            "h+" : hour > 12 ? hour - 12 : hour,
            "m+" : minute < 10 ? "0"+minute : minute,
            "s+" : newDate.getSeconds(),
            "q+" : Math.floor((newDate.getMonth()+3)/3),
            "S" : newDate.getMilliseconds()
        };
        if(/(y+)/.test(format)){
            format = format.replace(RegExp.$1, (newDate.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for(let k in o){
            if(new RegExp("("+ k +")").test(format)){
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(o[k].toString().length));
            }
        }
        return format;
    }catch(e){
        return date;
    }
 }
