# Mini Vue

## 1. 依赖收集&依赖获取

### 1.1 Proxy&Reflect

[Proxy](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
Proxy是JS中内置的一个对象，允许创建一个代理对象，用来进行拦截并定义自定义行为。代码中使用Proxy代理，在获取或修改对象的值之前，对操作进行拦截并触发自定义的方法。

```JavaScript
 return new Proxy(raw,{
        get(target,key) {
            const res = Reflect.get(target, key);
            track(target,key);
            return res;
        },

        set(target,key,value) {
            const res = Reflect.set(target,key,value);
            trigger(target,key);
            return res;
        }
    })
```

[Reflect](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
Reflect也是JS中的一个内置对象，允许通过标准化的方式操作对象，也就是说可以不使用Reflect，只是使用Reflect帮助统一标准化操作。

### 1.2 依赖收集

mini-vue中实现了一个track方法用来收集依赖。所谓依赖也就是在某一部分代码调用了对象中的某个属性，那么就称为依赖关系。这里将target作为depsMap的键，depsMap存储依赖的键值对，dep使用Set数据结构保证不存在重复值。dep内存储这ReactiveEffect的实例对象，其中包含fn属性，是使用effect时传入的方法。

```JavaScript
const targetMap = new Map();
export function track(target, key) {
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
let activeEffect;
```

### 1.3 依赖触发

修改对象属性值时会触发trigger方法，该方法调用存储在tragetMap内的依赖，获取依赖后调用依赖的方法，也就是effect传入的方法。

```JavaScript
export function trigger(target,key) {
    let depsMap = targetMap.get(target);
    let dep = depsMap.get(key);
    for(const effect of dep) {
        effect.run();
    }
}
```
