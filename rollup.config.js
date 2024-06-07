import typescript from "@rollup/plugin-typescript";
import alias from '@rollup/plugin-alias';

export default {
  input: "src/index.ts",
  output: [
    {
      format: "cjs",
      file: "dist/mini-vue-implement.cjs.js",
    },
    {
      format: "es",
      file: "dist/mini-vue-implement.esm.js",
    },
  ],
  plugins: [typescript()]
};
