import { isObject } from "../shared/index"
import {
	mutableHandlers,
	readonlyHandler,
	shallowReadonlyHandler
} from "./baseHandler"

export const enum ReactiveFlags {
	IS_REACTIVE = "__v_isReactive",
	IS_READONLY = "__v_isReadonly"
}

export function isReactive(value) {
	return !!value[ReactiveFlags.IS_REACTIVE]
}

export function isReadonly(value) {
	return !!value[ReactiveFlags.IS_READONLY]
}

export function isProxy(value) {
	return isReactive(value) || isReadonly(value)
}

export function reactive(raw) {
	return createProxyObject(raw, mutableHandlers)
}

export function readonly(raw) {
	return createProxyObject(raw, readonlyHandler)
}

export function shallowReadonly(raw) {
	return createProxyObject(raw, shallowReadonlyHandler)
}

function createProxyObject(target, baseHandler) {
	if (!isObject(target)) {
		console.warn(`target ${target} must be an Object type`)
		return target
	}
	return new Proxy(target, baseHandler)
}
