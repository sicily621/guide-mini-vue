import { effect } from '../reactivity/effect';
import { ShapeFlags } from '../shared/shapeFlags';
import { createComponentInstance, setupComponent } from "./component";
import { createAppAPI } from './createApp';
import { Fragment,Text } from './vnode';

export function createRenderer(options){
    const {
      createElement: hostCreateElement,
      patchProp: hostPatchProp,
      insert: hostInsert,
      remove: hostRemove,
      setElementText:hostSetElementText,
    } = options;
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
        patchElement(n1, n2, container, parentComponent);
      }
    }
    function patchElement(n1, n2, container, parentComponent) {
      console.log("patchComponent");
      console.log("n1", n1);
      console.log("n2", n2);
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      const el = (n2.el = n1.el);
      patchChildren(n1, n2, el, parentComponent);
      patchProps(el, oldProps, newProps);
    }
    function patchChildren(n1,n2,container,parentComponent){
      const prevShapeFlag = n1.shapeFlag;
      const {shapeFlag} = n2;
      const c1 = n1.children;
      const c2 = n2.children;

      if(shapeFlag & ShapeFlags.TEXT_CHILDREN){
        if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          //1  把n1都清空
          unmountChildren(n1.children);
        }
        //2  设置text
        if (c1 !== c2) {
          hostSetElementText(container, c2);
        }
      }else{
        //text to array 
        if(prevShapeFlag & ShapeFlags.TEXT_CHILDREN){
          hostSetElementText(container,"");
          mountChildren(c2,container,parentComponent)
        }
      }
    }
    function unmountChildren(children){
      for(let i = 0;i<children.length;i++){
        const el = children[i].el;
        hostRemove(el);
      }
    }

    const EMPTY_OBJ = {};
    function patchProps(el,oldProps, newProps) {
      if(oldProps!==newProps){
          for (let key in newProps) {
            const prevProp = oldProps[key];
            const nextProp = newProps[key];

            if (prevProp !== nextProp) {
              hostPatchProp(el, key, prevProp, nextProp);
            }
          }
          if (oldProps !== EMPTY_OBJ)
            for (let key in oldProps) {
              if (!(key in newProps)) {
                hostPatchProp(el, key, oldProps[key], null);
              }
            }
      }
      
    }

    function mountElement(n1, n2, container, parentComponent) {
      const el = (n2.el = hostCreateElement(n2.type));
      const { children, shapeFlag } = n2;
      if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children;
      } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(n2.children, el, parentComponent);
      }
      const { props } = n2;
      for (const key in props) {
        const val = props[key];
        hostPatchProp(el, key,null, val);
      }
      hostInsert(el, container);
    }
    function processFragment(n1,n2, container, parentComponent) {
      mountChildren(n2.children, container, parentComponent);
    }
    function processText(n1, n2, container) {
      const { children } = n2;
      const textNode = (n2.el = document.createTextNode(children));
      container.append(textNode);
    }
    function mountChildren(children, container, parentComponent) {
      children.forEach((v) => {
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
