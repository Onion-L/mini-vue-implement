import { h } from "../../lib/mini-vue-implement.esm.js";
import { Foo } from "./Foo.js";

window.self = null;
export const App = {
  render() {
    window.self = this;
    return h(
      "div",
      {
        class: "head",
        id: "div-container",
        onClick() {
          console.log("click");
        },
        onMousedown() {
          console.log("mouse down");
        },
        onMouseup() {
          console.log("mouse up");
        },
      },
      [h("div", {}, `hello ${this.msg} ${this.message}`), h(Foo, { count: 1 })]
    );
  },
  setup() {
    return {
      msg: "mini-vue",
      message: " world",
      count: 1,
    };
  },
};
