import { h } from "../../dist/mini-vue-implement.esm.js"

export const App = {
	render() {
		return h("rect", { x: 50, y: 50 })
	},
	setup() {
		return {
			msg: "Hello mini-vue"
		}
	}
}
