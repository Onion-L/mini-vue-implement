import { camelize, toHandlerKey } from "../shared/index"

export function emit(instance, event, ...rawArgs) {
	const key = toHandlerKey(camelize(event))
	const { props } = instance
	let handler = props[key]

	handler(...rawArgs)
}
