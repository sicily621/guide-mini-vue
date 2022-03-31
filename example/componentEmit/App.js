import {h} from '../../lib/guide-mini-vue.esm.js';
import {Foo} from './Foo.js'
export const App = {
    name: 'App',
    render(){
        return h("div",{},[h("div",{},"App"),h(Foo,{
            onAdd(a,b){
                console.log('onAdd',a,b);
            },
            onBarFoo(c,d){
                console.log('onBarFoo', c, d);
            }
        })])
    },
    setup(){
        return {
            
        }
    }
}