import { h } from "../../dist/mini-vue-implement.esm.js"
import { renderSlots } from "../../dist/mini-vue-implement.esm.js"

export const Foo = {
	setup() {},
	render() {
		const foo = h("div", {}, "foo")

		return h("div", {}, [
			renderSlots(this.$slots, "header"),
			foo,
			renderSlots(this.$slots, "footer")
		])
	}
}
