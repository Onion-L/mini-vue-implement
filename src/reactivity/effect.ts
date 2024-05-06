class ReactiveEffect {
    private _fn: any;
    //问号表示可选
    constructor(fn, public scheduler?) {
        this._fn = fn;
    }
    run() {
        activeEffect = this;
        return this._fn();
    }
}

const targetMap = new Map();
export function track(target, key) {
    //存储依赖
    let depsMap = targetMap.get(target);
    if(!depsMap) {
        depsMap = new Map();
        targetMap.set(target,depsMap);
    }
    let dep = depsMap.get(key);
    if(!dep) {
        dep = new Set();
        depsMap.set(key,dep);
    }

    dep.add(activeEffect);
}
//全局变量 
let activeEffect;

export function trigger(target,key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    for(const effect of dep) {
        if(effect.scheduler) {
            effect.scheduler();
        }else {
            effect.run();
        }
    }
}

export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn,options.scheduler);
    _effect.run();
    return _effect.run.bind(_effect);
}