import { h } from "../../dist/mini-vue-implement.esm.js"

export const Foo = {
	setup() {},
	render() {
		const defaultSlot = this.$slots
		return h("div", {}, [defaultSlot])
	}
}
