import { getCurrentInstance } from "./component"

export function provide(key, value) {
	const instance: any = getCurrentInstance()
	console.log("provides", instance.provides, instance)

	if (instance.provides) {
		instance.provides[key] = value
	}
	console.log(instance)
}

export function inject(key) {
	const instance: any = getCurrentInstance()
	console.log("instance123", instance.parent.parent)

	return instance.parent.provides[key]
}
