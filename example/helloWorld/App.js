import { h } from "../../lib/mini-vue-implement.esm.js";
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
      `hello ${this.msg} ${this.message}`
    );
  },
  setup() {
    return {
      msg: "mini-vue",
      message: " world",
    };
  },
};
