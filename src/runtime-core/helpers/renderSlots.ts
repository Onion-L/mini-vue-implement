import { h } from "../h"
import { Fragment } from "../vnode"

export const renderSlots = (slots, name?, props?) => {
	const slot = name ? slots[name] : slots

	if (typeof slot === "function") {
		return h(Fragment, null, slot(props))
	}
}
