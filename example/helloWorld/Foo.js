import { h } from "../../lib/mini-vue-implement.esm.js";

export const Foo = {
  setup(props) {
    console.log("props: ", props);
    props.count++;
  },
  render() {
    return h("div", {}, "Foo: " + this.count);
  },
};