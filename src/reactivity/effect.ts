class ReactiveEffect{
    private _fn: any;
    constructor(fn: any){
        this._fn = fn;
    }
    run(){
        this._fn();
    }
}
export function effect(fn: any){
    const _effect = new ReactiveEffect(fn);
    _effect.run();
}