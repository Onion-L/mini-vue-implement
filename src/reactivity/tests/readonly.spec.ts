import { isReadonly, readonly } from "../reactive";

describe('readonly',() => {
    it('happy path',() => {
        const original = {foo:1,bar:{baz:2}};
        const wrapped = readonly(original);
        expect(wrapped).not.toBe(original);
        expect(wrapped.foo).toBe(1);
        expect(isReadonly(wrapped)).toBe(true);
        expect(isReadonly(original)).toBe(false);
    })
    it('warn when call set',() => {
        console.warn = jest.fn();
        const original = {foo:1,bar:{baz:2}};
        const wrapped = readonly(original);
        expect(wrapped).not.toBe(original);
        expect(wrapped.foo).toBe(1);
        wrapped.foo = 2;
        expect(console.warn).toHaveBeenCalled();
    })
})