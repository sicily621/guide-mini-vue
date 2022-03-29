import {h} from '../../lib/guide-mini-vue.esm.js';
window.self = null;
export const App = {
    render(){
        window.self = this;
        return h("div",{
            id:'root',
            class:['red','hard']
        },
        "hi,"+this.msg
        //[h("p",{class:'red'},"hi"),h("h1",{class:"green"},'标题')]
        )
    },
    setup(){
        return {
            msg:'mini-vue'
        }
    }
}