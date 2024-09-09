import { h, getCurrentInstance } from "../../dist/mini-vue-implement.esm.js"
import { Foo } from "./Foo.js"

export const App = {
	render() {
		const foo = h(
			Foo,
			{},
			{
				header: ({ age }) => h("div", null, "header slot " + age),
				footer: () => h("div", null, "footer slot")
			}
		)

		return h("div", null, [foo])
	},
	setup() {
		const instance = getCurrentInstance()
		console.log("App: ", instance)
	}
}
