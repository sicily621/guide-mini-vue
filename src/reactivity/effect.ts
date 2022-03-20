import { extend } from "../shared/index";

let activeEffect: any;
class ReactiveEffect{
    private _fn: any;
    deps = [];
    active = true;
    onStop?:()=>void;
    constructor(fn: any,public schedular?: any){
        this._fn = fn;
    }
    run(){
        activeEffect = this;
        return this._fn();
    }
    stop(){
        if(this.active){
            cleanupEffect(this)
            if(this.onStop) this.onStop();
            this.active = false;
        }
    }
}
function cleanupEffect(effect){
    effect.deps.forEach((dep:any)=>{
        dep.delete(effect)
    })
}
let targetMap = new Map();
export function track(target: any,key: any){
    //targetMap target key
    let depsMap = targetMap.get(target);
    if(!depsMap){
        depsMap = new Map();
        targetMap.set(target,depsMap);
    }
    let deps = depsMap.get(key);
    if(!deps){
        deps = new Set();
        depsMap.set(key,deps);
    }
    if(!activeEffect) return;
    deps.add(activeEffect)
    //反向收集
    activeEffect.deps.push(deps);
}
export function trigger(target:any,key:any){
    let depsMap = targetMap.get(target);
    if(!depsMap) return;
    let deps = depsMap.get(key);
    deps && deps.forEach((effect)=>{
        if(effect.schedular){
            effect.schedular()
        }else{
            effect.run()
        }
    })
}
export function effect(fn: any,options:any = {}){
    const _effect = new ReactiveEffect(fn,options.schedular);
    extend(_effect,options);
    _effect.onStop = options.onStop;
    _effect.run();
    const runner:any = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}
export function stop(runner){
    runner.effect.stop()
}