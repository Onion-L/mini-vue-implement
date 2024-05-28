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

function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type
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
    patch(vnode);
}
function patch(vnode, container) {
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    const subTree = instance.render();
    patch(subTree);
}

function createApp(rootComponet) {
    return {
        mount(rootContainer) {
            /**
             * 一般在挂载时会先根据根组件创建一个虚拟节点vnode，然后再进行vnode处理
             */
            const vnode = createVNode(rootComponet);
            render(vnode);
        }
    };
}

export { createApp, h };
