import { camelize, toHandlerKey } from "../shared/index";

export function emit(instance,event,...args){
    const { props } = instance;
    const HandlerName = toHandlerKey(camelize(event));
    const handler = props[HandlerName];
    handler && handler(...args)
}