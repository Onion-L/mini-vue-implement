import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode: any, rootContainer: any) {
    patch(vnode, rootContainer);
}
function patch(vnode: any, container: any) {
    //TODO 判断是组件还是元素
    /**
     * if(isElement) {
     *  processElement(vnode,container)
     * }else {
     * processComponent(vnode,container)
     * }
     */
    if (isObject(vnode.type)) {
        processComponent(vnode, container)
    } else if (typeof vnode.type === 'string') {
        processElement(vnode, container);
    }
}


function processElement(vnode: any, container: any) {
    mountElement(vnode, container);
}

function mountElement(vnode: any, container: any) {
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
    } else if (Array.isArray(children)) {
        mountChildren(vnode, el);
    }
    container.appendChild(el);
}

function mountChildren(vnode, container) {
    vnode.children.forEach(e => {
        patch(e, container);
    });
}


function processComponent(vnode: any, container: any) {
    mountComponent(vnode, container);
}

function mountComponent(vnode: any, container: any) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container);
}

function setupRenderEffect(instance: any, vnode: any, container: any) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);
    patch(subTree, container);
    vnode.el = subTree.el;
}



