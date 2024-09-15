/* eslint-disable @typescript-eslint/no-this-alias */
// 新的是 array
// 老的是 text
import { ref, h } from "../../dist/mini-vue-implement.esm.js"

const prevChildren = "oldChild"
const nextChildren = [h("div", {}, "A"), h("div", {}, "B")]

export default {
	name: "TextToArray",
	setup() {
		const isChange = ref(false)
		window.isChange = isChange

		return {
			isChange
		}
	},
	render() {
		const self = this
		console.log("?????????")

		return self.isChange === true
			? h("div", {}, nextChildren)
			: h("div", {}, prevChildren)
	}
}
