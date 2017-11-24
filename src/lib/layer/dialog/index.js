/**********
 * 弹框
 * 璩小孩 20170802
 */
import popup from 'lib/layer/popup';
import myDialog from './dialog.vue';
import { bus, getUniqueId, fire } from 'lib/comp/bus';
import {isFunction } from 'lib/util/dataType';

const DialogManager = function (myContent, option = {}) {
    let m_dialog = popup("<my-dialog @close='hideDialog' @click='butClick' :option='option'><my-content ref='content' @close='hideDialog' :option='option'></my-content></my-dialog>", {
        option: {
            showCenter: true,
            autoHide: false,
            overlay: {
                opacity: option.opacity
            },
            animate: {
                name: option.animate
            }
        },
        popup: {
            data () {
                return { option };
            },
            components: {
                myDialog,
                myContent
            },
            methods: {
                butClick (opt) {
                    fire(m_dialog.get(opt.key), opt.item);
                },
                hideDialog () {
                    m_dialog.hide(m_dialog.destroy);
                }
            }
        }
    });

    const child = m_dialog.popup.$refs.content;
    isFunction(child.dialogShow) && bus.$once(m_dialog.get("show"), child.dialogShow);
    isFunction(child.dialogHide) && bus.$once(m_dialog.get("hide"), child.dialogHide);

    return m_dialog;
};

export default DialogManager;