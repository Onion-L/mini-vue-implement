import { extend } from "../shared";

//全局变量 
let activeEffect;
let shouldTrack;
class ReactiveEffect {
    private _fn: any;
    deps: any = [];
    onStop?: () => void;
    //默认active为true， 当第一次调用stop时修改为false，避免重复调用
    active = true;
    //问号表示可选
    constructor(fn, public scheduler?) {
        this._fn = fn;
    }
    run() {
        if (!this.active) {
            return this._fn();
        }
        shouldTrack = true;
        activeEffect = this;
        return this._fn();
    }
    stop() {
        if (this.active) {
            clearupEffect(this);
            if (this.onStop) {
                this.onStop();
            }
            shouldTrack = false;
            this.active = false;
        }
    }
}

function clearupEffect(effect) {
    effect.deps.forEach(dep => {
        dep.delete(effect);
    });
    effect.deps.length = 0;
}

const targetMap = new Map();
export function track(target, key) {
    if (!isTracking()) return;
    //存储依赖
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }

    if (dep.has(activeEffect)) return;
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
}

function isTracking() {
    return shouldTrack && activeEffect !== undefined;
}

export function trigger(target, key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    for (const effect of dep) {
        if (effect.scheduler) {
            effect.scheduler();
        } else {
            effect.run();
        }
    }
}

export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler);
    _effect.run();
    extend(_effect, options);
    const runner: any = _effect.run.bind(_effect);
    runner.effect = _effect;
    return runner;
}

export function stop(runner) {
    runner.effect.stop();
}