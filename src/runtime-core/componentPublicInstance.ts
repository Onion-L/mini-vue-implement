import { hasOwn } from "../shared/index"

const publicPropertiesMap = {
	$el: (i) => i.vnode.el,
	$slots: (i) => i.slots
}

export const componentPublicInstanceHandlers = {
	get({ _: instance }, key) {
		const { setupState, props } = instance
		if (hasOwn(setupState, key)) {
			return Reflect.get(setupState, key)
		} else if (hasOwn(props, key)) {
			return Reflect.get(props, key)
		}
		const publicGetter = publicPropertiesMap[key]
		if (publicGetter) {
			return publicGetter(instance)
		}
	}
}
