import { h } from "../h"

export const renderSlots = (slots, name?, props?) => {
	let slot = name ? slots[name] : slots

	console.log(typeof slot)
	console.log("render", slot(props))

	if (typeof slot === "function") {
		return h("div", null, slot(props))
	}
}
