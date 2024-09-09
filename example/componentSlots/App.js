import { h, createTextVNode } from "../../dist/mini-vue-implement.esm.js"
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

		//作用域插槽
		const foo = h(
			Foo,
			{},
			{
				header: ({ age }) => [
					h("div", null, "header slot " + age),
					createTextVNode("hello world")
				],
				footer: () => h("div", null, "footer slot")
			}
		)

		return h("div", null, [foo])
	},
	setup() {}
}
