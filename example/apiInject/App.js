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
		return h(Comsumer)
	}
}

const Comsumer = {
	render() {
		console.log(this)
		return h(Provide)
	},
	setup() {
		const foo = inject("foo")
		const bar = inject("bar")
		return { foo, bar }
	}
}

const Provide = {
	render() {
		console.log(this)
		return h("div", null, `provide: ${this.foo} ${this.bar}`)
	},
	setup() {
		const foo = inject("foo")
		const bar = inject("bar")
		return { foo, bar }
	}
}
