/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ShapeFlags } from "../shared/shapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppAPI } from "./createApp"
import { Fragment, Text } from "./vnode"

export function createRenderer(options) {
	const { createElement, patchProps, insert } = options
	function render(vnode: any, rootContainer: any) {
		patch(vnode, rootContainer)
	}

	// 递归调用 组件拆包 判断是组件还是元素 区分默认和Fragment
	function patch(vnode: any, container: any, parentComponent?) {
		const { shapeFlag, type } = vnode
		switch (type) {
			case Fragment:
				procressFragment(vnode, container, parentComponent)
				break
			case Text:
				processText(vnode, container)
				break
			default:
				if (shapeFlag & ShapeFlags.ELEMENT) {
					processElement(vnode, container, parentComponent)
				} else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
					processComponent(vnode, container, parentComponent)
				}
				break
		}
	}

	// 处理Fragment 只挂载children
	function procressFragment(vnode: any, container: any, parentComponent) {
		mountChildren(vnode, container, parentComponent)
	}

	function processText(vnode: any, container: any) {
		const { children } = vnode
		const el = (vnode.el = document.createTextNode(children))
		container.append(el)
	}

	function processElement(vnode: any, container: any, parentComponent) {
		mountElement(vnode, container, parentComponent)
	}

	// 将组件的元素渲染到页面上
	function mountElement(vnode: any, container: any, parentComponent) {
		const { type, props, children } = vnode
		const el = (vnode.el = createElement(type))
		for (const key in props) {
			const val = props[key]
			patchProps(el, key, val)
		}

		//这里默认了children是string类型
		// el.textContent = children;
		//但是也有可能是Array类 在父节点下添加多个子节
		if (vnode.shapeFlag & ShapeFlags.TEXT_CHILDREN) {
			el.textContent = children
		} else if (vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
			mountChildren(vnode, el, parentComponent)
		}
		insert(el, container)
	}

	// 挂载children 变量children数组 递归调用patch(拆包)
	function mountChildren(vnode, container, parentComponent) {
		vnode.children.forEach((v) => {
			patch(v, container, parentComponent)
		})
	}

	function processComponent(vnode: any, container: any, parentComponent) {
		mountComponent(vnode, container, parentComponent)
	}

	// 挂载组件 创建组件实例 初始化组件以及调用组件的render方法
	function mountComponent(vnode: any, container: any, parentComponent) {
		const instance = createComponentInstance(vnode, parentComponent)
		setupComponent(instance)
		setupRenderEffect(instance, vnode, container)
	}

	// 将组件的render方法的this指向proxy，实现this.$el, this.$slots的使用
	function setupRenderEffect(instance: any, vnode: any, container: any) {
		const { proxy } = instance
		const subTree = instance.render.call(proxy)
		patch(subTree, container, instance)
		vnode.el = subTree.el
	}

	return {
		createApp: createAppAPI(render)
	}
}
