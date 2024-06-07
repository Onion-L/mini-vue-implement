import { createVNode } from "../vnode"

export const renderSlots = (slots, name?) => {
	let slot = name ? slots[name] : slots
	console.log("render", slot)

	return createVNode("div", null, slot)
}
