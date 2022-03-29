import { isObject } from './../shared/index';
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode,container){
    patch(vnode, container)
}
function patch(vnode, container) {
    if(typeof vnode.type === 'string'){
      processElement(vnode, container);
    }else if (isObject(vnode.type)) {
      processComponent(vnode, container);
    }
    
}
function processElement(vnode, container) {
  mountElement(vnode, container);
}
function mountElement(vnode, container){
  const el = document.createElement(vnode.type);
  const {children} = vnode;
  if(typeof children === 'string'){
    el.textContent = children;
  }else if(Array.isArray(children)){
    mountChildren(vnode, el);
  }
  const {props} = vnode;
  for(const key in props){
    const val = props[key];
    el.setAttribute(key,val);
  }
  container.append(el);
}
function mountChildren(vnode,container){
  vnode.children.forEach((v) => {
    patch(v, container);
  });
}
function processComponent(vnode, container) {
  mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance);
  setupRenderEffect(instance, container);
}
function setupRenderEffect(instance, container) {
  const {proxy} = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container);
}