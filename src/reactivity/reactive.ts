export function reactive(raw:any) {
  return new Proxy(raw, {
      get(target,key){
          //Todo 依赖收集
        return Reflect.get(target,key)
      },
      set(target,key,value){
          //Todo 触发依赖
          const res = Reflect.set(target,key,value);
          return res;
      }
  });
}
