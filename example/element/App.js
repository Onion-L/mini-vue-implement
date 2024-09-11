import { h, ref } from "../../dist/mini-vue-implement.esm.js"

export const App = {
	render() {
		return h("div", { ...this.props }, [
			h("div", { name: "props" }, "count: " + this.count),
			h("button", { onClick: this.onClick }, "click me"),
			h("button", { onClick: this.onChangeProps1 }, "change props"),
			h("button", { onClick: this.onChangeProps2 }, "change props2"),
			h("button", { onClick: this.onChangeProps3 }, "change props3")
		])
	},
	setup() {
		const count = ref(1)
		const props = ref({
			foo: "foo",
			bar: "bar"
		})
		const onClick = () => {
			count.value++
		}
		const onChangeProps1 = () => {
			props.value.foo = "foo1"
		}

		const onChangeProps2 = () => {
			props.value.foo = undefined
			props.value.bar = null
		}

		const onChangeProps3 = () => {
			props.value = {
				foo: "foo3"
			}
		}
		return {
			count,
			onClick,
			onChangeProps1,
			onChangeProps2,
			onChangeProps3,
			props
		}
	}
}
