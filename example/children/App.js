/* eslint-disable @typescript-eslint/no-unused-vars */
import { h } from "../../dist/mini-vue-implement.esm.js"
import ArrayToText from "./ArrayToText.js"
import TextToText from "./TextToText.js"
import TextToArray from "./TextToArray.js"

export const App = {
	render() {
		return h("div", null, [
			h("p", null, "patchChildren："),
			// h(ArrayToText)
			// h(TextToText)
			h(TextToArray)
		])
	},
	setup() {
		return {
			msg: "Hello mini-vue"
		}
	}
}
