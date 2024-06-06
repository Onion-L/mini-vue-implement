import { h } from "../../lib/mini-vue-implement.esm.js";

export const Foo = {
  setup(props, { emit }) {
    // console.log("props: ", props);
    // props.count++;
    const emitAdd = () => {
      emit("countAdd", 3, 4, 5);
      emit("count-add", 2);
    };
    return { emitAdd };
  },
  render() {
    console.log("foo", this);
    const btn = h("button", { onClick: this.emitAdd }, "Click me");
    const foo = h("p", {}, "Foo: " + this.count);
    return h("div", {}, [btn, foo]);
  },
};
