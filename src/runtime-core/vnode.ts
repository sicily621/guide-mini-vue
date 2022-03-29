export function createVnode(type,props?,children?){
    const vnode = {
        type,
        props,
        children
    }
    return vnode;
}