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

function remove(el) {
	const parent = el.parentNode
	if (parent) {
		parent.removeChild(el)
	}
}

function setElementText(el, text) {
	el.textContent = text
}

export const renderer: any = createRenderer({
	createElement,
	patchProps,
	insert,
	remove,
	setElementText
})

export function createApp(...args) {
	return renderer.createApp(...args)
}

export * from "../runtime-core"
