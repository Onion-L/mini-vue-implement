function createVNode(type, props, children) {
    return {
        type,
        props,
        children
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

const isObject = (val) => {
    return val !== null && typeof val === 'object';
};

const pblicPorpertiesMap = {
    $el: (i) => i.vnode.el
};
const coomponentPublicInstanceHandlers = {
    get({ _: instance }, key) {
        const { setupState } = instance;
        console.log(instance);
        if (key in setupState) {
            return Reflect.get(setupState, key);
        }
        const publicGetter = pblicPorpertiesMap[key];
        if (publicGetter) {
            return publicGetter(instance);
        }
    }
};

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
    };
    return component;
}
function setupComponent(instance) {
    //TODO initProps & initSlots
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    const { setup } = Component;
    instance.proxy = new Proxy({ _: instance }, coomponentPublicInstanceHandlers);
    if (setup) {
        const setupResult = setup();
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    //TODO function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, rootContainer) {
    patch(vnode, rootContainer);
}
function patch(vnode, container) {
    //TODO 判断是组件还是元素
    /**
     * if(isElement) {
     *  processElement(vnode,container)
     * }else {
     * processComponent(vnode,container)
     * }
     */
    if (isObject(vnode.type)) {
        processComponent(vnode, container);
    }
    else if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    }
}
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const { type, props, children } = vnode;
    const el = (vnode.el = document.createElement(type));
    for (const key in props) {
        if (props.hasOwnProperty(key)) {
            el.setAttribute(key, props[key]);
        }
    }
    //这里默认了children是string类型
    // el.textContent = children;
    //但是也有可能是Array类型，在父节点下添加多个子节
    if (typeof children === 'string') {
        el.textContent = children;
    }
    else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    container.appendChild(el);
}
function mountChildren(vnode, container) {
    vnode.children.forEach(e => {
        patch(e, container);
    });
}
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container);
}
function setupRenderEffect(instance, vnode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container);
    vnode.el = subTree.el;
}

function createApp(rootComponet) {
    return {
        mount(rootContainer) {
            /**
             * 一般在挂载时会先根据根组件创建一个虚拟节点vnode，然后再进行vnode处理
             */
            const vnode = createVNode(rootComponet);
            render(vnode, rootContainer);
        }
    };
}

export { createApp, h };
