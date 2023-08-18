module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended"
  ],
  parserOptions: {
    parser: "babel-eslint"
  },
  rules: {
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off", // 禁用 debugger
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off", // 禁用 console
    "indent": "off",
    "vue/script-indent": [
      "error",
      2
    ],
    "space-before-function-paren": [
      "error",
      {
        "anonymous": "always",
        "named": "always",
        "asyncArrow": "always"
      }
    ]
  }
}
