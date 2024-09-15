/* eslint-disable @typescript-eslint/no-this-alias */
// 新的是 text
// 老的是 text
import { ref, h } from "../../dist/mini-vue-implement.esm.js"

const prevChildren = "oldChild"
const nextChildren = "newChild"

export default {
	name: "TextToText",
	setup() {
		const isChange = ref(false)
		window.isChange = isChange

		return {
			isChange
		}
	},
	render() {
		const self = this

		return self.isChange === true
			? h("div", {}, nextChildren)
			: h("div", {}, prevChildren)
	}
}
