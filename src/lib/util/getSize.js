/********
 * 获取元素的宽高
 * @param element
 * @returns {{width: number, height: number}}
 * 璩小孩：20170803
 */
import getStyle from './getStyle'

export default function(element){
    let disType = 0, visType = 0;
    if(element.style.display === "none"){
        element.style.display = "block";
        disType = 1;
    }else if(getStyle(element, "display") === "none"){
        element.style.display = "block";
        disType = 2;
    }

    if(getStyle(element, "visibility") !== "hidden" && disType > 0){
        element.style.visibility = "hidden";
        visType = 1;
    }

    const width = element.offsetWidth;
    const height = element.offsetHeight;

    if(disType === 1){
        element.style.display = "none";
    }else if(disType === 2){
        element.style.removeProperty("display");
    }

    if(visType === 1){
        element.style.removeProperty("visibility");
    }

    return { width: width, height: height };
};