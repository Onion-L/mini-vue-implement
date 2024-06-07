import { ShapeFlags } from "../shared/shapeFlags"
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

	return vnode
}

function getShapeFlag(type) {
	if (typeof type === "string") {
		return ShapeFlags.ELEMENT
	} else {
		return ShapeFlags.STATEFUL_COMPONENT
	}
}
