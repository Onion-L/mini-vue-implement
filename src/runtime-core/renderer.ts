/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { effect } from "../reactivity/effect"
import { ShapeFlags } from "../shared/shapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppAPI } from "./createApp"
import { Fragment, Text } from "./vnode"

export function createRenderer(options) {
	const { createElement, patchProps, insert } = options
	function render(vnode: any, rootContainer: any) {
		patch(null, vnode, rootContainer)
	}

	// 递归调用 组件拆包 判断是组件还是元素 区分默认和Fragment
	function patch(n1: any, n2: any, container: any, parentComponent?) {
		const { shapeFlag, type } = n2

		switch (type) {
			case Fragment:
				procressFragment(n1, n2, container, parentComponent)
				break
			case Text:
				processText(n1, n2, container)
				break
			default:
				if (shapeFlag & ShapeFlags.ELEMENT) {
					processElement(n1, n2, container, parentComponent)
				} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
					processComponent(n1, n2, container, parentComponent)
				}
				break
		}
	}

	// 处理Fragment 只挂载children
	function procressFragment(n1: any, n2: any, container: any, parentComponent) {
		mountChildren(n2, container, parentComponent)
	}

	function processText(n1: any, n2: any, container: any) {
		const { children } = n2
		const el = (n2.el = document.createTextNode(children))
		container.append(el)
	}

	function processElement(n1: any, n2: any, container: any, parentComponent) {
		console.log("processElement", n1, n2)
		if (!n1) {
			mountElement(n2, container, parentComponent)
		} else {
			patchElement(n1, n2, container, parentComponent)
		}
	}

	function patchElement(n1: any, n2: any, container: any, parentComponent) {
		console.log("patchElement")
		console.log(n1)
		console.log(n2)
		console.log("container", container)
		console.log("parentComponent", parentComponent)
	}

	// 将组件的元素渲染到页面上
	function mountElement(n2: any, container: any, parentComponent) {
		const { type, props, children } = n2
		const el = (n2.el = createElement(type))
		for (const key in props) {
			const val = props[key]
			patchProps(el, key, val)
		}

		//这里默认了children是string类型
		// el.textContent = children;
		//但是也有可能是Array类 在父节点下添加多个子节
		if (n2.shapeFlag & ShapeFlags.TEXT_CHILDREN) {
			el.textContent = children
		} else if (n2.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
			mountChildren(n2, el, parentComponent)
		}
		insert(el, container)
	}

	// 挂载children 变量children数组 递归调用patch(拆包)
	function mountChildren(vnode, container, parentComponent) {
		vnode.children.forEach((v) => {
			patch(null, v, container, parentComponent)
		})
	}

	function processComponent(n1: any, n2: any, container: any, parentComponent) {
		mountComponent(n2, container, parentComponent)
	}

	// 挂载组件 创建组件实例 初始化组件以及调用组件的render方法
	function mountComponent(vnode: any, container: any, parentComponent) {
		const instance = createComponentInstance(vnode, parentComponent)
		setupComponent(instance)
		setupRenderEffect(instance, vnode, container)
	}

	// 将组件的render方法的this指向proxy，实现this.$el, this.$slots的使用
	function setupRenderEffect(instance: any, vnode: any, container: any) {
		effect(() => {
			if (!instance.isMounted) {
				console.log("init")
				const { proxy } = instance
				const subTree = (instance.subTree = instance.render.call(proxy))
				patch(null, subTree, container, instance)
				vnode.el = subTree.el
				instance.isMounted = true
			} else {
				console.log("update")
				const { proxy } = instance
				const subTree = instance.render.call(proxy)
				const prevSubTree = instance.subTree
				instance.subTree = subTree
				patch(prevSubTree, subTree, container, instance)
				console.log("update")
			}
		})
	}

	return {
		createApp: createAppAPI(render)
	}
}
