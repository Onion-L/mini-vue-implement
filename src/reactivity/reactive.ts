import { mutableHandlers ,readonlyHandler} from "./baseHandler";

export function reactive(raw) {
    return new Proxy(raw,mutableHandlers)
}

export function readonly(raw) {
    return new Proxy(raw,readonlyHandler)
}