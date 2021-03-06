import { extend } from "../shared/index";

let activeEffect: any;
let shouldTrack;
export class ReactiveEffect{
    private _fn: any;
    deps = [];
    active = true;
    onStop?:()=>void;
    constructor(fn: any,public scheduler?: any){
        this._fn = fn;
    }
    run(){
        if(!this.active){
            return this._fn();
        }
        shouldTrack = true;

        activeEffect = this;
        const result = this._fn();

        shouldTrack = false;
        return result;
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
    effect.deps.length = 0;
}
let targetMap = new Map();
export function track(target: any, key: any) {
  //targetMap target key
  if(!isTracking()) return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }
  trackEffects(deps);
}
export function trackEffects(deps){
    if (deps.has(activeEffect)) return;
    deps.add(activeEffect);
    //εεζΆι
    activeEffect.deps.push(deps);
}
export function isTracking() {
    return shouldTrack && activeEffect!==undefined;
}
export function trigger(target:any,key:any){
    let depsMap = targetMap.get(target);
    if(!depsMap) return;
    let deps = depsMap.get(key);
    triggerEffect(deps);
}
export function triggerEffect(deps){
    deps && deps.forEach((effect)=>{
        if(effect.scheduler){
            effect.scheduler()
        }else{
            effect.run()
        }
    })
}
export function effect(fn: any,options:any = {}){
    const _effect = new ReactiveEffect(fn,options.scheduler);
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