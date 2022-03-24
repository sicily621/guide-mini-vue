import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffect } from "./effect";
import { reactive } from "./reactive";

class RefImpl{
    private _value:any;
    public dep;
    private _rawValue: any;
    private _v_ref: boolean;
    constructor(value){
        this._v_ref = true;
        this._rawValue = value;
        this._value = convert(value);
        this.dep = new Set();
    }
    get value(){
        trackRefEffects(this);
        return this._value;
    }
    set value(newValue){
        if (hasChanged(newValue, this._rawValue)){
            this._rawValue = newValue;
            this._value = convert(newValue);
            triggerEffect(this.dep);
        }
    }
}
function convert(value){
    return isObject(value) ? reactive(value) : value;
}
function trackRefEffects(ref){
    if (isTracking()) {
      trackEffects(ref.dep);
    }
}
export function ref(value){
    return new RefImpl(value);
}
export function isRef(value){
    return !!value._v_ref;
}
export function unRef(ref){
    return isRef(ref) ? ref.value: ref;
}
export function proxyRefs(objectWithRefs){
    return new Proxy(objectWithRefs,{
        get(target,key){
            return unRef(Reflect.get(target,key));
        },
        set(target,key,value){
            if(isRef(target[key]) && !isRef(value)){
                return (target[key].value = value);
            }else{
                return Reflect.set(target, key, value);
            }
        }
    });
}