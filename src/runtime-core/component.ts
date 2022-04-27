import { proxyRefs } from "../reactivity";
import { shallowReadonly } from "../reactivity/reactive";
import { emit } from "./componentEmit";
import { initProps } from "./componentProps";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";
import { initSlots } from "./componentSlots";

export function createComponentInstance(vnode,parent){
    const component = {
      vnode,
      type: vnode.type,
      setupState: {},
      props: {},
      slots: {},
      provides: parent ? parent.provides : {},
      parent,
      isMounted: false,
      emit: () => {},
    };
    component.emit = emit.bind(null,component) as any;
    return component;
}
export function setupComponent(instance){
    initProps(instance,instance.vnode.props);
    initSlots(instance,instance.vnode.children);
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    instance.proxy = new Proxy(
      {
        _: instance,
      },
      PublicInstanceProxyHandlers
    );
    const { setup } = Component;
    if(setup){
        setCurrentInstance(instance);
        const setupResult = setup(shallowReadonly(instance.props),{
            emit:instance.emit
        });
        handleSetupResult(instance,setupResult);
        setCurrentInstance(null);
    }
}
function handleSetupResult(instance,setupResult) {
  if (typeof setupResult === "object") {
      instance.setupState = proxyRefs(setupResult);
  }
  finishComponentSetup(instance);
}
function finishComponentSetup(instance){
    const Component = instance.type;
    instance.render = Component.render;
}
let currentInstance = null;
export function getCurrentInstance(){
   return currentInstance;
}
export function setCurrentInstance(instance){
    currentInstance = instance;
}