import { track,trigger } from "./effect";
import { ReactiveFlags } from "./reactive";

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

function createGetter(isReadonly = false) {
    return function getter(target,key) {
        const res = Reflect.get(target, key);
        console.log(key);
        if(key === ReactiveFlags.IS_REACTIVE) {
            return !isReadonly;
        }else if(key === ReactiveFlags.IS_READONLY) {
            return isReadonly;
        }
        if(!isReadonly) {
            track(target,key);
        }
        return res;
    }
}

function createSetter() {
    return function setter(target,key,value) {
        const res = Reflect.set(target,key,value);
        trigger(target,key);
        return res;
    }
}

export const mutableHandlers = {
    get,
    set
}

export const readonlyHandler = {
    get:readonlyGet,
    set(target,key,value) {
        console.warn(`Key:${key} cannot be set, because Target: ${target} is readonly.`)
        return true;
    }
}