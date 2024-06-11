import { render } from "./renderer"
import { createVNode } from "./vnode"

export function createApp(rootComponet) {
	return {
		mount(rootContainer) {
			//挂载时会先根据根组件创建一个虚拟节点vnode，然后再进行vnode处理
			const vnode = createVNode(rootComponet)
			render(vnode, rootContainer)
		}
	}
}
