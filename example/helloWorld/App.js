import { h } from "../../dist/mini-vue-implement.esm.js"

export const App = {
	render() {
		return h("div", null, this.msg)
	},
	setup() {
		return {
			msg: "Hello mini-vue"
		}
	}
}
