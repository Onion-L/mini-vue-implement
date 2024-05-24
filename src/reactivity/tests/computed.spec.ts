import { computed } from "../computed";
import { reactive } from "../reactive";

describe('computed', () => {
    it('happy path', () => {
        const user = reactive({
            age: 1
        });
        const cValue = computed(() => {
            return user.age;
        });

        expect(cValue.value).toBe(1);
    })
    it('should computed lazily', () => {
        const user = reactive({
            age: 1
        });
        const getter = jest.fn(() => {
            return user.age;
        })
        const cValue = computed(getter);

        cValue.value;
        expect(getter).toHaveBeenCalledTimes(1);
        cValue.value;
        expect(getter).toHaveBeenCalledTimes(1);

        //should not compute until needed
        user.age = 2;
        expect(cValue.value).toBe(2);
        expect(getter).toHaveBeenCalledTimes(2);
    })

})