import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from './createApp';
import { Fragment,Text } from './vnode';

export function createRenderer(options){
    const {createElement:hostCreateElement,patchProp:hostPatchProp,insert:hostInsert} = options;
    function render(vnode, container, parentComponent) {
      patch(vnode, container, parentComponent);
    }
    function patch(vnode, container, parentComponent) {
      const { type, shapeFlag } = vnode;
      switch (type) {
        case Fragment:
          processFragment(vnode, container, parentComponent);
          break;
        case Text:
          processText(vnode, container);
          break;
        default:
          if (shapeFlag & ShapeFlags.ELEMENT) {
            processElement(vnode, container, parentComponent);
          } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
            processComponent(vnode, container, parentComponent);
          }
          break;
      }
    }
    function processElement(vnode, container, parentComponent) {
      mountElement(vnode, container, parentComponent);
    }
    function mountElement(vnode, container, parentComponent) {
      const el = (vnode.el = hostCreateElement(vnode.type));
      const { children, shapeFlag } = vnode;
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children;
      } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el, parentComponent);
      }
      const { props } = vnode;
      for (const key in props) {
        const val = props[key];
       
        hostPatchProp(el, key, val);
      }
      hostInsert(el, container);
    }
    function processFragment(vnode, container, parentComponent) {
      mountChildren(vnode, container, parentComponent);
    }
    function processText(vnode, container) {
      const { children } = vnode;
      const textNode = (vnode.el = document.createTextNode(children));
      container.append(textNode);
    }
    function mountChildren(vnode, container, parentComponent) {
      vnode.children.forEach((v) => {
        patch(v, container, parentComponent);
      });
    }
    function processComponent(vnode, container, parentComponent) {
      mountComponent(vnode, container, parentComponent);
    }
    function mountComponent(initialVnode, container, parentComponent) {
      const instance = createComponentInstance(initialVnode, parentComponent);
      setupComponent(instance);
      setupRenderEffect(instance, initialVnode, container);
    }
    function setupRenderEffect(instance, initialVnode, container) {
      const { proxy } = instance;
      const subTree = instance.render.call(proxy);
      patch(subTree, container, instance);
      initialVnode.el = subTree.el;
    }
    return {
      createApp:createAppAPI(render)
    }
}
