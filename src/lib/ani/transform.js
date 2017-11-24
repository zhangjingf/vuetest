/*****
 * transform
 */

export default function(timeout, x, y, bool){
    const style = {
        '-webkit-transition':'-webkit-transform '+ timeout +'ms',
        '-webkit-transform':'translate3d('+ x +'px,'+ y +'px, 0)',
        '-webkit-backface-visibility': 'hidden',
        'transition':'transform '+timeout+'ms',
        'transform':'translate3d('+ x +'px,'+ y +'px, 0)'
    };
    if(!bool) return style;
    let code = '';
    for(let s in style){
        code += s + ":" + style[s] + ";";
    }
    return code;
}
