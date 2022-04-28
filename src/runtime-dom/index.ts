import { createRenderer } from "../runtime-core";
function createElement(type) {
  return document.createElement(type);
}
function patchProp(el, key, oldVal,newVal) {
  const isOn = (key: string) => /^on[A-Z]/.test(key);
  if (isOn(key)) {
    const event = key.slice(2).toLowerCase();
    el.addEventListener(event, newVal);
  } else {
    if(newVal === undefined || newVal === null){
      el.removeAttribute(key, newVal);
    }else{
      el.setAttribute(key, newVal);
    }
  }
}
function insert(el, container) {
  container.append(el);
}
const render:any = createRenderer({
  createElement,
  patchProp,
  insert,
});
export function createApp(...args){
    return render.createApp(...args)
}
export * from "../runtime-core";