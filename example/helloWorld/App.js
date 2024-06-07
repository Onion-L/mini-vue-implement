import { h } from "../../dist/mini-vue-implement.esm.js"
import { Foo } from "./Foo.js"

export const App = {
	render() {
		return h("div", {}, [
			h(Foo, {}, [
				h("span", null, "default slot"),
				h("span", null, "default slot")
			])
		])
	},
	setup() {}
}
