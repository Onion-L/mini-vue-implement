import { h } from "../h"

export const renderSlots = (slots, name?, props?) => {
	let slot = name ? slots[name] : slots

	if (typeof slot === "function") {
		return h("Fragment", null, slot(props))
	}
}
