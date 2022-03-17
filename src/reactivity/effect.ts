let activeEffect: any;
class ReactiveEffect{
    private _fn: any;
    constructor(fn: any){
        this._fn = fn;
    }
    run(){
        activeEffect = this;
        this._fn();
    }
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
    deps.add(activeEffect)
}
export function trigger(target:any,key:any){
    let depsMap = targetMap.get(target);
    if(!depsMap) return;
    let deps = depsMap.get(key);
    deps && deps.forEach((effect: { run: () => void; })=>{
        effect.run()
    })
}
export function effect(fn: any){
    const _effect = new ReactiveEffect(fn);
    _effect.run();
}