const pblicPorpertiesMap = {
    $el: (i) => i.vnode.el
}

export const coomponentPublicInstanceHandlers = {
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
}