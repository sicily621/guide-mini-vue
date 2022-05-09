import { h, ref } from "../../lib/guide-mini-vue.esm.js";
export default {
  name: "Child",
  setup(props, { emit }) {},
  render() {
      console.log(this.$props)
    return h("div", {}, [h("div", {}, "child" + this.$props.msg)]);
  },
};
