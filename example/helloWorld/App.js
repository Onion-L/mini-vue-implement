import { h } from "../../lib/mini-vue-implement.esm.js";
window.self = null;
export const App = {
  render() {
    window.self = this;

    return h("div", { class: "head", id: "div-container" }, [
      h("ul", { class: "list" }, [
        h("li", { class: "red" }, "world"),
        h("li", { class: "red" }, "world"),
      ]),
      h("p", { class: "blue" }, "world"),
    ]);
    // return h(
    //   "div",
    //   { class: "head", id: "div-container" },
    //   `hello ${this.msg} ${this.message}`
    // );
  },
  setup() {
    return {
      msg: "mini-vue",
      message: " world",
    };
  },
};
