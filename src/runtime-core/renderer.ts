/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { effect } from "../reactivity/effect"
import { ShapeFlags } from "../shared/shapeFlags"
import { createComponentInstance, setupComponent } from "./component"
import { createAppAPI } from "./createApp"
import { Fragment, Text } from "./vnode"

export function createRenderer(options) {
	const {
		createElement,
		patchProps: hostPatchProps,
		insert,
		remove: hostRemove,
		setElementText: hostSetElementText
	} = options
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
		const oldProps = n1.props || {}
		const newProps = n2.props || {}
		const el = (n2.el = n1.el)
		console.log("patchElement container", container)

		patchProps(el, oldProps, newProps)
		patchChildren(n1, n2, el, parentComponent)
		// patch(null, n2, container, parentComponent)
	}

	function patchProps(el, oldProps, newProps) {
		if (oldProps !== newProps) {
			for (const key in newProps) {
				if (oldProps[key] !== newProps[key]) {
					hostPatchProps(el, key, newProps[key])
				}
			}

			if (Object.keys(oldProps).length > 0) {
				for (const key in oldProps) {
					if (!(key in newProps)) {
						hostPatchProps(el, key, null)
					}
				}
			}
		}
	}

	function patchChildren(n1: any, n2: any, el: any, parentComponent) {
		const oldChidlren = n1.children
		const newChildren = n2.children

		const prevShapeFlag = n1.shapeFlag
		const shapeFlag = n2.shapeFlag

		// Text -> Text
		if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
			if (oldChidlren !== newChildren) {
				hostSetElementText(el, newChildren)
			}
		} else {
			if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
				hostSetElementText(el, "")
				mountChildren(n2, el, parentComponent)
			}
		}

		// Array -> Text
		if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
			if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
				unMountedChildren(n1)
				hostSetElementText(el, newChildren)
			} else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
				if (oldChidlren.length === newChildren.length) {
					newChildren.forEach((child, index) => {
						if (child.type === oldChidlren[index].type) {
							if (child.children !== oldChidlren[index].children) {
								el.children[index].textContent = child.children
							}
						}
					})
				}
			}
		}
	}

	function unMountedChildren(n1: any) {
		n1.children.forEach((child) => {
			const el = child.el
			hostRemove(el)
			// el.parentNode.removeChild(el)
		})
	}

	// 将组件的元素渲染到页面上
	function mountElement(n2: any, container: any, parentComponent) {
		const { type, props, children } = n2
		const el = (n2.el = createElement(type))
		for (const key in props) {
			const val = props[key]
			hostPatchProps(el, key, val)
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
			}
		})
	}

	return {
		createApp: createAppAPI(render)
	}
}
