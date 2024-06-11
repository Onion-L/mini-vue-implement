import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/shapeFlags"

export function initSlots(instance, children) {
	const { vnode } = instance

	if (!!(vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN)) {
		if (Array.isArray(children)) {
			instance.slots = children
		} else if (isObject(children)) {
			normalizeSlots(children, instance.slots)
		}
	}
}

const normalizeSlots = (children, slots) => {
	for (const key in children) {
		const value = children[key]
		console.log(value(1))

		slots[key] = (props) => normalizeSlotValue(value(props))
	}
	console.log(slots)
}
const normalizeSlotValue = (value) => {
	return Array.isArray(value) ? value : [value]
}
