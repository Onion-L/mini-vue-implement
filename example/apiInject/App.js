import {
	h,
	provide,
	inject,
	createTextVNode
} from "../../dist/mini-vue-implement.esm.js"

export const App = {
	setup() {
		provide("foo", "hello Foo")
		provide("bar", "hello Bar")
	},
	render() {
		return h(Provide)
	}
}

const Provide = {
	render() {
		return h("div", null, [
			createTextVNode(`provide: ${this.foo}`),
			h(ProvideChild)
		])
	},
	setup() {
		provide("foo", "provide Two")
		provide("coo", "hello cool")
		const foo = inject("foo")
		console.log("Provide", foo)
		return { foo }
	}
}

const ProvideChild = {
	render() {
		return h("div", null, `provide child: ${this.foo} ${this.bar} ${this.baz}`)
	},
	setup() {
		const foo = inject("foo")
		const bar = inject("bar", "default Bar")
		const baz = inject("baz", () => "default Baz")
		return { foo, bar, baz }
	}
}
