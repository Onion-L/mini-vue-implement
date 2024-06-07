import { h } from "../../dist/mini-vue-implement.esm.js"
import { Foo } from "./Foo.js"

export const App = {
	render() {
		/**
		 * <Foo>
		 *  <slot>
		 *    <div>default slot</div>
		 *  </slot>
		 * </Foo>
		 */
		const defaultSlot = h("div", null, "default slot")
		const headerSlot = h("div", null, "header slot")
		const footerSlot = h("div", null, "footer slot")

		// const foo = h(Foo, {}, defaultSlot)

		const foo = h(Foo, {}, [defaultSlot, headerSlot])
		// const foo = h(Foo, {}, { header: headerSlot, footer: footerSlot })

		return h("div", {}, [foo])
	},
	setup() {}
}
