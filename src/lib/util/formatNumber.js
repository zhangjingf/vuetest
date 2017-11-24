/**
 * 格式保留指定小数点
 * val: 要格式的值
 * pos: 要保留小数字
 * bool: 是否强制保留 
 */
export default function(val, pos, bool){
    if (!/^(-?\d+)\.?\d*$/.test(val) || pos <= 0) return val;
    
    const fr = Math.round(val * Math.pow(10, pos)) / Math.pow(10, pos);

    if (!bool) return fr;
    else if (/^(-?\d+)$/.test(val)) {
        return val + "." + new Array(pos + 1).join("0");
    } else {
        if (/^(-?\d+)$/.test(fr)) {
            return fr + "." + new Array(pos + 1).join("0");
        }
        var arr = fr.toString().match(/\.\d+/);
        var len = arr ? arr[0].length - 1 : 0;
        if (len == pos) {
            return fr;
        } else {
            return fr + new Array(pos + 1 - len).join("0");
        }
    }
}