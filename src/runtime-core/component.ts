import { shallowReadonly } from "../reactivity/reactive";
import { initProps } from "./componentProps";
import { coomponentPublicInstanceHandlers } from "./componentPublicInstance";

export function createComponentInstance(vnode) {
    const component = {
        vnode,
        type: vnode.type,
        setupState: {},
        props: {}
    };
    return component;
}

export function setupComponent(instance) {
    //TODO initProps & initSlots
    initProps(instance, instance.vnode.props);
    setupStatefulComponent(instance);
    console.log(instance.vnode);
}

function setupStatefulComponent(instance: any) {
    const Component = instance.type;
    const { setup } = Component;
    instance.proxy = new Proxy({ _: instance }, coomponentPublicInstanceHandlers);
    if (setup) {
        const setupResult = setup(shallowReadonly(instance.props));
        handleSetupResult(instance, setupResult);
    }
}

function handleSetupResult(instance: any, setupResult: any) {
    //TODO function
    if (typeof setupResult === 'object') {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}

function finishComponentSetup(instance: any) {
    const Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

