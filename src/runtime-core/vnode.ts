import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/shapeFlags"

export const Fragment = Symbol("Fragment")
export const Text = Symbol("Text")

export function createVNode(type, props?, children?) {
	const vnode = {
		type,
		props,
		children,
		shapeFlag: getShapeFlag(type),
		el: null
	}

	if (typeof children === "string") {
		// vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.TEXT_CHILDREN;
		vnode.shapeFlag |= ShapeFlags.TEXT_CHILDREN
	} else if (Array.isArray(children)) {
		// vnode.shapeFlag = vnode.shapeFlag | ShapeFlags.ARRAY_CHILDREN;
		vnode.shapeFlag |= ShapeFlags.ARRAY_CHILDREN
	}
	//判定slot children，isntance为component + children为object

	if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT && isObject(children)) {
		vnode.shapeFlag |= ShapeFlags.SLOT_CHILDREN
	}
	return vnode
}

export function createTextVNode(text: string) {
	return createVNode(Text, null, text)
}
function getShapeFlag(type) {
	if (typeof type === "string") {
		return ShapeFlags.ELEMENT
	} else {
		return ShapeFlags.STATEFUL_COMPONENT
	}
}
