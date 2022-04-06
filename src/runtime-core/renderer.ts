import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from "./component";
import { Fragment,Text } from './vnode';

export function render(vnode,container){
    patch(vnode, container)
}
function patch(vnode, container) {
    const { type,shapeFlag } = vnode;
    switch (type) {
      case Fragment:
        processFragment(vnode, container);
        break;
      case Text:
        processText(vnode, container);
        break;
      default:
        if (shapeFlag & ShapeFlags.ELEMENT) {
          processElement(vnode, container);
        } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(vnode, container);
        }
        break;
    }
    
}
function processElement(vnode, container) {
  mountElement(vnode, container);
}
function mountElement(vnode, container){
  const el = (vnode.el = document.createElement(vnode.type));
  const {children,shapeFlag} = vnode;
  if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, el);
  }
  const {props} = vnode;
  for(const key in props){
    const val = props[key];
    const isOn = (key:string)=>/^on[A-Z]/.test(key);
    if (isOn(key)) {
      const event = key.slice(2).toLowerCase();
      el.addEventListener(event, val);
    } else {
      el.setAttribute(key, val);
    }
  }
  container.append(el);
}
function processFragment(vnode,container){
  mountChildren(vnode,container);
}
function processText(vnode, container) {
  const {children} = vnode;
  const textNode = (vnode.el = document.createTextNode(children));
  container.append(textNode);
}
function mountChildren(vnode,container){
  vnode.children.forEach((v) => {
    patch(v, container);
  });
}
function processComponent(vnode, container) {
  mountComponent(vnode, container);
}
function mountComponent(initialVnode, container) {
  const instance = createComponentInstance(initialVnode);
  setupComponent(instance);
  setupRenderEffect(instance, initialVnode, container);
}
function setupRenderEffect(instance, initialVnode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);
  patch(subTree, container);
  initialVnode.el = subTree.el;
}