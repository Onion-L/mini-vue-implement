import { h } from "../h"

export const renderSlots = (slots, name?) => {
	let slot = name ? slots[name] : slots

	return h("div", null, slot)
}
