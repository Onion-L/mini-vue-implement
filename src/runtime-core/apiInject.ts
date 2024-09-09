/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentInstance } from "./component"

// 存储数据
export function provide(key, value) {
	const instance: any = getCurrentInstance()
	// 将provides的数值存在instance上
	if (instance) {
		let { provides } = instance
		const parentProvide = instance.parent ? instance.parent.provides : null
		if (provides === parentProvide) {
			provides = instance.provides = Object.create(parentProvide)
		}
		provides[key] = value
	}
}

//provide 如果获取会返回父级的provide
export function inject(key, defaultValue) {
	const instance: any = getCurrentInstance()
	if (instance) {
		if (key in instance.parent.provides) {
			return instance.parent.provides[key]
		} else if (defaultValue) {
			return typeof defaultValue === "function" ? defaultValue() : defaultValue
		}
	}
}
