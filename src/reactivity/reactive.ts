import { mutableHandlers ,readonlyHandler} from "./baseHandler";

export const enum ReactiveFlags {
    IS_REACTIVE='__v_isReactive',
    IS_READONLY='__v_isReadonly'
}

export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY];
}

export function reactive(raw) {
    return new Proxy(raw,mutableHandlers)
}

export function readonly(raw) {
    return new Proxy(raw,readonlyHandler)
}