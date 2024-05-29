# Mini Vue

## 1. Effect

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

### 1.4 runner函数

在vue中使用effect会返回一个runner函数，这个runner函数就是effect里面的函数fn，若fn中存在返回值，可将返回值赋值给其他变量，进行某些手动操作。这里实现effect中的runner函数需要保证effect函数会return当前的fn，并且在effect函数中实例化了一个ReactvieEffect对象，因此要确保返回的fn的this指向effect实例而不是ReactiveEffect类。

```JavaScript
export function effect(fn) {
    const _effect = new ReactiveEffect(fn);
    _effect.run();
    return _effect.run.bind(_effect);
}
```

### 1.5 scheduler

通过effect的第二个参数给的一个scheduler的fn(scheduler:fn)，当effect第一次执行时scheduler不会被调用，只有第一个参数fn会被调用，当响应式对象值改变时，effect就不会执行fn，而是执行scheduler。如果当执行runner时，会再次执行fn。
当响应式对象值改变后，会调用trigger方法，因此只需要在trigger方法内判断是否存在scheduler即可。

### 1.6 stop

reactivity API中包含一个stop函数，用于停止effect监听，当runner被执行时，fn会被触发。因此需要在effect中添加stop函数。首先在track方法中进行了依赖收集，将依赖存在了dep中，因此可以通过反向收集在effect中添加一个数组deps将dep添加到deps中，这样就可以在stop被调用时删除dep中对应的effect。
__onStop:__ 同时在effect内存在一个onStop参数，传入一个方法，在调用stop时，onStop内的方法会被触发。由于会有很多options，因此使用Object.assign将对象合并。

[Object Document](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object)

```JavaScript
/**
 * Object.assign(target,...sources)用于将源对象复制到目标对象中
 */
    Object.assign(_effect,options);
```

## 2. Readonly

readonly类似于reactive，但是需要控制传入的对象数值不能修改，同样使用Proxy来控制get和set。
将重复的代码封装成高阶函数，返回getter和setter方法，同时将readonly和reactive的代码封装成两个handlers。在代码初始化的时候调用getter和setter。

```JavaScript
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
// ... function createGetter and createSetter
export const mutableHandlers = {
    get,set
}
export const readonlyHandler = {
    get:readonlyGet,
    set(target,key,value) {
        console.warn(`Key:${key} cannot be set, because Target: ${target} is readonly.`)
        return true;
    }
}
```

## 3. isReactive&isReadonly

isReactive和isRreadonly方法用来判断变量是否为reactive响应式或者是只读变量。方法需要传入参数，利用代理对象的key可以判断是否为readonly。同时当传入的不是reactive也不是readonly，则无法通过Proxy的get返回布尔值，使用`!!`将返回值转换为布尔值。

```JavaScript
export const enum ReactiveFlags {
    IS_REACTIVE='__v_isReactive',
    IS_READONLY='__v_isReadonly'
}

export function isReactive(value) {
    return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value) {
    return !!value[ReactiveFlags.IS_READONLY];
}
```

## 4. Stop优化

stop函数允许我们再调用后关闭相应的effect依赖，但是当前的stop有一个问题，在这样改变数值`obj.prop = 3`时，依赖不会被触发，而当使用`obj.prop++`，依赖则会被触发，这是因为使用obj.prop++等同于obj.prop=obj.prop+1，因此会触发代理对象的get进行依赖收集并在set时触发依赖。优化的方法就是设置一个全局变量shouldTrack来控制是否进行依赖收集。

## 5. Reactive和Readonly嵌套处理

当reactive或readonly包裹的对象数值是多层对象时，需要保证每一层都为响应式或都为只读，因此需要在对象进行get操作时进行判断，判断get的值是否为对象，同时区分是否为只读（数组也是一种对象）。

## 6. shallowReadonly 功能

shallowReadonly允许设置包含浅层只读的对象，若对象是嵌套的对象则只会对第一层进行只读限制。
在实现功能时使用到了之前封装的extend方法，shallowReadonlyHandler的值类似于readonlyHandler，因此使用extend方法进行合并，第一个参数为空对象，代表将后面两个参数合并之后再与空对象合并，这是因为在使用Object.assign（extend函数），合并的值会等于第一个参数，因为他们同时指向一个对象的地址。

``` JavaScript
export const shallowReadonlyHandler = extend({}, readonlyHandler, {
    get: shallowReadonlyGet
});
```

## 7. isProxy 功能

检查一个对象是否是由 reactive()、readonly()、shallowReactive() 或 shallowReadonly() 创建的代理。

## 8. Ref 功能

ref功能允许传入一个响应式的单值进行处理，同样也可以传入对象，若是对象则将其使用reactive包裹。因为ref传入的是单值，所以无法像reactive一样使用Proxy来进行get和set操作，因此需要将ref包裹到一个类的实例对象中，使用对象来进行get和set操作，同样的需要在get时收集依赖，在set时触发依赖。在ref中同样需要收集和触发依赖，与reactive不同的是，由于ref传入的是单值，因此只需要使用一个dep来存储依赖即可。

判断修改的值前后是否相等用到了Object的一个API，与`==`不同的是，`is()`可以判断出数值的类型；与`===`不同的是，`===`会将+0和-0认为是相等，将NaN和NaN认为是不相等。

```JavaScript
Object.is(val,newVal)
```

## 9. isRef & unref 功能

isRef功能用来判断数值是否为ref。ref返回一个RefImpl的实例对象，因此直接在RefImpl类中添加一个字段__v_isRef并设置为true，这样即可判断是否为ref。unref用来返回ref的数值，是`return isRef(val) ? val.value : val`的语法糖。

## 10. proxyRefs 功能

在一个对象中包含ref值，使用proxyRefs包裹后可以不使用.value来访问该数值，这通常在Vue中的template经常使用到。实现该功能需要用到Proxy代理对象来进行get和set的拦截操作。

## 11. computed 功能

computed功能需要传入一个方法，如下：

```JavaScript
   const cValue = computed(() => {
            return user.age;
        });
```

代码中的user是一个响应式数据，cValue等于user.age的值，在user.age值改变时，cValue也会改变。
