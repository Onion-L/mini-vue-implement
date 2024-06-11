import { h } from "../../dist/mini-vue-implement.esm.js"
import { renderSlots } from "../../dist/mini-vue-implement.esm.js"

export const Foo = {
	setup() {},
	render() {
		const foo = h("div", {}, "foo")
		const age = 2
		return h("div", {}, [
			renderSlots(this.$slots, "header", { age }),
			foo,
			renderSlots(this.$slots, "footer")
		])
	}
}
