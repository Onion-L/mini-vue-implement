import { isObject } from "../shared/index";
import { ShapeFlags } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode: any, rootContainer: any) {
    patch(vnode, rootContainer);
}
function patch(vnode: any, container: any) {
    //判断是组件还是元素
    /**
     * if(isElement) {
     *  processElement(vnode,container)
     * }else {
     * processComponent(vnode,container)
     * }
     */

    if (vnode.shapeFlag & ShapeFlags.ELEMENT) {
        processElement(vnode, container);
    } else if (vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container)
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
    //但是也有可能是Array类 在父节点下添加多个子节
    if (vnode.shapeFlag & ShapeFlags.TEXT_CHILDREN) {
        el.textContent = children;
    } else if (vnode.shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        mountChildren(vnode, el);
    }
    container.appendChild(el);
}

function mountChildren(vnode, container) {
    vnode.children.forEach(v => {
        patch(v, container);
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



