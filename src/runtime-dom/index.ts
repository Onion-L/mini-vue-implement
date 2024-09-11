/* eslint-disable @typescript-eslint/no-explicit-any */
import { createRenderer } from "../runtime-core"

function createElement(type) {
	return document.createElement(type)
}

function patchProps(el, key, val) {
	if (key.startsWith("on")) {
		const event = key.slice(2).toLowerCase()
		const listener = val
		el.addEventListener(event, listener)
	} else if (val === null || val === undefined) {
		el.removeAttribute(key)
	} else {
		el.setAttribute(key, val)
	}
}

function insert(el, parent) {
	parent.appendChild(el)
}

export const renderer: any = createRenderer({
	createElement,
	patchProps,
	insert
})

export function createApp(...args) {
	return renderer.createApp(...args)
}

export * from "../runtime-core"
