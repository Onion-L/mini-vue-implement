/* eslint-disable @typescript-eslint/no-explicit-any */
import { shallowReadonly } from "../reactivity/reactive"
import { emit } from "./componentEmit"
import { initProps } from "./componentProps"
import { componentPublicInstanceHandlers } from "./componentPublicInstance"
import { initSlots } from "./componentSlots"

// vnode -> 需要用到的一系列属性 包括vnode 返回一个实例对象
export function createComponentInstance(vnode, parent) {
	const component = {
		vnode,
		type: vnode.type,
		setupState: {},
		props: {},
		slots: {},
		provides: parent ? parent.provides : {},
		parent,
		emit: () => {}
	}

	component.emit = emit.bind(null, component) as any
	return component
}

export function setupComponent(instance) {
	initSlots(instance, instance.vnode.children)
	initProps(instance, instance.vnode.props)
	setupStatefulComponent(instance)
}

function createSetupContext(instance) {
	return { emit: instance.emit, slots: instance.slots }
}

function setupStatefulComponent(instance: any) {
	const Component = instance.type
	const { setup } = Component
	instance.proxy = new Proxy({ _: instance }, componentPublicInstanceHandlers)
	if (setup) {
		setCurrentInstance(instance)
		const setupContext = createSetupContext(instance)
		const setupResult = setup(shallowReadonly(instance.props), setupContext)
		handleSetupResult(instance, setupResult)
	}
	setCurrentInstance(null)
}

function handleSetupResult(instance: any, setupResult: any) {
	//TODO function
	if (typeof setupResult === "object") {
		instance.setupState = setupResult
	}
	finishComponentSetup(instance)
}

function finishComponentSetup(instance: any) {
	const Component = instance.type
	if (Component.render) {
		instance.render = Component.render
	}
}

let currentInstance = null

export function getCurrentInstance() {
	return currentInstance
}

function setCurrentInstance(instance) {
	currentInstance = instance
}
