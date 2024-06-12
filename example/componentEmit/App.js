import { h } from "../../dist/mini-vue-implement.esm.js"
import { Foo } from "./Foo.js"
export const App = {
	render() {
		return h("div", {}, [
			h("div", {}, `hello ${this.msg}`),
			h(Foo, {
				count: 1,
				onCountAdd: (n = 1) => {
					console.log("add", n)
				}
			})
		])
	},
	setup() {
		return {
			msg: "mini-vue"
		}
	}
}
