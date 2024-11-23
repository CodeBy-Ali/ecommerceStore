export default {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } ,modules: false}],
    [
      "@babel/preset-typescript",
      { targets: { node: "current" }, rewriteImportExtensions: true },
    ],
  ],
};
