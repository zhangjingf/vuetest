/**
 * 获取表单数据
 */
import filterData from '../util/filterData'
import merge from '../json/merge'
import {isObject, isNode, isFunction, isUndefined, isArray} from '../util/dataType'


export default function (node = document.body) {

    nodeList = [].slice.call(node.querySelectorAll("input,select,textarea"));

    function buildData (obj, name, val) {
        if (!name) return;
        let arr = name.split(".");
        if (arr.length > 1) {
            let p = [obj];
            let len = arr.length;
            for(let index = 0; index < len; index ++){
                let item = arr[index];
                if (!p[p.length - 1][item]) {
                    p[p.length - 1][item] = {};
                }
                p.push(p[p.length - 1][item]);
                if (index === len - 2) {
                    setData(p[p.length - 1], arr[len - 1], val);
                    break;
                }
            }
            p = null;
        } else {
            setData(obj, name, val);
        }
    }

    function setData (obj, name, val) {
        if (!isUndefined(obj[name])) {
            if (isArray(obj[name])) {
                obj[name].push(val);
            } else {
                obj[name] = [obj[name]];
                obj[name].push(val);
            }
        } else {
            obj[name] = val;
        }
    }

    function formatChecked (obj) {
        for(let k in obj){
            if(isObject(obj[k])){
                formatChecked(obj[k]);
            }else{
                obj[k] = "";
            }
        }
    }

    return {
        resetForm (element) {
            if(isNode(element)){
                nodeList = [].slice.call(element.querySelectorAll("input,select,textarea"));
            }
        },
        getFormData (filter) {
            let isFn = isFunction(filter), result = {}, set = {};
            nodeList.forEach(item => {
                let type = item.type;
                let name = item.name;
                let value = item.value.trim();
                if(isFn && filter({node: item, type: type, name: name, value: value})) return;
                if (type === "radio" || type === "checkbox") {
                    if(!item.checked){
                        buildData(set, name, "");
                        return;
                    }
                }
                buildData(result, name, value);
            });
            formatChecked(set);
            return merge(true, set, result);
        },
        getNodeMap () {
            let result = {};
            nodeList.forEach(item => {
                let name = item.name;
                buildData(result, name, item);
            });
            return result;
        },
        getNodeByName (name) {
            return filterData(this.getNodeMap(), name);
        }
    }
}