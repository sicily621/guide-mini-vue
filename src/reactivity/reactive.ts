export function reactive(raw:any) {
  return new Proxy(raw, {
      get(target,key){
          //TODO 依赖收集
        return Reflect.get(target,key)
      },
      set(target,key,value){
          //TODO 触发依赖
          const res = Reflect.set(target,key,value);
          return res;
      }
  });
}
