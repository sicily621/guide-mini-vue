import {ref,h} from '../../lib/guide-mini-vue.esm.js'
//1、左侧的对比
/* const prevChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{key:'C'},'C'),
]
const nextChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{key:'D'},'D'),
    h("p",{key:'E'},'E'),
] */
//2、右侧的对比
/* const prevChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{key:'C'},'C'),
]
const nextChildren = [
    h("p",{key:'D'},'D'),
    h("p",{key:'E'},'E'),
    h("p",{key:'B'},'B'),
    h("p",{key:'C'},'C'),
] */
//3、新的比老的长 左侧相同
/* const prevChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
]
const nextChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{key:'C'},'C'),
] */
//4、新的比老的长 右侧相同
/* const prevChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
]
const nextChildren = [
    h("p",{key:'D'},'D'),
    h("p",{key:'C'},'C'),
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
] */
//5、新的比老的短 删除 左侧相同
/* const prevChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{key:'C'},'C'),
]
const nextChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
]  
//6、新的比老的短 删除 右侧相同
/* const prevChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{key:'C'},'C'),
]
const nextChildren = [
    h("p",{key:'B'},'B'),
    h("p",{key:'C'},'C'),
] */ 
//7、对比中间的部分
/* const prevChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{key:'C',id:'prev-c'},'C'),
    h("p",{key:'D'},'D'),
    h("p",{key:'F'},'F'),
    h("p",{key:'G'},'G'),
]
const nextChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{key:'E'},'E'),
    h("p",{key:'C',id:'next-c'},'C'),
    h("p",{key:'F'},'F'),
    h("p",{key:'G'},'G'),
] */
//8、老的比新的长
/* const prevChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{key:'C',id:'prev-c'},'C'),
    h("p",{key:'E'},'E'),
    h("p",{key:'D'},'D'),
    h("p",{key:'F'},'F'),
    h("p",{key:'G'},'G'),
]
const nextChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{key:'E'},'E'),
    h("p",{key:'C',id:'next-c'},'C'),
    h("p",{key:'F'},'F'),
    h("p",{key:'G'},'G'),
] */
//9、最长递增子序列
/* const prevChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{key:'C'},'C'),
    h("p",{key:'D'},'D'),
    h("p",{key:'E'},'E'),
    h("p",{key:'F'},'F'),
    h("p",{key:'G'},'G'),
]
const nextChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{key:'E'},'E'),
    h("p",{key:'C'},'C'),
    h("p",{key:'D'},'D'),
    h("p",{key:'F'},'F'),
    h("p",{key:'G'},'G'),
]  */
/* const prevChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{key:'C'},'C'),
    h("p",{key:'E'},'E'),
    h("p",{key:'F'},'F'),
    h("p",{key:'G'},'G'),
]
const nextChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{key:'E'},'E'),
    h("p",{key:'C'},'C'),
    h("p",{key:'D'},'D'),
    h("p",{key:'F'},'F'),
    h("p",{key:'G'},'G'),
]  */
/* const prevChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{key:'C'},'C'),
    h("p",{key:'D'},'D'),
    h("p",{key:'E'},'E'),
    h("p",{key:'Z'},'Z'),
    h("p",{key:'F'},'F'),
    h("p",{key:'G'},'G'),
]
const nextChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{key:'D'},'D'),
    h("p",{key:'C'},'C'),
    h("p",{key:'Y'},'Y'),
    h("p",{key:'E'},'E'),
    h("p",{key:'F'},'F'),
    h("p",{key:'G'},'G'),
]  */
//fix
const prevChildren = [
    h("p",{key:'A'},'A'),
    h("p",{key:'B'},'B'),
    h("p",{},'C'),
    h("p",{key:'D'},'D'),
]
const nextChildren = [
    h("p",{key:'A'},'A'),
    h("p",{},'C'),
    h("p",{key:'B'},'B'),
    h("p",{key:'D'},'D'),
] 
export default {
    name: 'ArrayToArray',
    setup() {
        const isChange = ref(false);
        window.isChange = isChange;
        return {
            isChange
        }
    },
    render() {
        const self = this;
        return self.isChange === true ?
            h("div", {}, nextChildren) :
            h("div", {}, prevChildren)
    }
}
