export const extend = Object.assign;

export const isObject = (val) => val !== null && typeof val === 'object';

export const hasChanged = (val, newValue) => !Object.is(val, newValue);

export const hasOwn = (val, key) => Object.prototype.hasOwnProperty.call(val, key);

export const capitalize = (key) => key.charAt(0).toUpperCase() + key.slice(1)

export const toHandlerKey = (str: string) => str ? `on${capitalize(str)}` : '';

//转换成驼峰命名法
const camelizeRE = /-(\w)/g;
export const camelize = (str: string) => {
    return str.replace(camelizeRE, (_, c) => {
        return c.toUpperCase();
    })
}