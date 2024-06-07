import { isObject } from "../shared/index"

export function initSlots(instance, children) {
	// instance.slots = Array.isArray(children) ? children : [children || {}]

	console.log(isObject(children))
	if (Array.isArray(children)) {
		instance.slots = children
	} else if (isObject(children)) {
		const slots = {}
		for (const key in children) {
			const value = children[key]
			slots[key] = Array.isArray(value) ? value : [value]
		}
		instance.slots = slots
	} else {
		instance.slots = [children || {}]
	}
}

/**
 * [h(),h(type,props,children)]
 * slots:{}
 */
