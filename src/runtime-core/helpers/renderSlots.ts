import { createVnode, Fragment } from "../vnode";

export function renderSlots(slots,name,props){
    const slot = slots[name];
    if(slot){
        if(typeof slot === 'function'){
            return createVnode(Fragment, {}, slot(props));
        }
    }
}