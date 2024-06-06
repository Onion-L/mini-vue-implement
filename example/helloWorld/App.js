import { h } from "../../lib/mini-vue-implement.esm.js";
import { Foo } from "./Foo.js";

window.self = null;
export const App = {
  render() {
    window.self = this;
    console.log(this.count);

    return h("div", {}, [
      h(
        "div",
        {
          onClick() {
            console.log("clicked");
          },
        },
        `hello ${this.msg} ${this.message} ${this.count}`
      ),
      h(Foo, {
        count: 1,
        onCountAdd: (n = 1) => {
          console.log("add", n);
        },
      }),
    ]);
  },
  setup() {
    return {
      msg: "mini-vue",
      message: " world",
      count: 1,
    };
  },
};
