import { computed } from "../computed"
import { reactive } from "../reactive"

describe("computed",()=>{
    it("happy path",()=>{
        const user = reactive({
            age:1
        });
        const age = computed(()=>{
            return user.age;
        })
        expect(age.value).toBe(1);
    })
    it("should computed lazily",()=>{
        const value = reactive({
            foo:1
        })
        const getter = jest.fn(()=>{
            return value.foo;
        })
        const cValue = computed(getter);
        //lazy
        expect(getter).not.toHaveBeenCalled();
        expect(cValue.value).toBe(1);
        expect(getter).toHaveBeenCalledTimes(1);
        //触发get 只调用一次 
        cValue.value;
        expect(getter).toHaveBeenCalledTimes(1);

        value.foo = 2;
        expect(getter).toHaveBeenCalledTimes(1);

        expect(cValue.value).toBe(2);
        expect(getter).toHaveBeenCalledTimes(2);

        cValue.value;
        expect(getter).toHaveBeenCalledTimes(2);
    })
})