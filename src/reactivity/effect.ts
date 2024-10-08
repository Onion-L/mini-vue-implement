/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
import { extend } from "../shared/index"

//全局变量
let activeEffect
let shouldTrack

export class ReactiveEffect {
	private _fn: any
	deps: any = []
	onStop?: () => void
	//默认active为true， 当第一次调用stop时修改为false，避免重复调用
	active = true
	//问号表示可选
	constructor(
		fn,
		public scheduler?
	) {
		this._fn = fn
	}
	run() {
		if (!this.active) {
			return this._fn()
		}
		shouldTrack = true
		activeEffect = this
		return this._fn()
	}
	stop() {
		if (this.active) {
			clearupEffect(this)
			if (this.onStop) {
				this.onStop()
			}
			shouldTrack = false
			this.active = false
		}
	}
}

function clearupEffect(effect) {
	effect.deps.forEach((dep) => {
		dep.delete(effect)
	})
	effect.deps.length = 0
}

const targetMap = new Map()
export function track(target, key) {
	if (!isTracking()) return
	//存储依赖
	let depsMap = targetMap.get(target)
	if (!depsMap) {
		depsMap = new Map()
		targetMap.set(target, depsMap)
	}
	let dep = depsMap.get(key)
	if (!dep) {
		dep = new Set()
		depsMap.set(key, dep)
	}

	trackEffects(dep)
}

export function trackEffects(dep) {
	if (dep.has(activeEffect)) return
	dep.add(activeEffect)
	activeEffect.deps.push(dep)
}

export function isTracking() {
	return shouldTrack && activeEffect !== undefined
}

export function trigger(target, key) {
	const depsMap = targetMap.get(target)
	const dep = depsMap.get(key)
	triggerEffects(dep)
}

export function triggerEffects(dep) {
	for (const effect of dep) {
		if (effect.scheduler) {
			effect.scheduler()
		} else {
			effect.run()
		}
	}
}

export function effect(fn, options: any = {}) {
	const _effect = new ReactiveEffect(fn)
	_effect.run()
	extend(_effect, options)
	const runner: any = _effect.run.bind(_effect)
	runner.effect = _effect
	return runner
}

export function stop(runner) {
	runner.effect.stop()
}
