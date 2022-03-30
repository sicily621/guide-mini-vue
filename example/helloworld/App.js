import {h} from '../../lib/guide-mini-vue.esm.js';
import {Foo} from './Foo.js'
window.self = null;
export const App = {
    render(){
        window.self = this;
        return h("div",{
            name:'App',
            id:'root',
            class:['red','hard'],
            onClick(){
                console.log('click')
            },
            onMousedown(){
                console.log('onMousedown')
            }
        },
        [h("div",{},"hi,"+this.msg),h(Foo,{count:1})]
        //[h("p",{class:'red'},"hi"),h("h1",{class:"green"},'标题')]
        )
    },
    setup(){
        return {
            msg:'mini-vue'
        }
    }
}