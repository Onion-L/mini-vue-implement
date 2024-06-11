import { isObject } from "../shared/index"
import { ShapeFlags } from "../shared/shapeFlags"
import { createComponentInstance, setupComponent } from "./component"

export function render(vnode: any, rootContainer: any) {
	patch(vnode, rootContainer)
}

// 递归调用 组件拆包 判断是组件还是元素 区分默认和Fragment
function patch(vnode: any, container: any) {
	const { shapeFlag, type } = vnode

	switch (type) {
		case "Fragment":
			procressFragment(vnode, container)
			break

		default:
			if (shapeFlag & ShapeFlags.ELEMENT) {
				processElement(vnode, container)
			} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
				processComponent(vnode, container)
			}
			break
	}
}

// 处理Fragment 只挂载children
function procressFragment(vnode: any, container: any) {
	console.log("Fragment", vnode.children)
	mountChildren(vnode, container)
}

function processElement(vnode: any, container: any) {
	mountElement(vnode, container)
}

// 将组件的元素渲染到页面上
function mountElement(vnode: any, container: any) {
	const { type, props, children } = vnode
	const el = (vnode.el = document.createElement(type))
	for (const key in props) {
		if (key.startsWith("on")) {
			const event = key.slice(2).toLowerCase()
			const listener = props[key]
			el.addEventListener(event, listener)
		} else if (props.hasOwnProperty(key)) {
			el.setAttribute(key, props[key])
		}
	}

	//这里默认了children是string类型
	// el.textContent = children;
	//但是也有可能是Array类 在父节点下添加多个子节
	if (vnode.shapeFlag & ShapeFlags.TEXT_CHILDREN) {
		el.textContent = children
	} else if (vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
		mountChildren(vnode, el)
	}
	container.appendChild(el)
}

// 挂载children 变量children数组 递归调用patch(拆包)
function mountChildren(vnode, container) {
	vnode.children.forEach((v) => {
		patch(v, container)
	})
}

function processComponent(vnode: any, container: any) {
	mountComponent(vnode, container)
}

// 挂载组件 创建组件实例 初始化组件以及调用组件的render方法
function mountComponent(vnode: any, container: any) {
	const instance = createComponentInstance(vnode)
	setupComponent(instance)
	setupRenderEffect(instance, vnode, container)
}

// 将组件的render方法的this指向proxy，实现this.$el, this.$slots的使用
function setupRenderEffect(instance: any, vnode: any, container: any) {
	const { proxy } = instance
	const subTree = instance.render.call(proxy)
	patch(subTree, container)
	vnode.el = subTree.el
}
