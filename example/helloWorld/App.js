import { h } from "../../lib/mini-vue-implement.esm.js";

export const App = {
  render() {
    return h("div " + this.msg);
  },
  setup() {
    return {
      msg: "Hello mini-vue",
    };
  },
};
