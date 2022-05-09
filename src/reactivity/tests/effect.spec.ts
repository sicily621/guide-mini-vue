import {reactive} from '../reactive';
import {effect,stop} from '../effect';
describe('effect',()=>{
    it('happy path',()=>{
        const user = reactive({
            age:10
        })
        let nextAge;
        effect(()=>{
            nextAge = user.age+1;
        })
        expect(nextAge).toBe(11);
        user.age++;
        expect(nextAge).toBe(12);
    })
    it('should return runner when call effect',()=>{
        let foo = 10;
        const runner = effect(()=>{
            foo++;
            return 'foo';
        })
        expect(foo).toBe(11);
        const r = runner();
        expect(foo).toBe(12);
        expect(r).toBe('foo');
    })
    it('scheduler',()=>{
        let dummy;
        let run:any;
        const scheduler = jest.fn(()=>{
            run = runner;
        })
        const obj = reactive({foo:1});
        const runner = effect(
            ()=>{
                dummy = obj.foo;
            },{
                scheduler
            }
        )
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1);
        obj.foo++;
        expect(dummy).toBe(1);
        expect(scheduler).toHaveBeenCalledTimes(1);
        run();
        expect(dummy).toBe(2);
    })
    it("stop",()=>{
        let dummy;
        const obj = reactive({prop:1});
        const runner = effect(()=>{
            dummy = obj.prop;
        })
        obj.prop = 2;
        expect(dummy).toBe(2);
        stop(runner);
        // obj.prop = 3;
        //get set obj.prop = obj.prop+1;
        obj.prop++;
        expect(dummy).toBe(2);
        runner();
        expect(dummy).toBe(3);
    })
    it('onStop',()=>{
        const obj = reactive({foo:1});
        let dummy;
        const onStop = jest.fn();
        const runner = effect(
            ()=>{
                dummy = obj.foo;
            },{
                onStop
            }
        )
        stop(runner);
        expect(onStop).toBeCalledTimes(1);
    })
})