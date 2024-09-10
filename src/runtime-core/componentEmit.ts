import { camelize, toHandlerKey } from "../shared/index"

export function emit(instance, event, ...rawArgs) {
	const key = toHandlerKey(camelize(event))
	const { props } = instance
	const handler = props[key]

	handler(...rawArgs)
}
