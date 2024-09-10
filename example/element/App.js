import { h, ref } from "../../dist/mini-vue-implement.esm.js"

export const App = {
	render() {
		return h("div", null, [
			h("div", { name: "props" }, "count: " + this.count),
			h("button", { onClick: this.onClick }, "click me")
		])
	},
	setup() {
		const count = ref(1)
		const onClick = () => {
			count.value++
		}
		return {
			count,
			onClick
		}
	}
}
