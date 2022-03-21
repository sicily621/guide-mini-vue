import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

export function reactive(raw: any) {
  return createActiveObject(raw,mutableHandlers);
}
export function readonly(raw:any){
  return createActiveObject(raw, readonlyHandlers);
}
function createActiveObject(raw: any,baseHandlers) {
  return new Proxy(raw, baseHandlers);
}
