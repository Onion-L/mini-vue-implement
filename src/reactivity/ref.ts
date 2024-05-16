import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
    private _value: any;
    private dep;
    private _rawValue: any;
    constructor(value) {
        this._rawValue = value;
        this._value = convert(value);
        this.dep = new Set();
    }

    get value() {
        if (isTracking()) {
            trackEffects(this.dep);
        }
        return this._value;
    }

    set value(newValue) {
        if (hasChanged(this._rawValue, newValue)) {
            this._rawValue = newValue;
            this._value = convert(newValue);
            triggerEffects(this.dep);
        }

    }
}

function convert(value) {
    return isObject(value) ? reactive(value) : value;
}

export function ref(value) {
    return new RefImpl(value);
}