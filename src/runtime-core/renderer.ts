import { effect } from '../reactivity/effect';
import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from './createApp';
import { Fragment,Text } from './vnode';

export function createRenderer(options){
    const {createElement:hostCreateElement,patchProp:hostPatchProp,insert:hostInsert} = options;
    function render(vnode, container, parentComponent) {
      patch(null, vnode, container, parentComponent);
    }
    //n1 old n2 new
    function patch(n1,n2, container, parentComponent) {
      const { type, shapeFlag } = n2;
      switch (type) {
        case Fragment:
          processFragment(n1, n2, container, parentComponent);
          break;
        case Text:
          processText(n1, n2, container);
          break;
        default:
          if (shapeFlag & ShapeFlags.ELEMENT) {
            processElement(n1, n2, container, parentComponent);
          } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
            processComponent(n1, n2, container, parentComponent);
          }
          break;
      }
    }
    function processElement(n1, n2, container, parentComponent) {
      if(!n1){
        mountElement(n1, n2, container, parentComponent);
      }else{
        patchElement(n1, n2, container);
      }
    }
    function patchElement(n1,n2,container){
      console.log('patchComponent')
      console.log('n1',n1)
      console.log('n2',n2);
    }

    function mountElement(n1, n2, container, parentComponent) {
      const el = (n2.el = hostCreateElement(n2.type));
      const { children, shapeFlag } = n2;
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children;
      } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(n2, el, parentComponent);
      }
      const { props } = n2;
      for (const key in props) {
        const val = props[key];

        hostPatchProp(el, key, val);
      }
      hostInsert(el, container);
    }
    function processFragment(n1,n2, container, parentComponent) {
      mountChildren(n2, container, parentComponent);
    }
    function processText(n1, n2, container) {
      const { children } = n2;
      const textNode = (n2.el = document.createTextNode(children));
      container.append(textNode);
    }
    function mountChildren(vnode, container, parentComponent) {
      vnode.children.forEach((v) => {
        patch(null,v, container, parentComponent);
      });
    }
    function processComponent(n1,n2, container, parentComponent) {
      mountComponent(n2, container, parentComponent);
    }
    function mountComponent(initialVnode, container, parentComponent) {
      const instance = createComponentInstance(initialVnode, parentComponent);
      setupComponent(instance);
      setupRenderEffect(instance, initialVnode, container);
    }
    function setupRenderEffect(instance, initialVnode, container) {
      effect(()=>{
        if(!instance.isMounted){
            console.log("init");
            const { proxy } = instance;
            const subTree = (instance.subTree = instance.render.call(proxy));
            patch(null,subTree, container, instance);
            initialVnode.el = subTree.el;
            instance.isMounted = true;
        }else{
          console.log('update')
          const { proxy } = instance;
          const subTree =  instance.render.call(proxy);
          const prevSubTree = instance.subTree;
          instance.subTree = subTree;
          patch(prevSubTree,subTree, container, instance);
        }
      })
    }
    return {
      createApp:createAppAPI(render)
    }
}
