import { h } from "../../dist/mini-vue-implement.esm.js"

export const Foo = {
	setup(props, { emit }) {
		const emitAdd = () => {
			emit("countAdd", 3, 4, 5)
			emit("count-add", 2)
		}
		return { emitAdd }
	},
	render() {
		const btn = h("button", { onClick: this.emitAdd }, "Click me")
		const foo = h("p", {}, "Foo: " + this.count)
		return h("div", {}, [btn, foo])
	}
}
