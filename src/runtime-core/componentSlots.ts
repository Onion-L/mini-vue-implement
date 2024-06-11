import { isObject } from "../shared/index"

export function initSlots(instance, children) {
	if (Array.isArray(children)) {
		instance.slots = children
	} else if (isObject(children)) {
		normalizeSlots(children, instance.slots)
	}
}

const normalizeSlots = (children, slots) => {
	for (const key in children) {
		const value = children[key]
		slots[key] = normalizeSlotValue(value)
	}
}
const normalizeSlotValue = (value) => {
	return Array.isArray(value) ? value : [value]
}
