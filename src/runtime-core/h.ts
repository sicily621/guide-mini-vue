import { createVnode } from "./vnode";
export function h(type,props?,children?){
    return createVnode(type,props,children)
}